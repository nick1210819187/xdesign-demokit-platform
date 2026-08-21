import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { CloudServerOutlined, DatabaseOutlined, FileSearchOutlined, MonitorOutlined } from '@ant-design/icons';

export function HomePage({ onOpenAudit, onOpenKit }: { onOpenAudit: () => void; onOpenKit: () => void }) {
  return (
    <div className="page-stack">
      <section className="home-panel">
        <div>
          <Typography.Text className="home-kicker">FusionOne AI Infrastructure</Typography.Text>
          <Typography.Title level={2}>统一管理 AI 服务器、算力资源和模型服务基础设施</Typography.Title>
          <Space>
            <Button type="primary" onClick={onOpenAudit}>查看审计日志</Button>
            <Button onClick={onOpenKit}>查看组件 DemoKit</Button>
          </Space>
        </div>
      </section>

      <Row gutter={[12, 12]}>
        {[
          ['在线服务器', 128, <CloudServerOutlined />],
          ['GPU 资源池', 32, <DatabaseOutlined />],
          ['当前告警', 6, <MonitorOutlined />],
          ['今日审计日志', 1280, <FileSearchOutlined />],
        ].map(([title, value, icon]) => (
          <Col xs={24} md={12} xl={6} key={String(title)}>
            <Card size="small">
              <Statistic title={<Space>{icon}{title}</Space>} value={Number(value)} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
