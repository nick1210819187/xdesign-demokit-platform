import { useMemo, useState } from 'react';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { Button, Card, DatePicker, Input, Segmented, Space, Table, Tabs, Tooltip, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { StatusBadge } from '../components/StatusBadge';

const hardwareSummaryItems = [
  {
    key: 'nodes',
    value: '100',
    suffix: '%',
    title: '节点使用率',
    percent: 100,
    legend: [
      { label: '已用', value: '2', color: '#124DEE' },
      { label: '异常', value: '0', color: '#F70000' },
      { label: '总数', value: '2', color: '#D6DCE8' },
    ],
  },
  {
    key: 'memory',
    value: '39.82',
    suffix: '%',
    title: '内存使用率',
    percent: 39.82,
    legend: [
      { label: '已用', value: '776.33 GB', color: '#124DEE' },
      { label: '可用', value: '1173.36 GB', color: '#B8D4FF' },
      { label: '总量', value: '1949.69 GB', color: '#D6DCE8' },
    ],
  },
  {
    key: 'cpu',
    value: '3.68',
    suffix: '%',
    title: 'CPU使用率',
    percent: 3.68,
    legend: [
      { label: '已用', value: '14.13 核', color: '#124DEE' },
      { label: '可用', value: '369.87 核', color: '#B8D4FF' },
      { label: '总量', value: '384.00 核', color: '#D6DCE8' },
    ],
  },
  {
    key: 'shared-storage',
    value: '83.69',
    suffix: '%',
    title: '共享存储使用率',
    percent: 83.69,
    legend: [
      { label: '已用', value: '6.57 TB', color: '#124DEE' },
      { label: '可用', value: '1.28 TB', color: '#B8D4FF' },
      { label: '总量', value: '7.85 TB', color: '#D6DCE8' },
    ],
  },
  {
    key: 'accelerator',
    value: '31.25',
    suffix: '%',
    title: '加速卡使用率',
    subtitle: '昇腾/Ascend910B',
    percent: 31.25,
    legend: [
      { label: '已用', value: '5张', color: '#124DEE' },
      { label: '可用', value: '11张', color: '#B8D4FF' },
      { label: '总量', value: '16张', color: '#D6DCE8' },
    ],
  },
  {
    key: 'tasks',
    value: '3',
    title: '总数',
    percent: 82,
    segments: [
      { start: 0, end: 82, color: '#124DEE' },
      { start: 82, end: 100, color: '#27C4B8' },
    ],
    legend: [
      { label: '推理', value: '2', color: '#124DEE' },
      { label: '算法开发', value: '1', color: '#27C4B8' },
      { label: '模型评估', value: '0', color: '#7A5AF8' },
      { label: '数据量化', value: '0', color: '#8FB8FF' },
      { label: '训练', value: '0', color: '#F5A623' },
    ],
  },
];

const trendCharts = [
  { key: 'cpu', title: 'CPU使用率', values: [8, 18, 13, 24, 19, 31, 46, 36, 51, 28] },
  { key: 'memory', title: '内存使用率', values: [18, 30, 24, 33, 29, 38, 54, 43, 58, 32] },
  { key: 'accelerator', title: '加速卡使用率', values: [6, 15, 10, 23, 18, 32, 47, 35, 50, 34] },
  { key: 'gpu-memory', title: '显存使用率', values: [16, 28, 23, 31, 28, 35, 52, 40, 56, 27] },
];

const chartTimes = ['07-24', '07-28', '08-01', '08-05', '08-09', '08-13', '08-17', '08-21', '08-25', '08-29'];

const nodeRows = [
  { key: '1', name: 'worker11', nodes: 1, memory: '39.72%', cpu: '3.76%', accelerator: '31.25%', gpuMemory: '24.21%', card: 'RTX PRO 5000', sharing: '未开启' },
  { key: '2', name: 'master10', nodes: 1, memory: '35.08%', cpu: '4.12%', accelerator: '25.00%', gpuMemory: '18.36%', card: 'RTX PRO 5000', sharing: '未开启' },
  { key: '3', name: 'worker12', nodes: 1, memory: '41.22%', cpu: '2.96%', accelerator: '37.50%', gpuMemory: '31.48%', card: 'RTX PRO 5000', sharing: '已开启' },
];

const nodeColumns: TableColumnsType<(typeof nodeRows)[number]> = [
  { title: '节点组名称', dataIndex: 'name', width: 180 },
  { title: '节点数', dataIndex: 'nodes', width: 120 },
  { title: '内存使用率', dataIndex: 'memory', width: 160 },
  { title: 'CPU使用率', dataIndex: 'cpu', width: 160 },
  { title: '加速卡使用率', dataIndex: 'accelerator', width: 180 },
  { title: '显存使用率', dataIndex: 'gpuMemory', width: 160 },
  { title: '加速卡', dataIndex: 'card', width: 180 },
  {
    title: '使用共享',
    dataIndex: 'sharing',
    width: 140,
    render: (value: string) => <StatusBadge status={value === '已开启' ? 'success' : 'default'} text={value} />,
  },
];

function HardwareGauge({ item }: { item: (typeof hardwareSummaryItems)[number] }) {
  const segments = item.segments ?? [{ start: 0, end: item.percent, color: '#124DEE' }];

  return (
    <div className="hardware-gauge-item">
      <div className="gpu-gauge hardware-summary-gauge">
        <svg className="gpu-gauge-svg" viewBox="0 0 152 100" role="img" aria-label={`${item.title} ${item.value}${item.suffix ?? ''}`}>
          <path className="gpu-gauge-trail" d="M18 60A58 58 0 0 1 134 60" pathLength="100" />
          {segments.map((segment) => (
            <path
              className="gpu-gauge-main"
              d="M18 60A58 58 0 0 1 134 60"
              key={`${segment.start}-${segment.end}`}
              pathLength="100"
              style={{
                stroke: segment.color,
                strokeDasharray: `${segment.end - segment.start} 100`,
                strokeDashoffset: -segment.start,
              }}
            />
          ))}
          <text className="gpu-gauge-number" x="76" y="60" textAnchor="middle">
            {item.value}{item.suffix ? <tspan>{item.suffix}</tspan> : null}
          </text>
          <text className="gpu-gauge-caption" x="76" y="88" textAnchor="middle">{item.title}</text>
        </svg>
      </div>
      {item.subtitle ? <div className="hardware-gauge-subtitle">{item.subtitle}</div> : null}
      <div className="hardware-gauge-legend">
        {item.legend.map((legend) => (
          <div className="hardware-gauge-legend-row" key={`${item.key}-${legend.label}`}>
            <i style={{ backgroundColor: legend.color }} />
            <Typography.Text type="secondary">{legend.label}</Typography.Text>
            <Typography.Text>{legend.value}</Typography.Text>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ title, values }: { title: string; values: number[] }) {
  const data = values.map((value, index) => ({
    time: chartTimes[index],
    value,
  }));

  return (
    <Card className="hardware-chart-card" bordered={false}>
      <Typography.Text className="hardware-chart-title">{title}</Typography.Text>
      <div className="hardware-chart-canvas">
        <Line
          data={data}
          xField="time"
          yField="value"
          height={220}
          shapeField="smooth"
          style={{ stroke: '#7DB3D8', lineWidth: 2 }}
          scale={{ y: { domain: [0, 100] } }}
          axis={{ y: { grid: true } }}
          tooltip={{ shared: true }}
        />
      </div>
    </Card>
  );
}

export function HardwareResourcePage() {
  const [tableSearch, setTableSearch] = useState('');
  const filteredRows = useMemo(() => {
    const keyword = tableSearch.trim().toLowerCase();
    if (!keyword) return nodeRows;
    return nodeRows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(keyword)));
  }, [tableSearch]);

  return (
    <div className="workspace-page page-stack hardware-resource-page">
      <div className="page-heading graphic-page-heading">
        <Typography.Title level={3}>硬件资源</Typography.Title>
      </div>

      <section className="surface hardware-summary-panel">
        <div className="hardware-section-title">
          <span>资源使用总量统计</span>
          <Tooltip title="展示当前硬件资源的总量和使用状态">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
        <div className="hardware-summary-grid">
          {hardwareSummaryItems.map((item) => (
            <HardwareGauge item={item} key={item.key} />
          ))}
        </div>
      </section>

      <section className="surface hardware-usage-panel">
        <div className="hardware-section-title">
          <span>资源使用汇总</span>
        </div>
        <div className="hardware-usage-toolbar">
          <Space size={8} wrap>
            <Typography.Text type="secondary">数据聚合</Typography.Text>
            <Segmented className="period-segmented" defaultValue="day" options={[
              { label: '按日', value: 'day' },
              { label: '实时', value: 'realtime' },
              { label: '按分钟', value: 'minute' },
            ]} />
          </Space>
          <Space size={8} wrap>
            <Typography.Text type="secondary">时间范围</Typography.Text>
            <DatePicker.RangePicker className="hardware-range-picker" />
          </Space>
        </div>
        <div className="hardware-chart-grid">
          {trendCharts.map((item) => (
            <TrendChart key={item.key} title={item.title} values={item.values} />
          ))}
        </div>
        <Tabs
          className="hardware-resource-tabs"
          defaultActiveKey="node-group"
          tabBarExtraContent={(
            <Space className="hardware-table-actions" size={8}>
              <Input.Search
                allowClear
                className="table-toolbar-search"
                placeholder="请输入节点组名称进行搜索"
                value={tableSearch}
                onChange={(event) => setTableSearch(event.target.value)}
                onSearch={(value) => setTableSearch(value)}
              />
              <Button className="graphic-tool-button" icon={<ReloadOutlined />} aria-label="刷新" />
            </Space>
          )}
          items={[
            {
              key: 'node-group',
              label: '节点组列表',
              children: (
                <div className="hardware-table-block">
                  <Table
                    size="middle"
                    rowKey="key"
                    columns={nodeColumns}
                    dataSource={filteredRows}
                    pagination={false}
                    scroll={{ x: 1280 }}
                  />
                </div>
              ),
            },
            {
              key: 'node',
              label: '节点列表',
              children: (
                <div className="hardware-table-empty">
                  <Typography.Text type="secondary">暂无数据</Typography.Text>
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
