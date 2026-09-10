import { useMemo, useState } from 'react';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { Button, Card, DatePicker, Input, Segmented, Space, Table, Tabs, Tooltip, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { StatusBadge } from '../components/StatusBadge';
import type { Locale } from '../i18n';

const hardwareText = {
  zh: {
    pageTitle: '硬件资源',
    totalStats: '资源使用总量统计',
    totalStatsTip: '展示当前硬件资源的总量和使用状态',
    usageSummary: '资源使用汇总',
    dataAggregation: '数据聚合',
    byDay: '按日',
    realtime: '实时',
    byMinute: '按分钟',
    timeRange: '时间范围',
    rangeStart: '开始日期',
    rangeEnd: '结束日期',
    searchNodeGroup: '请输入节点组名称进行搜索',
    refresh: '刷新',
    nodeGroupList: '节点组列表',
    nodeList: '节点列表',
    empty: '暂无数据',
    nodeUsage: '节点使用率',
    memoryUsage: '内存使用率',
    cpuUsage: 'CPU使用率',
    sharedStorageUsage: '共享存储使用率',
    acceleratorUsage: '加速卡使用率',
    gpuMemoryUsage: '显存使用率',
    runningTasks: '运行任务总数',
    used: '已用',
    abnormal: '异常',
    total: '总数',
    available: '可用',
    totalAmount: '总量',
    inference: '推理',
    algorithm: '算法开发',
    eval: '模型评估',
    quantization: '数据量化',
    training: '训练',
    nodeGroupName: '节点组名称',
    nodeCount: '节点数',
    accelerator: '加速卡',
    sharing: '使用共享',
    enabled: '已开启',
    disabled: '未开启',
    cores: '核',
    cards: '张',
    ascend: '昇腾',
  },
  en: {
    pageTitle: 'Hardware Resources',
    totalStats: 'Total Resource Usage',
    totalStatsTip: 'Shows total capacity and current usage for hardware resources',
    usageSummary: 'Resource Usage Summary',
    dataAggregation: 'Aggregation',
    byDay: 'Daily',
    realtime: 'Real-time',
    byMinute: 'Per Minute',
    timeRange: 'Time Range',
    rangeStart: 'Start date',
    rangeEnd: 'End date',
    searchNodeGroup: 'Search node group name',
    refresh: 'Refresh',
    nodeGroupList: 'Node Group List',
    nodeList: 'Node List',
    empty: 'No data',
    nodeUsage: 'Node Usage',
    memoryUsage: 'Memory Usage',
    cpuUsage: 'CPU Usage',
    sharedStorageUsage: 'Shared Storage Usage',
    acceleratorUsage: 'Accelerator Usage',
    gpuMemoryUsage: 'GPU Memory Usage',
    runningTasks: 'Running Tasks',
    used: 'Used',
    abnormal: 'Abnormal',
    total: 'Total',
    available: 'Available',
    totalAmount: 'Total',
    inference: 'Inference',
    algorithm: 'Algorithm Development',
    eval: 'Model Evaluation',
    quantization: 'Data Quantization',
    training: 'Training',
    nodeGroupName: 'Node Group Name',
    nodeCount: 'Nodes',
    accelerator: 'Accelerator',
    sharing: 'Shared Mode',
    enabled: 'Enabled',
    disabled: 'Disabled',
    cores: 'cores',
    cards: 'cards',
    ascend: 'Ascend',
  },
};

type HardwareTextKey = keyof typeof hardwareText.zh;
type HardwareText = Record<HardwareTextKey, string>;
type HardwareSummaryItem = {
  key: string;
  value: string;
  suffix?: string;
  titleKey: HardwareTextKey;
  subtitle?: string;
  percent: number;
  segments?: Array<{ start: number; end: number; color: string }>;
  legend: Array<{ labelKey: HardwareTextKey; value: string; color: string }>;
};
type TrendChartItem = {
  key: string;
  titleKey: HardwareTextKey;
  values: number[];
};

const hardwareSummaryItems: HardwareSummaryItem[] = [
  {
    key: 'nodes',
    value: '100',
    suffix: '%',
    titleKey: 'nodeUsage',
    percent: 100,
    legend: [
      { labelKey: 'used', value: '2', color: '#124DEE' },
      { labelKey: 'abnormal', value: '0', color: '#F70000' },
      { labelKey: 'total', value: '2', color: '#D6DCE8' },
    ],
  },
  {
    key: 'memory',
    value: '39.82',
    suffix: '%',
    titleKey: 'memoryUsage',
    percent: 39.82,
    legend: [
      { labelKey: 'used', value: '776.33 GB', color: '#124DEE' },
      { labelKey: 'available', value: '1173.36 GB', color: '#B8D4FF' },
      { labelKey: 'totalAmount', value: '1949.69 GB', color: '#D6DCE8' },
    ],
  },
  {
    key: 'cpu',
    value: '3.68',
    suffix: '%',
    titleKey: 'cpuUsage',
    percent: 3.68,
    legend: [
      { labelKey: 'used', value: '14.13 核', color: '#124DEE' },
      { labelKey: 'available', value: '369.87 核', color: '#B8D4FF' },
      { labelKey: 'totalAmount', value: '384.00 核', color: '#D6DCE8' },
    ],
  },
  {
    key: 'shared-storage',
    value: '83.69',
    suffix: '%',
    titleKey: 'sharedStorageUsage',
    percent: 83.69,
    legend: [
      { labelKey: 'used', value: '6.57 TB', color: '#124DEE' },
      { labelKey: 'available', value: '1.28 TB', color: '#B8D4FF' },
      { labelKey: 'totalAmount', value: '7.85 TB', color: '#D6DCE8' },
    ],
  },
  {
    key: 'accelerator',
    value: '31.25',
    suffix: '%',
    titleKey: 'acceleratorUsage',
    subtitle: '昇腾/Ascend910B',
    percent: 31.25,
    legend: [
      { labelKey: 'used', value: '5张', color: '#124DEE' },
      { labelKey: 'available', value: '11张', color: '#B8D4FF' },
      { labelKey: 'totalAmount', value: '16张', color: '#D6DCE8' },
    ],
  },
  {
    key: 'tasks',
    value: '3',
    titleKey: 'runningTasks',
    percent: 82,
    segments: [
      { start: 0, end: 82, color: '#124DEE' },
      { start: 82, end: 100, color: '#27C4B8' },
    ],
    legend: [
      { labelKey: 'inference', value: '2', color: '#124DEE' },
      { labelKey: 'algorithm', value: '1', color: '#27C4B8' },
      { labelKey: 'eval', value: '0', color: '#7A5AF8' },
      { labelKey: 'quantization', value: '0', color: '#8FB8FF' },
      { labelKey: 'training', value: '0', color: '#F5A623' },
    ],
  },
];

const trendCharts: TrendChartItem[] = [
  { key: 'cpu', titleKey: 'cpuUsage', values: [8, 18, 13, 24, 19, 31, 46, 36, 51, 28] },
  { key: 'memory', titleKey: 'memoryUsage', values: [18, 30, 24, 33, 29, 38, 54, 43, 58, 32] },
  { key: 'accelerator', titleKey: 'acceleratorUsage', values: [6, 15, 10, 23, 18, 32, 47, 35, 50, 34] },
  { key: 'gpu-memory', titleKey: 'gpuMemoryUsage', values: [16, 28, 23, 31, 28, 35, 52, 40, 56, 27] },
];

const chartTimes = ['07-24', '07-28', '08-01', '08-05', '08-09', '08-13', '08-17', '08-21', '08-25', '08-29'];

const nodeRows = [
  { key: '1', name: 'worker11', nodes: 1, memory: '39.72%', cpu: '3.76%', accelerator: '31.25%', gpuMemory: '24.21%', card: 'RTX PRO 5000', sharing: '未开启' },
  { key: '2', name: 'master10', nodes: 1, memory: '35.08%', cpu: '4.12%', accelerator: '25.00%', gpuMemory: '18.36%', card: 'RTX PRO 5000', sharing: '未开启' },
  { key: '3', name: 'worker12', nodes: 1, memory: '41.22%', cpu: '2.96%', accelerator: '37.50%', gpuMemory: '31.48%', card: 'RTX PRO 5000', sharing: '已开启' },
];

const formatHardwareValue = (value: string, text: HardwareText) => value
  .replace(/ 核/g, ` ${text.cores}`)
  .replace(/张/g, ` ${text.cards}`);

function HardwareGauge({ item, text }: { item: HardwareSummaryItem; text: HardwareText }) {
  const segments = item.segments ?? [{ start: 0, end: item.percent, color: '#124DEE' }];
  const title = text[item.titleKey];

  return (
    <div className="hardware-gauge-item">
      <div className="gpu-gauge hardware-summary-gauge">
        <svg className="gpu-gauge-svg" viewBox="0 0 152 100" role="img" aria-label={`${title} ${item.value}${item.suffix ?? ''}`}>
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
          <text className="gpu-gauge-caption" x="76" y="88" textAnchor="middle">{title}</text>
        </svg>
      </div>
      {item.subtitle ? <div className="hardware-gauge-subtitle">{item.subtitle.replace('昇腾', text.ascend)}</div> : null}
      <div className="hardware-gauge-legend">
        {item.legend.map((legend) => (
          <div className="hardware-gauge-legend-row" key={`${item.key}-${legend.labelKey}`}>
            <i style={{ backgroundColor: legend.color }} />
            <Typography.Text type="secondary">{text[legend.labelKey]}</Typography.Text>
            <Typography.Text>{formatHardwareValue(legend.value, text)}</Typography.Text>
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
    <Card className="hardware-chart-card" variant="borderless">
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

export function HardwareResourcePage({ locale = 'zh' }: { locale?: Locale }) {
  const text = hardwareText[locale];
  const [tableSearch, setTableSearch] = useState('');
  const filteredRows = useMemo(() => {
    const keyword = tableSearch.trim().toLowerCase();
    if (!keyword) return nodeRows;
    return nodeRows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(keyword)));
  }, [tableSearch]);
  const nodeColumns: TableColumnsType<(typeof nodeRows)[number]> = [
    { title: text.nodeGroupName, dataIndex: 'name', width: 180 },
    { title: text.nodeCount, dataIndex: 'nodes', width: 120 },
    { title: text.memoryUsage, dataIndex: 'memory', width: 160 },
    { title: text.cpuUsage, dataIndex: 'cpu', width: 160 },
    { title: text.acceleratorUsage, dataIndex: 'accelerator', width: 180 },
    { title: text.gpuMemoryUsage, dataIndex: 'gpuMemory', width: 160 },
    { title: text.accelerator, dataIndex: 'card', width: 180 },
    {
      title: text.sharing,
      dataIndex: 'sharing',
      width: 140,
      render: (value: string) => <StatusBadge status={value === '已开启' ? 'success' : 'default'} text={value === '已开启' ? text.enabled : text.disabled} />,
    },
  ];

  return (
    <div className="workspace-page page-stack hardware-resource-page">
      <div className="page-heading graphic-page-heading">
        <Typography.Title level={3}>{text.pageTitle}</Typography.Title>
      </div>

      <section className="surface hardware-summary-panel">
        <div className="hardware-section-title">
          <span>{text.totalStats}</span>
          <Tooltip title={text.totalStatsTip}>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
        <div className="hardware-summary-grid">
          {hardwareSummaryItems.map((item) => (
            <HardwareGauge item={item} text={text} key={item.key} />
          ))}
        </div>
      </section>

      <section className="surface hardware-usage-panel">
        <div className="hardware-section-title">
          <span>{text.usageSummary}</span>
        </div>
        <div className="hardware-usage-toolbar">
          <Space size={8} wrap>
            <Typography.Text type="secondary">{text.dataAggregation}</Typography.Text>
            <Segmented className="period-segmented" defaultValue="day" options={[
              { label: text.byDay, value: 'day' },
              { label: text.realtime, value: 'realtime' },
              { label: text.byMinute, value: 'minute' },
            ]} />
          </Space>
          <Space size={8} wrap>
            <Typography.Text type="secondary">{text.timeRange}</Typography.Text>
            <DatePicker.RangePicker className="hardware-range-picker" placeholder={[text.rangeStart, text.rangeEnd]} />
          </Space>
        </div>
        <div className="hardware-chart-grid">
          {trendCharts.map((item) => (
            <TrendChart key={item.key} title={text[item.titleKey]} values={item.values} />
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
                placeholder={text.searchNodeGroup}
                value={tableSearch}
                onChange={(event) => setTableSearch(event.target.value)}
                onSearch={(value) => setTableSearch(value)}
              />
              <Button className="graphic-tool-button" icon={<ReloadOutlined />} aria-label={text.refresh} />
            </Space>
          )}
          items={[
            {
              key: 'node-group',
              label: text.nodeGroupList,
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
              label: text.nodeList,
              children: (
                <div className="hardware-table-empty">
                  <Typography.Text type="secondary">{text.empty}</Typography.Text>
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
