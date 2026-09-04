import { useState } from 'react';
import {
  Alert,
  App,
  Button,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { DescriptionsProps, TabsProps } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FormOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '../components/StatusBadge';

type DemoItemProps = {
  title: string;
  description: string;
  tag: string;
  source?: string;
  children: React.ReactNode;
};

function DemoItem({ title, description, tag, source, children }: DemoItemProps) {
  return (
    <article className="overlay-demo-item">
      <div className="overlay-demo-copy">
        <Space size={8} wrap>
          <Typography.Text strong>{title}</Typography.Text>
          <Tag>{tag}</Tag>
        </Space>
        <Typography.Text type="secondary">{description}</Typography.Text>
        {source ? (
          <Typography.Text className="overlay-demo-source">
            业务来源：{source}
          </Typography.Text>
        ) : null}
      </div>
      <div className="overlay-demo-action">{children}</div>
    </article>
  );
}

const detailItems: DescriptionsProps['items'] = [
  { key: 'name', label: '服务名称', children: 'Qwen3-32B / V0001' },
  { key: 'status', label: '运行状态', children: <StatusBadge status="success" text="运行中" /> },
  { key: 'cluster', label: '所属集群', children: 'yigou_base_user_' },
  { key: 'node', label: '节点', children: 'node-gpu-01' },
  { key: 'protocol', label: '访问协议', children: 'HTTPS' },
  { key: 'port', label: '服务端口号', children: '18000' },
];

const roleOptions = [
  { label: '系统管理员', value: 'system-admin' },
  { label: '运营管理员', value: 'operation-admin' },
  { label: '审计管理员', value: 'audit-admin' },
  { label: '普通用户', value: 'general-user' },
];

function getPasswordStrength(password: string) {
  if (!password) return 0;

  const characterTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (password.length >= 12 && characterTypes >= 3) return 3;
  if (password.length >= 8 && characterTypes >= 2) return 2;
  return 1;
}

export function ModalDrawerPage() {
  const { message, modal } = App.useApp();
  const [createUserForm] = Form.useForm();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [longModalOpen, setLongModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [referenceDrawerOpen, setReferenceDrawerOpen] = useState(false);
  const [nestedDrawerOpen, setNestedDrawerOpen] = useState(false);
  const [nestedChildOpen, setNestedChildOpen] = useState(false);

  const passwordStrength = getPasswordStrength(passwordValue);
  const passwordStrengthMeta = [
    { label: '', color: '#d9d9d9' },
    { label: '弱', color: '#ff4d4f' },
    { label: '中等', color: '#faad14' },
    { label: '强', color: '#52c41a' },
  ][passwordStrength];

  const closeCreateUserModal = () => {
    setCreateUserOpen(false);
    setPasswordValue('');
    createUserForm.resetFields();
  };

  const drawerFooter = (onCancel: () => void, primaryText: string) => (
    <div className="overlay-drawer-footer">
      <Button onClick={onCancel}>取消</Button>
      <Button
        type="primary"
        onClick={() => {
          onCancel();
          message.success(`${primaryText}成功`);
        }}
      >
        {primaryText}
      </Button>
    </div>
  );

  const modalTab = (
    <div className="overlay-spec-body">
      <section className="overlay-guidance">
        <div>
          <Typography.Text strong>适用范围</Typography.Text>
          <Typography.Paragraph>
            用于需要用户集中注意力、完成一次明确决策或填写少量字段的任务。
          </Typography.Paragraph>
        </div>
        <div>
          <Typography.Text strong>基础规则</Typography.Text>
          <Typography.Paragraph>
            普通弹窗宽度 520px；复杂表单可扩展至 680px；所有弹窗均提供右上角关闭入口；取消在左，主操作在最右。
          </Typography.Paragraph>
        </div>
        <Alert
          showIcon
          type="info"
          message="避免在弹窗中承载多分区长表单、宽表格或需要频繁切换上下文的内容。"
        />
      </section>

      <section className="overlay-spec-section">
        <Typography.Title level={4}>常用弹窗</Typography.Title>
        <div className="overlay-demo-grid">
          <DemoItem title="标准确认" tag="明确决策" description="适用于发布、启停、提交等一次性确认。">
            <Button
              onClick={() => modal.confirm({
                title: '确认提交当前配置？',
                icon: <ExclamationCircleOutlined />,
                content: '提交后配置将立即对当前角色生效。',
                closable: true,
                okText: '确认提交',
                cancelText: '取消',
                onOk: () => message.success('配置已提交'),
              })}
            >
              打开示例
            </Button>
          </DemoItem>

          <DemoItem
            title="创建用户"
            tag="复杂表单"
            description="适用于分区明确、存在校验和动态权限项的新增任务。"
            source="FOC 平台 / 系统管理 / 用户管理 / 创建用户"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateUserOpen(true)}
            >
              打开示例
            </Button>
          </DemoItem>

          <DemoItem title="表单弹窗" tag="少量字段" description="适用于 1 至 5 个字段的轻量新增或编辑。">
            <Button icon={<FormOutlined />} onClick={() => setFormModalOpen(true)}>打开示例</Button>
          </DemoItem>

          <DemoItem title="危险操作" tag="不可逆" description="删除、清空等不可逆操作使用危险色主按钮。">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => modal.confirm({
                title: '确认删除该任务？',
                icon: <ExclamationCircleOutlined />,
                content: '删除后任务记录不可恢复。',
                closable: true,
                okText: '删除',
                cancelText: '取消',
                okButtonProps: { danger: true },
                onOk: () => message.success('任务已删除'),
              })}
            >
              打开示例
            </Button>
          </DemoItem>

          <DemoItem title="异步提交" tag="等待反馈" description="提交期间锁定主操作，并展示加载状态。">
            <Button
              onClick={() => modal.confirm({
                title: '确认部署模型？',
                content: '系统将校验资源并创建部署任务。',
                closable: true,
                okText: '开始部署',
                cancelText: '取消',
                onOk: () => new Promise<void>((resolve) => {
                  window.setTimeout(() => {
                    message.success('部署任务已创建');
                    resolve();
                  }, 1200);
                }),
              })}
            >
              打开示例
            </Button>
          </DemoItem>

          <DemoItem title="长内容弹窗" tag="有限滚动" description="内容必须阅读但不需要复杂操作时，可限制正文区域滚动。">
            <Button icon={<EyeOutlined />} onClick={() => setLongModalOpen(true)}>打开示例</Button>
          </DemoItem>
        </div>
      </section>
    </div>
  );

  const drawerTab = (
    <div className="overlay-spec-body">
      <section className="overlay-guidance">
        <div>
          <Typography.Text strong>适用范围</Typography.Text>
          <Typography.Paragraph>
            用于保留当前页面上下文的详情查看、分区编辑和较长表单。
          </Typography.Paragraph>
        </div>
        <div>
          <Typography.Text strong>底部操作</Typography.Text>
          <Typography.Paragraph>
            底部操作栏固定在抽屉内部；主操作始终位于最右侧，次要操作位于其左侧。
          </Typography.Paragraph>
        </div>
        <Alert
          showIcon
          type="info"
          message="默认使用蒙层。仅当用户需要一边查阅抽屉、一边操作底层页面时使用无蒙层抽屉。"
        />
      </section>

      <section className="overlay-spec-section">
        <Typography.Title level={4}>常用抽屉</Typography.Title>
        <div className="overlay-demo-grid">
          <DemoItem title="详情抽屉" tag="有蒙层" description="查看对象详情，关闭后继续停留在原列表位置。">
            <Button icon={<EyeOutlined />} onClick={() => setDetailDrawerOpen(true)}>打开示例</Button>
          </DemoItem>

          <DemoItem title="编辑抽屉" tag="吸底操作" description="多分区表单使用固定底部操作，滚动内容不影响提交。">
            <Button icon={<EditOutlined />} onClick={() => setEditDrawerOpen(true)}>打开示例</Button>
          </DemoItem>

          <DemoItem title="参考抽屉" tag="无蒙层" description="需要对照抽屉内容操作底层页面时使用，不承载关键确认。">
            <Button onClick={() => setReferenceDrawerOpen(true)}>打开示例</Button>
          </DemoItem>

          <DemoItem title="多级抽屉" tag="谨慎使用" description="仅用于明确的父子对象关系，最多建议两级。">
            <Button onClick={() => setNestedDrawerOpen(true)}>打开示例</Button>
          </DemoItem>
        </div>
      </section>
    </div>
  );

  const popconfirmTab = (
    <div className="overlay-spec-body">
      <section className="overlay-guidance">
        <div>
          <Typography.Text strong>适用范围</Typography.Text>
          <Typography.Paragraph>
            用于列表行、卡片或单一行动点附近的轻量确认，不打断整体工作流。
          </Typography.Paragraph>
        </div>
        <div>
          <Typography.Text strong>基础规则</Typography.Text>
          <Typography.Paragraph>
            文案保持一句话，按钮使用“取消 + 明确动作”；需要解释较多后果时改用弹窗。
          </Typography.Paragraph>
        </div>
        <Alert showIcon type="warning" message="不可逆且影响范围较大的操作，应升级为危险操作弹窗。" />
      </section>

      <section className="overlay-spec-section">
        <Typography.Title level={4}>轻量确认</Typography.Title>
        <div className="overlay-demo-grid">
          <DemoItem title="删除组件" tag="就地确认" description="删除后仍可重新添加，信息量较少。">
            <Popconfirm
              title="删除组件？"
              description="删除后可在组件库中重新添加。"
              okText="确认删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              onConfirm={() => message.success('组件已删除')}
            >
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </DemoItem>

          <DemoItem title="启用配置" tag="状态切换" description="用户需要理解切换后果时进行一次确认。">
            <Popconfirm
              title="启用当前配置？"
              description="启用后将覆盖正在使用的配置。"
              okText="启用"
              cancelText="取消"
              onConfirm={() => message.success('配置已启用')}
            >
              <Button icon={<SafetyCertificateOutlined />}>启用</Button>
            </Popconfirm>
          </DemoItem>

          <DemoItem title="恢复默认" tag="可再次编辑" description="恢复布局后仍需保存才正式生效。">
            <Popconfirm
              title="恢复默认首页？"
              description="当前布局将被默认配置覆盖。"
              okText="确认恢复"
              cancelText="取消"
              onConfirm={() => message.success('已恢复默认布局')}
            >
              <Button>恢复默认</Button>
            </Popconfirm>
          </DemoItem>
        </div>
      </section>
    </div>
  );

  const tabs: TabsProps['items'] = [
    { key: 'modal', label: '弹窗 Modal', children: modalTab },
    { key: 'drawer', label: '抽屉 Drawer', children: drawerTab },
    { key: 'popconfirm', label: '轻量确认 Popconfirm', children: popconfirmTab },
  ];

  return (
    <div className="workspace-page overlay-spec-page page-stack">
      <div className="page-heading">
        <Typography.Title level={3}>弹窗与抽屉</Typography.Title>
      </div>

      <Tabs className="overlay-spec-tabs" defaultActiveKey="modal" items={tabs} />

      <Modal
        className="create-user-modal"
        title="创建用户"
        width={680}
        open={createUserOpen}
        closable
        destroyOnHidden
        okText="确定"
        cancelText="取消"
        onCancel={closeCreateUserModal}
        onOk={() => createUserForm.submit()}
      >
        <Form
          form={createUserForm}
          layout="vertical"
          preserve={false}
          initialValues={{ roles: [{ role: undefined }] }}
          onFinish={() => {
            message.success('用户创建成功');
            closeCreateUserModal();
          }}
        >
          <section className="create-user-section">
            <Typography.Title level={5}>基本信息</Typography.Title>
            <Form.Item
              label={(
                <Space size={4}>
                  用户名
                  <Tooltip title="用户名只能包含大小写字母或数字，且长度为 6～32 位。">
                    <QuestionCircleOutlined className="create-user-help-icon" />
                  </Tooltip>
                </Space>
              )}
              name="username"
              extra="仅支持大小写字母或数字，长度为 6～32 位"
              rules={[
                { required: true, message: '请输入用户名' },
                { pattern: /^[A-Za-z0-9]{6,32}$/, message: '请输入 6～32 位大小写字母或数字' },
              ]}
            >
              <Input placeholder="请输入用户名" maxLength={32} />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码长度不能少于 8 位' },
                { max: 32, message: '密码长度不能超过 32 位' },
              ]}
            >
              <Input.Password
                placeholder="请输入 8～32 位密码"
                maxLength={32}
                onChange={(event) => setPasswordValue(event.target.value)}
              />
            </Form.Item>
            {passwordValue && (
              <div className="create-user-password-strength" aria-live="polite">
                <Typography.Text strong>安全等级</Typography.Text>
                <Progress
                  percent={(passwordStrength / 3) * 100}
                  steps={3}
                  showInfo={false}
                  strokeColor={passwordStrengthMeta.color}
                  trailColor="rgba(0, 11, 35, 0.08)"
                />
                <Typography.Text style={{ color: passwordStrengthMeta.color }}>
                  {passwordStrengthMeta.label}
                </Typography.Text>
              </div>
            )}

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请再次输入密码" maxLength={32} />
            </Form.Item>

            <Form.Item label="用户描述" name="description">
              <Input.TextArea
                className="create-user-description"
                rows={4}
                maxLength={256}
                showCount
                placeholder="请输入用户描述"
              />
            </Form.Item>
          </section>

          <section className="create-user-section create-user-role-section">
            <Typography.Title level={5}>角色权限</Typography.Title>
            <Form.List name="roles">
              {(fields, { add, remove }) => (
                <div className="create-user-role-list">
                  {fields.map((field, index) => (
                    <div className={`create-user-role-row is-compact${fields.length > 1 ? ' has-action' : ''}`} key={field.key}>
                      <Form.Item
                        name={[field.name, 'role']}
                        rules={[{ required: true, message: '请选择角色' }]}
                      >
                        <Select
                          placeholder="请选择角色"
                          options={roleOptions}
                          showSearch
                          optionFilterProp="label"
                        />
                      </Form.Item>
                      {fields.length > 1 && index === 0 && (
                        <span className="create-user-role-action-placeholder" aria-hidden />
                      )}
                      {fields.length > 1 && index > 0 && (
                        <Tooltip title="移除该权限">
                          <Button
                            className="create-user-role-remove"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            aria-label={`移除角色 ${index + 1}`}
                            onClick={() => remove(field.name)}
                          />
                        </Tooltip>
                      )}
                    </div>
                  ))}
                  <Button
                    className="create-user-role-add"
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                  >
                    添加权限
                  </Button>
                </div>
              )}
            </Form.List>
          </section>
        </Form>
      </Modal>

      <Modal
        title="编辑服务信息"
        open={formModalOpen}
        closable
        okText="保存"
        cancelText="取消"
        onCancel={() => setFormModalOpen(false)}
        onOk={() => {
          setFormModalOpen(false);
          message.success('服务信息已保存');
        }}
      >
        <Form layout="vertical" initialValues={{ protocol: 'HTTPS' }}>
          <Form.Item label="服务名称" name="name" rules={[{ required: true, message: '请输入服务名称' }]}>
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          <Form.Item label="访问协议" name="protocol">
            <Radio.Group options={['HTTPS', 'HTTP']} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="服务使用说明"
        open={longModalOpen}
        closable
        okText="我已了解"
        cancelText="取消"
        onCancel={() => setLongModalOpen(false)}
        onOk={() => setLongModalOpen(false)}
        styles={{ body: { maxHeight: 320, overflowY: 'auto' } }}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <Typography.Paragraph key={index}>
            {index + 1}. 使用服务前请确认调用权限、资源配额和访问协议。服务运行期间请持续关注告警、调用量与资源使用情况。
          </Typography.Paragraph>
        ))}
      </Modal>

      <Drawer
        title="服务详情"
        width={560}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        footer={drawerFooter(() => setDetailDrawerOpen(false), '在线体验')}
      >
        <Descriptions column={1} items={detailItems} colon={false} />
      </Drawer>

      <Drawer
        title="编辑服务"
        width={640}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        footer={drawerFooter(() => setEditDrawerOpen(false), '保存')}
      >
        <Form layout="vertical" initialValues={{ protocol: 'HTTPS', acceleration: true }}>
          <Typography.Title level={5}>基本信息</Typography.Title>
          <Form.Item label="服务名称" name="name" rules={[{ required: true, message: '请输入服务名称' }]}>
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          <Form.Item label="模型选择" name="model" rules={[{ required: true, message: '请选择模型' }]}>
            <Select placeholder="请选择模型" options={[{ value: 'Qwen3-32B' }, { value: 'DeepSeek-V4-Pro' }]} />
          </Form.Item>
          <Typography.Title level={5}>服务设置</Typography.Title>
          <Form.Item label="访问协议" name="protocol">
            <Radio.Group options={['HTTPS', 'HTTP']} />
          </Form.Item>
          <Form.Item label="模型本地加速" name="acceleration" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={5} maxLength={200} showCount />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="参数参考"
        width={480}
        mask={false}
        open={referenceDrawerOpen}
        onClose={() => setReferenceDrawerOpen(false)}
        footer={drawerFooter(() => setReferenceDrawerOpen(false), '应用')}
      >
        <Alert showIcon type="info" message="无蒙层抽屉允许继续操作底层页面。" />
        <Descriptions
          className="overlay-reference-descriptions"
          column={1}
          colon={false}
          items={[
            { key: 'tokens', label: 'max_tokens', children: '2048' },
            { key: 'temperature', label: 'temperature', children: '0.7' },
            { key: 'top-p', label: 'top_p', children: '0.9' },
          ]}
        />
      </Drawer>

      <Drawer
        title="集群详情"
        width={560}
        open={nestedDrawerOpen}
        onClose={() => setNestedDrawerOpen(false)}
        footer={drawerFooter(() => setNestedDrawerOpen(false), '完成')}
      >
        <Descriptions column={1} items={detailItems.slice(0, 4)} colon={false} />
        <Button className="overlay-nested-button" onClick={() => setNestedChildOpen(true)}>查看节点详情</Button>
        <Drawer
          title="节点详情"
          width={460}
          open={nestedChildOpen}
          onClose={() => setNestedChildOpen(false)}
          footer={drawerFooter(() => setNestedChildOpen(false), '确定')}
        >
          <Alert showIcon type="info" icon={<InfoCircleOutlined />} message="这是第二级抽屉，关闭后返回集群详情。" />
        </Drawer>
      </Drawer>
    </div>
  );
}
