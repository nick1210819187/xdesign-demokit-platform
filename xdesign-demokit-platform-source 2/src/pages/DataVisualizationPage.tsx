import { useMemo, useState, type ReactNode } from 'react';
import { Area, Bar, Column, Line, Pie, Radar } from '@ant-design/charts';
import { Card, Progress, Segmented, Space, Statistic, Tag, Typography } from 'antd';

type Period = '近24小时' | '近7天' | '近30天';

const chartColors = ['#124DEE', '#78BE67', '#EC6F1A', '#7E6BEF', '#5B8FF9'];

const runtimeTrend = [
  { time: '00:00', value: 51, category: '推理服务' },
  { time: '04:00', value: 58, category: '推理服务' },
  { time: '08:00', value: 76, category: '推理服务' },
  { time: '12:00', value: 68, category: '推理服务' },
  { time: '16:00', value: 89, category: '推理服务' },
  { time: '20:00', value: 73, category: '推理服务' },
  { time: '00:00', value: 37, category: '训练服务' },
  { time: '04:00', value: 42, category: '训练服务' },
  { time: '08:00', value: 55, category: '训练服务' },
  { time: '12:00', value: 47, category: '训练服务' },
  { time: '16:00', value: 64, category: '训练服务' },
  { time: '20:00', value: 53, category: '训练服务' },
];

const tokenTrend = [
  { time: '00:00', value: 24 },
  { time: '04:00', value: 31 },
  { time: '08:00', value: 47 },
  { time: '12:00', value: 43 },
  { time: '16:00', value: 68 },
  { time: '20:00', value: 56 },
  { time: '24:00', value: 72 },
];

const deployData = [
  { day: '周一', status: '成功', value: 42 },
  { day: '周一', status: '失败', value: 4 },
  { day: '周二', status: '成功', value: 38 },
  { day: '周二', status: '失败', value: 3 },
  { day: '周三', status: '成功', value: 54 },
  { day: '周三', status: '失败', value: 6 },
  { day: '周四', status: '成功', value: 49 },
  { day: '周四', status: '失败', value: 2 },
  { day: '周五', status: '成功', value: 62 },
  { day: '周五', status: '失败', value: 5 },
  { day: '周六', status: '成功', value: 45 },
  { day: '周六', status: '失败', value: 4 },
  { day: '周日', status: '成功', value: 39 },
  { day: '周日', status: '失败', value: 3 },
];

const serviceData = [
  { service: 'chat-completion', value: 1280 },
  { service: 'embedding', value: 980 },
  { service: 'reranker', value: 760 },
  { service: 'image-generation', value: 540 },
  { service: 'speech-to-text', value: 420 },
];

const resourceData = [
  { type: 'GPU', value: 42 },
  { type: 'CPU', value: 28 },
  { type: '内存', value: 18 },
  { type: '存储', value: 12 },
];

const taskData = [
  { type: '运行中', value: 46 },
  { type: '等待中', value: 22 },
  { type: '已完成', value: 28 },
  { type: '异常', value: 4 },
];

const capabilityData = [
  { item: '稳定性', value: 92, series: '当前集群' },
  { item: '吞吐量', value: 78, series: '当前集群' },
  { item: '资源利用', value: 85, series: '当前集群' },
  { item: '扩展能力', value: 71, series: '当前集群' },
  { item: '成本效率', value: 80, series: '当前集群' },
  { item: '稳定性', value: 76, series: '目标基线' },
  { item: '吞吐量', value: 70, series: '目标基线' },
  { item: '资源利用', value: 76, series: '目标基线' },
  { item: '扩展能力', value: 68, series: '目标基线' },
  { item: '成本效率', value: 72, series: '目标基线' },
];

function ChartCard({ title, type, children }: { title: string; type: string; children: ReactNode }) {
  return (
    <Card className="visual-chart-card" size="small" title={title} extra={<Tag>{type}</Tag>}>
      <div className="visual-chart-canvas">{children}</div>
    </Card>
  );
}

function ChartSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="visual-section">
      <div className="visual-section-heading">
        <div>
          <Typography.Title level={4}>{title}</Typography.Title>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </div>
      </div>
      <div className="visual-chart-grid">{children}</div>
    </section>
  );
}

