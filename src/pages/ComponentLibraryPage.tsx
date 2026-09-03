import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Radio,
  Result,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
} from 'antd';
import type { TableProps, TimeRangePickerProps, TransferProps, UploadProps } from 'antd';
import { CloudUploadOutlined, DeleteOutlined, MoreOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { FixedUnitNumberInput, SelectUnitNumberInput, SpinnerNumberInput } from '../components/NumericInput';
import { StatusBadge } from '../components/StatusBadge';

const { RangePicker } = DatePicker;

const onDateChange = (date: Dayjs | null) => {
  if (date) {
    console.log('Date: ', date);
  } else {
    console.log('Clear');
  }
};

const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  } else {
    console.log('Clear');
  }
};

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: '近 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '近 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '近 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '近 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
];

const tableRows = [
  { key: '1', type: '安全日志', name: 'Login System', result: '成功', user: 'Administrator', time: '2021-01-26 10:57' },
  { key: '2', type: '操作日志', name: 'GetConnectInfo', result: '进行中', user: 'CloudAdapterService', time: '2021-01-26 10:55' },
  { key: '3', type: '操作日志', name: 'DeployConfig', result: '失败', user: 'OpsAdmin', time: '2021-01-26 10:48' },
];

const tableColumns: TableProps<(typeof tableRows)[number]>['columns'] = [
  { title: '日志类型', dataIndex: 'type', render: (value) => <Tag>{value}</Tag> },
  { title: '操作名称', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: '操作用户', dataIndex: 'user' },
  { title: '操作结果', dataIndex: 'result', render: (value) => <StatusBadge status={value === '成功' ? 'success' : value === '失败' ? 'error' : 'processing'} text={value} /> },
  { title: '发生时间', dataIndex: 'time' },
  { title: '操作', render: () => <Button type="link" size="small">详情</Button> },
];

const transferData: TransferProps['dataSource'] = Array.from({ length: 6 }).map((_, index) => ({
  key: String(index),
  title: `权限项 ${index + 1}`,
  description: `系统权限 ${index + 1}`,
}));

const uploadProps: UploadProps = {
  beforeUpload: () => false,
  maxCount: 1,
};

function ComponentTile({ name, type, children }: { name: string; type: string; children: ReactNode }) {
  return (
    <Card className="component-tile" size="small" title={name} extra={<Tag>{type}</Tag>}>
      {children}
    </Card>
  );
}

function AppendableRemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Tooltip title={label}>
      <Button
        aria-label={label}
        className="appendable-remove"
        danger
        icon={<DeleteOutlined />}
        type="text"
        onClick={onClick}
      />
    </Tooltip>
  );
}

function PermissionAppendableDemo() {
  const [rows, setRows] = useState([{ id: 0, locked: true }]);

  return (
    <Form layout="vertical" className="appendable-form">
      <div className="appendable-group">
        <div className="appendable-group-head">
          <Typography.Text strong>角色权限</Typography.Text>
          <Tag>默认项不可删</Tag>
        </div>
        <div className="appendable-rows">
          {rows.map((row, index) => (
            <div className={`appendable-row appendable-row-compact${rows.length > 1 ? ' has-action' : ''}`} key={row.id}>
              <Form.Item>
                <Select
                  defaultValue={index === 0 ? 'admin' : undefined}
                  optionFilterProp="label"
                  options={[
                    { value: 'admin', label: '系统管理员' },
                    { value: 'ops', label: '运维管理员' },
                    { value: 'audit', label: '审计员' },
                  ]}
                  placeholder="请选择角色"
                  showSearch
                />
              </Form.Item>
              {rows.length > 1 && (
                row.locked ? <span className="appendable-action-placeholder" aria-hidden /> : (
                  <AppendableRemoveButton
                    label={`移除角色 ${index + 1}`}
                    onClick={() => setRows((items) => items.filter((item) => item.id !== row.id))}
                  />
                )
              )}
            </div>
          ))}
        </div>
        <div className="appendable-footer">
          <Button
            className="appendable-add"
            icon={<PlusOutlined />}
            type="link"
            onClick={() => setRows((items) => [...items, { id: Math.max(...items.map((item) => item.id)) + 1, locked: false }])}
          >
            添加权限
          </Button>
          <Typography.Text type="secondary">默认权限不显示不可删图标</Typography.Text>
        </div>
      </div>
    </Form>
  );
}

