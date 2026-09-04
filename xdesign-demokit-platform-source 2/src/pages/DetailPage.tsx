import { useMemo, useState } from 'react';
import {
  App,
  Button,
  Descriptions,
  Dropdown,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import type { DescriptionsProps, MenuProps, TableColumnsType, TabsProps } from 'antd';
import {
  ArrowLeftOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '../components/StatusBadge';

type SwitchRow = {
  key: string;
  name: string;
  mode: string;
  connection: string;
  networks: number;
  mtu: number;
  blocking: string;
  description: string;
};

const switchRows: SwitchRow[] = [
  {
    key: '1',
    name: 'ManagementDVS',
    mode: '普通模式',
    connection: '--',
    networks: 1,
    mtu: 1500,
    blocking: '关闭',
    description: '管理网络分布式交换机',
  },
  {
    key: '2',
    name: 'ServiceDVS',
    mode: '普通模式',
    connection: 'bond0',
    networks: 3,
    mtu: 1500,
    blocking: '关闭',
    description: '业务网络分布式交换机',
  },
];

const tabLabels = ['概览', '拓扑', '性能监控', '虚拟机', '数据存储', '分布式交换机', 'CPU信息', '配置'];
const hostSerialNumber = '这里是超长字段-超长字段-超长字段-2106194UXWXEN9-20260827';
const hostLocation = 'site / Management / Production / Rack-03 / Host-mscna03';

export function DetailPage() {
  const { message } = App.useApp();
  const [description, setDescription] = useState('--');
  const [descriptionDraft, setDescriptionDraft] = useState('--');
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('distributed-switch');
  const [search, setSearch] = useState('');

  const openDescriptionEditor = () => {
    setDescriptionDraft(description);
    setDescriptionOpen(true);
  };

  const descriptionValue = (
    <Space size={4}>
      <Typography.Text>{description}</Typography.Text>
      <Tooltip title="编辑描述">
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          aria-label="编辑描述"
          onClick={openDescriptionEditor}
        />
      </Tooltip>
    </Space>
  );

  const descriptionItems: DescriptionsProps['items'] = [
    { key: 'host-name', label: '主机名称', children: 'mscna03' },
    { key: 'status', label: '状态', children: <StatusBadge status="success" text="正常" /> },
    { key: 'description', label: '描述', children: descriptionValue },
    { key: 'os-host-name', label: 'OS主机名称', children: 'mscna03' },
    { key: 'power', label: '电源状态', children: '已上电' },
    { key: 'cpu-arch', label: 'CPU架构及厂商', children: 'x86（Intel）' },
    { key: 'device', label: '设备型号', children: '2288H V6' },
    {
      key: 'serial',
      label: '序列号',
      children: (
        <Typography.Text className="detail-ellipsis-value" ellipsis={{ tooltip: hostSerialNumber }}>
          {hostSerialNumber}
        </Typography.Text>
      ),
    },
    { key: 'rack', label: '机架名', children: 'rack' },
    { key: 'rack-position', label: '机架位', children: '3' },
    { key: 'host-ip', label: '主机IP', children: '70.189.23.40' },
    { key: 'ibmc-ip', label: 'iBMC IP地址', children: <Typography.Link>70.189.225.25</Typography.Link> },
    { key: 'mounted-vm', label: '挂载光驱的虚拟机', children: '0' },
    { key: 'imc', label: 'IMC模式', children: '未开启' },
    {
      key: 'location',
      label: '所属位置',
      children: (
        <Typography.Link className="detail-ellipsis-value" ellipsis={{ tooltip: hostLocation }}>
          {hostLocation}
        </Typography.Link>
      ),
    },
    { key: 'disk', label: '磁盘总容量', children: '94178 GB' },
    { key: 'failover', label: '是否为故障切换主机', children: '否' },
    { key: 'version', label: '版本号', children: '23.6.2' },
    { key: 'uid', label: 'UID灯状态', children: 'UID灭灯' },
    { key: 'maintenance', label: '维护状态', children: '否' },
  ];

  const moreItems: MenuProps['items'] = [
    { key: 'maintenance', label: '进入维护模式' },
    { key: 'uid', label: '设置 UID 灯' },
    { key: 'export', label: '导出主机信息' },
  ];

  const columns: TableColumnsType<SwitchRow> = [
    { title: '名称', dataIndex: 'name', key: 'name', width: 180, render: (value) => <Typography.Link>{value}</Typography.Link> },
    { title: '交换机类型', dataIndex: 'mode', key: 'mode', width: 140 },
    { title: '连接类型', dataIndex: 'connection', key: 'connection', width: 130 },
    { title: '网络个数', dataIndex: 'networks', key: 'networks', width: 110, sorter: (a, b) => a.networks - b.networks },
    { title: 'MTU', dataIndex: 'mtu', key: 'mtu', width: 100, sorter: (a, b) => a.mtu - b.mtu },
    { title: '组播', dataIndex: 'blocking', key: 'blocking', width: 110 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: () => (
        <Space size={12}>
          <Typography.Link>编辑</Typography.Link>
          <Typography.Link>删除</Typography.Link>
        </Space>
      ),
    },
  ];

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return switchRows;
    return switchRows.filter((item) => `${item.name}${item.mode}${item.description}`.toLowerCase().includes(keyword));
  }, [search]);

  const distributedSwitchPanel = (
    <div className="detail-tab-panel">
      <div className="detail-table-toolbar">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          创建分布式交换机
        </Button>
        <Space size={8}>
          <Input.Search
            allowClear
            className="table-toolbar-search"
            placeholder="搜索表格"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onSearch={(value) => setSearch(value)}
          />
          <Button icon={<ReloadOutlined />} aria-label="刷新" onClick={() => message.success('列表已刷新')} />
          <Button icon={<SettingOutlined />} aria-label="列表设置" />
        </Space>
      </div>
      <Table<SwitchRow>
        rowKey="key"
        columns={columns}
        dataSource={filteredRows}
        pagination={false}
        scroll={{ x: 1040 }}
      />
    </div>
  );

  const tabs: TabsProps['items'] = tabLabels.map((label) => {
    const key = label === '分布式交换机' ? 'distributed-switch' : label;
    return {
      key,
      label,
      children: key === 'distributed-switch'
        ? distributedSwitchPanel
        : <div className="detail-tab-placeholder">{label}内容区</div>,
    };
  });

  return (
    <div className="workspace-page detail-page">
      <header className="service-page-heading detail-page-heading">
        <Space size={10} align="center">
          <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" />
          <Typography.Title level={3}>主机详情</Typography.Title>
        </Space>
        <Space className="detail-page-heading-actions" size={8}>
          <Button icon={<ReloadOutlined />} aria-label="刷新详情" onClick={() => message.success('详情已刷新')} />
          <Dropdown menu={{ items: moreItems, onClick: ({ key }) => message.info(`已选择：${key}`) }}>
            <Button>更多 <DownOutlined /></Button>
          </Dropdown>
          <Button onClick={() => message.info('已发起重启确认')}>重启</Button>
          <Button onClick={() => message.warning('已发起下电确认')}>下电</Button>
          <Button onClick={() => message.info('请选择目标主机')}>移动</Button>
          <Button type="primary" onClick={() => message.success('已进入创建虚拟机流程')}>创建虚拟机</Button>
        </Space>
      </header>

      <div className="detail-page-content">
        <section className="detail-info-section">
          <Descriptions title="基本信息" items={descriptionItems} column={{ xs: 1, sm: 2, lg: 3, xl: 4 }} colon={false} />
        </section>

        <section className="detail-tabs-section">
          <Tabs activeKey={activeTab} items={tabs} onChange={setActiveTab} />
        </section>
      </div>

      <Modal
        className="detail-description-modal"
        title="编辑描述"
        open={descriptionOpen}
        okText="保存"
        cancelText="取消"
        onCancel={() => setDescriptionOpen(false)}
        onOk={() => {
          setDescription(descriptionDraft.trim() || '--');
          setDescriptionOpen(false);
          message.success('描述已更新');
        }}
      >
        <div className="detail-description-field">
          <Input.TextArea
            rows={4}
            maxLength={200}
            showCount
            placeholder="请输入主机描述"
            value={descriptionDraft}
            onChange={(event) => setDescriptionDraft(event.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="创建分布式交换机"
        open={createOpen}
        okText="创建"
        cancelText="取消"
        onCancel={() => setCreateOpen(false)}
        onOk={() => {
          setCreateOpen(false);
          message.success('分布式交换机已创建');
        }}
      >
        <Form layout="vertical" initialValues={{ mode: '普通模式', mtu: '1500' }}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入交换机名称' }]}>
            <Input placeholder="请输入交换机名称" />
          </Form.Item>
          <Form.Item name="mode" label="交换机类型">
            <Select options={[{ value: '普通模式' }, { value: 'SR-IOV模式' }]} />
          </Form.Item>
          <Form.Item name="mtu" label="MTU"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