export function DataVisualizationPage() {
  const [period, setPeriod] = useState<Period>('近24小时');
  const multiplier = period === '近24小时' ? 1 : period === '近7天' ? 1.55 : 2.1;
  const summary = useMemo(() => ({
    requests: Math.round(26840 * multiplier),
    services: period === '近24小时' ? 38 : period === '近7天' ? 63 : 86,
    tokens: Math.round(1.28 * multiplier * 100) / 100,
  }), [multiplier, period]);

  return (
    <div className="data-visualization-page page-stack">
      <div className="page-heading visual-page-heading">
        <div>
          <Typography.Title level={3}>数据可视化</Typography.Title>
        </div>
        <Segmented<Period> value={period} options={['近24小时', '近7天', '近30天']} onChange={setPeriod} />
      </div>

      <section className="visual-summary-grid">
        <Card size="small"><Statistic title="请求总量" value={summary.requests} suffix="次" /></Card>
        <Card size="small"><Statistic title="在线服务" value={summary.services} suffix="个" /></Card>
        <Card size="small"><Statistic title="Token 消耗" value={summary.tokens} precision={2} suffix="B" /></Card>
        <Card size="small" className="visual-health-card">
          <Typography.Text type="secondary">集群健康度</Typography.Text>
          <Space size={12} align="center"><Progress type="circle" percent={96} size={48} strokeColor="#55B144" railColor="#E7F1E2" /><Typography.Text strong>运行正常</Typography.Text></Space>
        </Card>
      </section>

      <ChartSection title="趋势分析" description="观察业务量、资源和消耗随时间的变化。">
        <ChartCard title="服务请求趋势" type="折线图">
          <Line
            key={`line-${period}`}
            data={runtimeTrend.map((item) => ({ ...item, value: Math.round(item.value * multiplier) }))}
            xField="time"
            yField="value"
            colorField="category"
            scale={{ color: { range: chartColors.slice(0, 2) } }}
            axis={{ y: { grid: true } }}
            legend={{ position: 'top' }}
            tooltip={{ shared: true }}
          />
        </ChartCard>
        <ChartCard title="Token 消耗趋势" type="面积图">
          <Area
            key={`area-${period}`}
            data={tokenTrend.map((item) => ({ ...item, value: Math.round(item.value * multiplier) }))}
            xField="time"
            yField="value"
            style={{ fill: '#124DEE', fillOpacity: 0.16, stroke: '#124DEE', lineWidth: 2 }}
            axis={{ y: { grid: true } }}
          />
        </ChartCard>
      </ChartSection>

      <ChartSection title="对比分析" description="横向比较服务调用量和任务执行结果。">
        <ChartCard title="部署任务结果" type="堆叠柱状图">
          <Column
            data={deployData}
            xField="day"
            yField="value"
            colorField="status"
            scale={{ color: { domain: ['成功', '失败'], range: ['#124DEE', '#F70000'] } }}
            transform={[{ type: 'stackY' }]}
            axis={{ y: { grid: true } }}
            legend={{ position: 'top' }}
          />
        </ChartCard>
        <ChartCard title="服务调用排名" type="条形图">
          <Bar
            data={serviceData.map((item) => ({ ...item, value: Math.round(item.value * multiplier) }))}
            xField="service"
            yField="value"
            color="#124DEE"
            axis={{ y: { grid: true } }}
          />
        </ChartCard>
      </ChartSection>

      <ChartSection title="占比结构" description="查看资源和任务状态在整体中的比例。">
        <ChartCard title="资源使用分布" type="环形图">
          <Pie
            data={resourceData}
            angleField="value"
            colorField="type"
            innerRadius={0.68}
            scale={{ color: { range: chartColors } }}
            legend={{ position: 'bottom' }}
            label={{ text: 'type', position: 'outside' }}
          />
        </ChartCard>
        <ChartCard title="任务状态分布" type="饼图">
          <Pie
            data={taskData}
            angleField="value"
            colorField="type"
            scale={{ color: { range: ['#124DEE', '#8FB8FF', '#55B144', '#F70000'] } }}
            legend={{ position: 'bottom' }}
            label={{ text: 'type', position: 'outside' }}
          />
        </ChartCard>
      </ChartSection>

      <ChartSection title="监控评估" description="面向运行监控与能力评估的常用视图。">
        <ChartCard title="GPU 使用率" type="半圆仪表盘">
          <div className="gauge-wrap">
            <Progress
              type="dashboard"
              percent={76}
              gapDegree={180}
              gapPlacement="bottom"
              strokeColor="#124DEE"
              railColor="#E8EEF9"
              format={() => '76%'}
            />
            <div className="gauge-label"><span>GPU 使用率</span></div>
          </div>
        </ChartCard>
        <ChartCard title="集群能力评估" type="雷达图">
          <Radar
            data={capabilityData}
            xField="item"
            yField="value"
            colorField="series"
            scale={{ color: { range: ['#124DEE', '#8FB8FF'] }, y: { domain: [0, 100] } }}
            area={{ style: { fillOpacity: 0.12 } }}
            axis={{ y: false }}
            legend={{ position: 'top' }}
          />
        </ChartCard>
      </ChartSection>
    </div>
  );
}