function ConditionAppendableDemo() {
  const [rows, setRows] = useState([0]);
  const hasActionColumn = rows.length > 1;

  return (
    <Form layout="vertical" className="appendable-form">
      <div className="appendable-group">
        <div className="appendable-group-head">
          <Typography.Text strong>触发条件</Typography.Text>
          <Tag>二级页面</Tag>
        </div>
        <div className="appendable-rows">
          {rows.map((id, index) => (
            <div className={`appendable-row appendable-row-condition${hasActionColumn ? ' has-action' : ''}${index > 0 ? ' is-unlabeled' : ''}`} key={id}>
              <div className="appendable-controls">
                <Form.Item label={index === 0 ? '指标' : undefined}>
                  <Select
                    defaultValue={index === 0 ? 'cpu' : undefined}
                    options={[
                      { value: 'cpu', label: 'CPU 使用率' },
                      { value: 'memory', label: '内存使用率' },
                      { value: 'delay', label: '响应延迟' },
                    ]}
                    placeholder="请选择指标"
                  />
                </Form.Item>
                <Form.Item label={index === 0 ? '关系' : undefined}>
                  <Select
                    defaultValue="gt"
                    options={[
                      { value: 'gt', label: '大于' },
                      { value: 'gte', label: '大于等于' },
                      { value: 'lt', label: '小于' },
                    ]}
                  />
                </Form.Item>
                <Form.Item label={index === 0 ? '阈值' : undefined}>
                  <FixedUnitNumberInput min={0} max={100} defaultValue={80} unit="%" />
                </Form.Item>
              </div>
              {hasActionColumn && (
                <AppendableRemoveButton
                  label={`删除条件 ${index + 1}`}
                  onClick={() => setRows((items) => items.filter((item) => item !== id))}
                />
              )}
            </div>
          ))}
        </div>
        <div className="appendable-footer">
          <Button
            className="appendable-add"
            icon={<PlusOutlined />}
            type="link"
            onClick={() => setRows((items) => [...items, Math.max(...items) + 1])}
          >
            添加条件
          </Button>
          <Typography.Text type="secondary">行内字段保持 8px 关系间距</Typography.Text>
        </div>
      </div>
    </Form>
  );
}

