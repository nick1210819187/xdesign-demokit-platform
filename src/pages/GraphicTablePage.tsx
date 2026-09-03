import { useMemo, useState } from 'react';
import {
  ConsoleSqlOutlined,
  CopyOutlined,
  ExportOutlined,
  HddOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { App, Button, Card, Descriptions, Empty, Input, Progress, Space, Statistic, Table, Tabs, Tooltip, Typography } from 'antd';
import type { DescriptionsProps, TableColumnsType } from 'antd';
import { StatusBadge } from '../components/StatusBadge';

type GpuNode = {
  key: string;
  status: '已启动' | '维护中';
  name: string;
  gpuCount: number;
  computeAllocated: number;
  computeUsed: number;
  memoryAllocated: string;
  memoryUsed: number;
  pods: number;
  driver: string;
  role: string;
};

type GpuDevice = {
  key: string;
  name: string;
  model: string;
  pcie: string;
  mode: string;
  temperature: number;
  power: number;
  gpuUsed: number;
  memory: string;
  memoryPercent: number;
};

const nodeRows: GpuNode[] = [
  {
    key: 'cp0',
    status: '已启动',
    name: 'cp0',
    gpuCount: 4,
    computeAllocated: 0,
    computeUsed: 0,
    memoryAllocated: '0/167.88',
    memoryUsed: 24.21,
    pods: 0,
    driver: '33.6.5',
    role: '控制',
  },
  {
    key: 'cp1',
    status: '已启动',
    name: 'cp1',
    gpuCount: 8,
    computeAllocated: 18,
    computeUsed: 12,
    memoryAllocated: '48/335.76',
    memoryUsed: 31.48,
    pods: 3,
    driver: '33.6.5',
    role: '计算',
  },
  {
    key: 'cp2',
    status: '维护中',
    name: 'cp2',
    gpuCount: 4,
    computeAllocated: 42,
    computeUsed: 6,
    memoryAllocated: '68/167.88',
    memoryUsed: 18.36,
    pods: 1,
    driver: '33.6.2',
    role: '计算',
  },
];

const gpuDevices: Record<string, GpuDevice[]> = {
  cp0: [
    {
      key: 'gcu-31306',
      name: 'GCU-TPUH66031306',
      model: 'Enflame S60',
      pcie: 'N/A',
      mode: 'vGCU',
      temperature: 39,
      power: 33.33,
      gpuUsed: 0,
      memory: '1129/42976 MiB',
      memoryPercent: 2.63,
    },
    {
      key: 'gcu-40404',
      name: 'GCU-TPUH66040404',
      model: 'Enflame S60',
      pcie: 'N/A',
      mode: 'vGCU',
      temperature: 36,
      power: 33.33,
      gpuUsed: 0,
      memory: '968/42976 MiB',
      memoryPercent: 2.25,
    },
  ],
  cp1: [
    {
      key: 'gcu-50108',
      name: 'GCU-TPUH66050108',
      model: 'Enflame S60',
      pcie: '0000:42:00.0',
      mode: 'vGCU',
      temperature: 43,
      power: 35.42,
      gpuUsed: 14,
      memory: '13840/42976 MiB',
      memoryPercent: 32.2,
    },
    {
      key: 'gcu-50109',
      name: 'GCU-TPUH66050109',
      model: 'Enflame S60',
      pcie: '0000:43:00.0',
      mode: 'vGCU',
      temperature: 41,
      power: 34.9,
      gpuUsed: 9,
      memory: '10624/42976 MiB',
      memoryPercent: 24.72,
    },
  ],
  cp2: [
    {
      key: 'gcu-61902',
      name: 'GCU-TPUH66061902',
      model: 'Enflame S60',
      pcie: '0000:62:00.0',
      mode: 'vGCU',
      temperature: 34,
      power: 30.12,
      gpuUsed: 0,
      memory: '7648/42976 MiB',
      memoryPercent: 17.8,
    },
  ],
};

const metricItems = [
  { label: 'GPU算力分配率', value: '0', suffix: '%' },
  { label: 'GPU算力使用率', value: '0', suffix: '%' },
  { label: 'GPU内存已分配（GiB）', value: '0/167.88' },
  { label: 'GPU内存使用率', value: '24.21', suffix: '%' },
  { label: 'GPU容器组总数', value: '0', suffix: '个' },
];

const overviewLegend = [
  { label: '已用', value: 102, suffix: '张', className: 'is-used' },
  { label: '可用', value: 24, suffix: '张', className: 'is-available' },
  { label: '异常', value: 1, suffix: '张', className: 'is-error' },
  { label: '总数', value: 128, suffix: '张', className: 'is-total' },
];

function GpuGauge() {
  return (
    <div className="gpu-gauge">
      <svg className="gpu-gauge-svg" viewBox="0 0 152 100" role="img" aria-label="GPU利用率 95%">
        <path className="gpu-gauge-trail" d="M18 60A58 58 0 0 1 134 60" pathLength="100" />
        <path className="gpu-gauge-error" d="M18 60A58 58 0 0 1 134 60" pathLength="100" />
        <path className="gpu-gauge-main" d="M18 60A58 58 0 0 1 134 60" pathLength="100" />
        <text className="gpu-gauge-number" x="76" y="60" textAnchor="middle">
          95<tspan>%</tspan>
        </text>
        <text className="gpu-gauge-caption" x="76" y="88" textAnchor="middle">GPU利用率</text>
      </svg>
    </div>
  );
}

function UsageBar({ percent }: { percent: number }) {
  return (
    <Space className={`gpu-usage-cell ${percent > 40 ? 'is-success' : 'is-primary'}`} size={8}>
      <Progress percent={percent} showInfo={false} size="small" strokeColor={percent > 40 ? '#55B144' : '#124DEE'} trailColor="rgba(0, 11, 35, 0.08)" />
      <Typography.Text>{percent}%</Typography.Text>
    </Space>
  );
}

function DeviceCard({ device }: { device: GpuDevice }) {
  const detailItems: DescriptionsProps['items'] = [
    { key: 'pcie', label: 'PCIE槽位', children: <Typography.Text>{device.pcie}</Typography.Text> },
    { key: 'temperature', label: '温度（℃）', children: <Typography.Text>{device.temperature}</Typography.Text> },
    { key: 'gpuUsed', label: 'GPU使用率', children: <UsageBar percent={device.gpuUsed} /> },
    { key: 'mode', label: '使用方式', children: <Typography.Text>{device.mode}</Typography.Text> },
    { key: 'power', label: '功耗（W）', children: <Typography.Text>{device.power}</Typography.Text> },
    { key: 'memoryPercent', label: 'GPU内存已使用', children: <UsageBar percent={device.memoryPercent} /> },
    { key: 'memory', label: '显存用量', children: <Typography.Text type="secondary">{device.memory}</Typography.Text>, span: 2 },
  ];

  return (
    <Card className="gpu-device-card" size="small">
      <div className="gpu-device-title">
        <span className="gpu-device-icon"><HddOutlined /></span>
        <Typography.Text strong>{device.name}</Typography.Text>
        <Typography.Text type="secondary">|</Typography.Text>
        <Typography.Text type="secondary">{device.model}</Typography.Text>
      </div>
      <Descriptions className="gpu-device-descriptions" size="small" column={2} colon={false} items={detailItems} />
      <Typography.Text className="gpu-device-section-title">资源分配</Typography.Text>
      <Empty className="gpu-device-empty" image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无资源分配信息" />
    </Card>
  );
}

function ExpandedGpuDevices({ row }: { row: GpuNode }) {
  return (
    <div className="gpu-expanded-panel">
      {(gpuDevices[row.key] ?? []).map((device) => <DeviceCard key={device.key} device={device} />)}
    </div>
  );
}

export function GraphicTablePage() {
  const { message } = App.useApp();
  const [tableSearch, setTableSearch] = useState('');
  const pageTools = [
    { label: '上传', icon: <UploadOutlined /> },
    { label: '终端', icon: <ConsoleSqlOutlined /> },
    { label: '导出', icon: <ExportOutlined /> },
    { label: '复制', icon: <CopyOutlined /> },
    { label: '搜索', icon: <SearchOutlined /> },
  ];

  const columns: TableColumnsType<GpuNode> = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: GpuNode['status']) => <StatusBadge status={status === '已启动' ? 'success' : 'warning'} text={status} />,
    },
    { title: '名称', dataIndex: 'name', key: 'name', width: 120, sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'GPU数量', dataIndex: 'gpuCount', key: 'gpuCount', width: 120 },
    {
      title: 'GPU算力分配率',
      dataIndex: 'computeAllocated',
      key: 'computeAllocated',
      width: 160,
      render: (value: number) => <UsageBar percent={value} />,
    },
    {
      title: 'GPU算力使用率',
      dataIndex: 'computeUsed',
      key: 'computeUsed',
      width: 160,
      render: (value: number) => <UsageBar percent={value} />,
    },
    { title: 'GPU内存已分配（GiB）', dataIndex: 'memoryAllocated', key: 'memoryAllocated', width: 190 },
    {
      title: 'GPU内存使用率',
      dataIndex: 'memoryUsed',
      key: 'memoryUsed',
      width: 160,
      render: (value: number) => <UsageBar percent={value} />,
    },
    { title: 'GPU容器组总数', dataIndex: 'pods', key: 'pods', width: 150 },
    { title: 'GPU驱动版本', dataIndex: 'driver', key: 'driver', width: 140 },
    { title: '角色', dataIndex: 'role', key: 'role', width: 100 },
  ];
  const filteredRows = useMemo(() => {
    const keyword = tableSearch.trim().toLowerCase();
    if (!keyword) return nodeRows;
    return nodeRows.filter((row) => [row.name, row.status, row.role, row.driver].some((value) => String(value).toLowerCase().includes(keyword)));
  }, [tableSearch]);

  return (
    <div className="graphic-table-page page-stack">
      <div className="page-heading graphic-page-heading">
        <Typography.Title level={3}>GPU节点</Typography.Title>
        <Space className="graphic-page-tools" size={8}>
          {pageTools.map((tool) => (
            <Tooltip title={tool.label} key={tool.label}>
              <Button
                className="graphic-tool-button"
                type="text"
                icon={tool.icon}
                aria-label={tool.label}
                onClick={() => message.success(`${tool.label}操作已触发`)}
              />
            </Tooltip>
          ))}
        </Space>
      </div>

        <main className="graphic-table-main">
          <section className="surface gpu-summary-panel">
            <Typography.Title level={4}>资源概览</Typography.Title>
            <div className="gpu-summary-content">
              <div className="gpu-utilization-card">
                <GpuGauge />
              </div>
              <div className="gpu-overview-legend">
                  {overviewLegend.map((item) => (
                    <span key={item.label}>
                      <i className={item.className} />
                      <Typography.Text type={item.className === 'is-error' ? 'danger' : undefined}>{item.label}</Typography.Text>
                      <b>{item.value}<small>{item.suffix}</small></b>
                    </span>
                  ))}
              </div>
              <div className="gpu-metric-strip">
                {metricItems.map((item) => (
                  <div className="gpu-metric-item" key={item.label}>
                    <Statistic title={item.label} value={item.value} suffix={item.suffix} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="surface gpu-table-panel">
            <Tabs
              defaultActiveKey="overview"
              items={[{ key: 'overview', label: '视图', children: null }]}
              tabBarExtraContent={(
                <Input.Search
                  allowClear
                  className="table-toolbar-search"
                  placeholder="搜索表格"
                  value={tableSearch}
                  onChange={(event) => setTableSearch(event.target.value)}
                  onSearch={(value) => setTableSearch(value)}
                />
              )}
            />
            <Table<GpuNode>
              rowKey="key"
              size="middle"
              columns={columns}
              dataSource={filteredRows}
              pagination={false}
              expandable={{ expandedRowRender: (row) => <ExpandedGpuDevices row={row} />, defaultExpandedRowKeys: ['cp0'] }}
              scroll={{ x: 1320 }}
            />
          </section>
        </main>
    </div>
  );
}