function SwitchPanelDemo() {
  const [enabled, setEnabled] = useState(true);
  const [rows, setRows] = useState([{ id: 1, enabled: true }]);

  return (
    <Form layout="vertical" className="switch-panel-form">
      <Form.Item label="多推理服务">
        <Switch checked={enabled} onChange={setEnabled} />
      </Form.Item>
      {enabled && (
        <div className="switch-dependent-panel">
          <div className="switch-endpoint-rows">
            {rows.map((row, index) => (
              <div className={`switch-endpoint-row${index > 0 ? ' is-unlabeled' : ''}`} key={row.id}>
                <Form.Item label={index === 0 ? '服务端口号' : undefined}>
                  <SpinnerNumberInput min={1} max={65535} defaultValue={18000 + index} />
                </Form.Item>
                <Form.Item label={index === 0 ? 'API' : undefined}>
                  <Input defaultValue="/v1/chat/completions" />
                </Form.Item>
                <div className="switch-endpoint-operation">
                  {index === 0 && <Typography.Text className="switch-endpoint-operation-label">操作</Typography.Text>}
                  <div className="switch-endpoint-operation-controls">
                    <Switch
                      size="small"
                      checked={row.enabled}
                      onChange={(value) => setRows((items) => items.map((item) => item.id === row.id ? { ...item, enabled: value } : item))}
                    />
                    {rows.length > 1 && (
                      <AppendableRemoveButton
                        label={`删除端口映射 ${index + 1}`}
                        onClick={() => setRows((items) => items.filter((item) => item.id !== row.id))}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="appendable-footer">
            <Button
              className="appendable-add"
              icon={<PlusOutlined />}
              type="link"
              onClick={() => setRows((items) => [...items, { id: Math.max(...items.map((item) => item.id)) + 1, enabled: true }])}
            >
              添加
            </Button>
            <Typography.Text type="secondary">您还可以添加 {28 - rows.length} 个端口映射</Typography.Text>
          </div>
        </div>
      )}
    </Form>
  );
}

function SwitchPanelWideDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Form layout="vertical" className="switch-panel-form switch-panel-form-wide">
      <Form.Item label="启用限额">
        <Switch checked={enabled} onChange={setEnabled} />
      </Form.Item>
      {enabled && (
        <div className="switch-dependent-panel">
          <div className="switch-panel-grid">
            <Form.Item label="CPU 上限">
              <FixedUnitNumberInput min={1} max={100} defaultValue={80} unit="%" />
            </Form.Item>
            <Form.Item label="内存上限">
              <FixedUnitNumberInput min={1} max={100} defaultValue={70} unit="%" />
            </Form.Item>
            <Form.Item label="持续时间">
              <FixedUnitNumberInput min={1} max={24} defaultValue={2} unit="小时" />
            </Form.Item>
          </div>
        </div>
      )}
    </Form>
  );
}

type TableAppendableSpec = {
  key: string;
  engine: string;
  accelerator: string;
  cpu: number;
  memory: number;
};

function TableAppendableDemo() {
  const [rows, setRows] = useState<TableAppendableSpec[]>([
    { key: '1', engine: 'vLLM 0.8.10', accelerator: 'NVIDIA RTX PRO 5000', cpu: 32, memory: 256 },
  ]);

  const updateRow = (key: string, patch: Partial<TableAppendableSpec>) => {
    setRows((items) => items.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const columns: TableProps<TableAppendableSpec>['columns'] = [
    { title: '序号', width: 64, render: (_value, _record, index) => index + 1 },
    {
      title: '推理引擎',
      dataIndex: 'engine',
      width: 160,
      render: (value, row) => (
        <Select
          value={value}
          options={[{ value: 'vLLM 0.8.10' }, { value: 'MindIE 2.0' }]}
          onChange={(engine) => updateRow(row.key, { engine })}
        />
      ),
    },
    {
      title: '加速卡',
      dataIndex: 'accelerator',
      width: 200,
      render: (value, row) => (
        <Select
          value={value}
          options={[{ value: 'NVIDIA RTX PRO 5000' }, { value: 'Ascend 910B' }]}
          onChange={(accelerator) => updateRow(row.key, { accelerator })}
        />
      ),
    },
    {
      title: 'CPU（核）',
      dataIndex: 'cpu',
      width: 120,
      render: (value, row) => (
        <SpinnerNumberInput min={1} value={value} style={{ width: 112 }} onChange={(cpu) => updateRow(row.key, { cpu: cpu ?? 1 })} />
      ),
    },
    {
      title: '内存（GiB）',
      dataIndex: 'memory',
      width: 130,
      render: (value, row) => (
        <SpinnerNumberInput min={1} value={value} style={{ width: 120 }} onChange={(memory) => updateRow(row.key, { memory: memory ?? 1 })} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 64,
      fixed: 'right',
      render: (_value, row) => (
        rows.length > 1 ? (
          <AppendableRemoveButton
            label="删除资源规格"
            onClick={() => setRows((items) => items.filter((item) => item.key !== row.key))}
          />
        ) : null
      ),
    },
  ];

  return (
    <div className="table-appendable-demo">
      <Table<TableAppendableSpec>
        rowKey="key"
        size="small"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 760 }}
      />
      <div className="appendable-footer">
        <Button
          className="appendable-add"
          icon={<PlusOutlined />}
          type="link"
          onClick={() => setRows((items) => [...items, {
            key: String(Math.max(...items.map((item) => Number(item.key))) + 1),
            engine: 'vLLM 0.8.10',
            accelerator: 'NVIDIA RTX PRO 5000',
            cpu: 32,
            memory: 256,
          }])}
        >
          添加资源规格
        </Button>
        <Typography.Text type="secondary">多列强结构才使用表格追加</Typography.Text>
      </div>
    </div>
  );
}

export function ComponentLibraryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="component-library page-stack">
      <div className="page-heading">
        <div>
          <Typography.Title level={3}>组件 DemoKit</Typography.Title>
        </div>
      </div>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>查询筛选</Typography.Title>
          <Tag>Form / Input / Select / DatePicker.RangePicker / Segmented</Tag>
        </div>
        <Form layout="vertical" className="demo-query-layout">
          <div className="demo-filter-group demo-filter-group-wide">
            <Typography.Text className="demo-filter-title">分段控制器</Typography.Text>
            <Form.Item label="周期类型">
              <Segmented<string>
                className="period-segmented"
                size="large"
                defaultValue="Monthly"
                options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']}
                onChange={(value) => {
                  console.log(value);
                }}
              />
            </Form.Item>
          </div>
          <div className="demo-filter-group demo-filter-group-wide">
            <Typography.Text className="demo-filter-title">日期选择</Typography.Text>
            <div className="date-picker-demo-grid">
              <Form.Item label="单日期预设">
                <DatePicker
                  presets={[
                    { label: '昨天', value: dayjs().add(-1, 'd') },
                    { label: '上周', value: dayjs().add(-7, 'd') },
                    { label: '上月', value: dayjs().add(-1, 'month') },
                  ]}
                  onChange={onDateChange}
                />
              </Form.Item>
              <Form.Item label="日期范围预设">
                <RangePicker presets={rangePresets} onChange={onRangeChange} />
              </Form.Item>
              <Form.Item label="带时间范围预设">
                <RangePicker
                  presets={[
                    {
                      label: <span aria-label="当前时间至今日结束">现在至今日结束</span>,
                      value: () => [dayjs(), dayjs().endOf('day')],
                    },
                    ...rangePresets,
                  ]}
                  showTime
                  format="YYYY/MM/DD HH:mm:ss"
                  onChange={onRangeChange}
                />
              </Form.Item>
            </div>
          </div>
          <div className="demo-filter-group">
            <Typography.Text className="demo-filter-title">其他筛选</Typography.Text>
            <div className="demo-filter-grid">
              <Form.Item label="操作类型"><Select allowClear showSearch placeholder="请选择操作类型" options={[{ value: 'Appliance', label: 'Appliance' }, { value: 'Resource', label: 'Resource' }]} /></Form.Item>
              <Form.Item label="操作用户"><Input allowClear placeholder="请输入操作用户" /></Form.Item>
              <Form.Item className="query-actions"><Button type="primary">查询</Button></Form.Item>
            </div>
          </div>
        </Form>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>数据展示</Typography.Title>
          <Tag>Table / Descriptions / Card / Statistic / Tag / Badge / Timeline / Tree</Tag>
        </div>
        <div className="stack">
          <Table rowKey="key" size="large" columns={tableColumns} dataSource={tableRows} rowSelection={{}} pagination={{ pageSize: 3 }} />
          <div className="tile-grid two">
            <ComponentTile name="Descriptions / Statistic" type="详情">
              <Descriptions column={2} size="small" items={[
                { key: '1', label: '保存周期', children: '30 天' },
                { key: '2', label: '日志总量', children: <Statistic value={1280} suffix="条" /> },
              ]} />
            </ComponentTile>
            <ComponentTile name="Timeline / Tree" type="结构展示">
              <Space orientation="vertical" className="full">
                <Timeline items={[{ content: '创建任务' }, { content: '执行中' }, { content: '完成' }]} />
                <Tree treeData={[{ title: '系统', key: 'system', children: [{ title: '安全策略', key: 'security' }] }]} />
              </Space>
            </ComponentTile>
          </div>
        </div>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>录入与浮层</Typography.Title>
          <Tag>InputNumber / Cascader / Transfer / Upload / Modal / Drawer</Tag>
        </div>
        <div className="tile-grid three">
          <ComponentTile name="基础录入" type="Input">
            <Space orientation="vertical">
              <Input placeholder="请输入名称" />
              <FixedUnitNumberInput min={1} max={30} defaultValue={7} unit="天" />
              <SelectUnitNumberInput min={1} max={1024} defaultValue={512} />
              <TimePicker />
            </Space>
          </ComponentTile>
          <ComponentTile name="复杂录入" type="Select">
            <Space orientation="vertical" className="full">
              <Cascader placeholder="请选择资源路径" options={[{ value: 'dc-a', label: '机房 A', children: [{ value: 'rack-01', label: '机柜 01' }] }]} />
              <TreeSelect treeData={[{ title: '资源组', value: 'group', children: [{ title: 'GPU 资源组', value: 'gpu' }] }]} placeholder="请选择树节点" />
              <Transfer dataSource={transferData} render={(item) => item.title ?? ''} styles={{ section: { width: 150, height: 150 } }} />
              <Upload {...uploadProps}><Button icon={<CloudUploadOutlined />}>选择文件</Button></Upload>
            </Space>
          </ComponentTile>
          <ComponentTile name="反馈 / 浮层" type="Overlay">
            <Space wrap>
              <Button onClick={() => setModalOpen(true)}>打开 Modal</Button>
              <Button onClick={() => setDrawerOpen(true)}>打开 Drawer</Button>
              <Popconfirm title="确认删除？"><Button danger>删除</Button></Popconfirm>
              <Popover content="更多字段说明"><Button>说明</Button></Popover>
              <Tooltip title="刷新数据"><Button icon={<SettingOutlined />} /></Tooltip>
            </Space>
          </ComponentTile>
        </div>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>普通追加表单组</Typography.Title>
          <Tag>Form / Select / Input / Button</Tag>
        </div>
        <div className="appendable-showcase-grid">
          <ComponentTile name="添加权限" type="Modal">
            <PermissionAppendableDemo />
          </ComponentTile>
          <ComponentTile name="添加条件" type="Page">
            <ConditionAppendableDemo />
          </ComponentTile>
        </div>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>开关展开组</Typography.Title>
          <Tag>Switch / List / Input</Tag>
        </div>
        <div className="switch-panel-showcase-grid">
          <ComponentTile name="底色展开" type="Form">
            <SwitchPanelDemo />
          </ComponentTile>
          <ComponentTile name="多字段展开" type="Page">
            <SwitchPanelWideDemo />
          </ComponentTile>
        </div>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>表格追加组</Typography.Title>
          <Tag>Table / Select / InputNumber</Tag>
        </div>
        <ComponentTile name="资源规格" type="Table">
          <TableAppendableDemo />
        </ComponentTile>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>基础 / 导航 / 状态</Typography.Title>
          <Tag>Button / Tabs / Breadcrumb / Pagination / Steps / Result</Tag>
        </div>
        <div className="tile-grid three">
          <ComponentTile name="Button / Badge" type="基础">
            <Space wrap>
              <Button type="primary">主按钮</Button>
              <Button>默认按钮</Button>
              <Button danger>危险按钮</Button>
              <Badge count={3}><Avatar>AD</Avatar></Badge>
            </Space>
          </ComponentTile>
          <ComponentTile name="状态" type="Badge">
            <Space wrap size={16}>
              <StatusBadge status="success" text="成功" />
              <StatusBadge status="error" text="失败" />
              <StatusBadge status="processing" text="进行中" />
              <StatusBadge status="warning" text="维护中" />
              <StatusBadge status="default" text="未启动" />
            </Space>
          </ComponentTile>
          <ComponentTile name="Tabs / Breadcrumb" type="导航">
            <Space orientation="vertical" className="full">
              <Breadcrumb items={[{ title: '运维' }, { title: '日志' }, { title: '审计日志' }]} />
              <Tabs items={[{ key: '1', label: '审计日志', children: '日志内容区' }, { key: '2', label: 'Syslog 配置', children: '配置内容区' }]} />
            </Space>
          </ComponentTile>
          <ComponentTile name="Dropdown / Pagination / Steps" type="导航辅助">
            <Space orientation="vertical">
              <Button icon={<MoreOutlined />}>更多操作</Button>
              <Pagination total={86} pageSize={10} size="small" />
              <Steps size="small" current={1} items={[{ title: '配置' }, { title: '校验' }, { title: '完成' }]} />
            </Space>
          </ComponentTile>
        </div>
        <Space orientation="vertical" className="full status-stack">
          <Alert type="info" title="信息提示" showIcon />
          <Space><Spin size="small" /><Skeleton active paragraph={{ rows: 1 }} /></Space>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          <Result status="success" title="任务执行成功" subTitle="Result 用于完整反馈页或流程结束态。" extra={<Button type="primary">返回列表</Button>} />
        </Space>
      </section>

      <Modal title="Modal 对话框" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => setModalOpen(false)}>
        <Form layout="vertical">
          <Form.Item label="保存周期"><FixedUnitNumberInput min={1} max={365} defaultValue={30} unit="天" /></Form.Item>
          <Form.Item label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
      <Drawer title="Drawer 抽屉" open={drawerOpen} onClose={() => setDrawerOpen(false)} size="default">
        <Descriptions column={1} items={[{ key: '1', label: '操作用户', children: 'Administrator' }, { key: '2', label: '操作结果', children: <StatusBadge status="success" text="成功" /> }]} />
      </Drawer>
    </div>
  );
}
