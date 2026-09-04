import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Card, Radio, Space, Steps, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

type ServiceType = 'cluster-ip' | 'external-name' | 'headless' | 'load-balancer' | 'node-port';

const serviceTypes: Array<{
  key: ServiceType;
  title: string;
  description: string;
  tint: string;
}> = [
  {
    key: 'cluster-ip',
    title: 'Cluster IP',
    description: '将一组 Pod 暴露给集群中的其他 Pod。此类型的 Service 只能从集群内部访问。这是默认类型。',
    tint: '18, 77, 238',
  },
  {
    key: 'external-name',
    title: 'External Name',
    description: '创建一个使用 DNS 名称而不是选择器的 Service。这是高级用例。',
    tint: '122, 90, 248',
  },
  {
    key: 'headless',
    title: 'Headless',
    description: '创建没有 Cluster IP 或 Load Balancer 的 Service。这是高级用例。',
    tint: '22, 199, 190',
  },
  {
    key: 'load-balancer',
    title: 'Load Balancer',
    description: '在底层基础设施中创建一个 Load Balancer（例如云提供商的 Load Balancer）并为该 Service 分配一个公共 IP 地址。允许外部客户端使用 Service 定义中指定的公共 IP 地址和端口访问 Service。',
    tint: '74, 130, 255',
  },
  {
    key: 'node-port',
    title: 'Node Port',
    description: '在每个节点的 IP 上以静态端口公开 Service。',
    tint: '18, 77, 238',
  },
];

export function CardChoicePlainPage() {
  const [selected, setSelected] = useState<ServiceType>('cluster-ip');

  return (
    <div className="workspace-page card-choice-plain-page">
      <div className="service-page-heading">
        <Space size={8}>
          <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" />
          <Typography.Title level={3}>创建</Typography.Title>
        </Space>
      </div>

      <div className="wizard-surface">
        <div className="steps-wrap card-choice-steps">
          <Steps
            current={0}
            responsive
            items={[
              { title: '选择服务类型' },
              { title: '配置基本信息' },
              { title: '配置端口与选择器' },
              { title: '确认信息' },
            ]}
          />
        </div>

        <div className="wizard-content card-choice-plain-content">
          <div className="page-subtitle">
            <Typography.Text type="secondary">
              Service 用于定义一组可以使用单个 IP 地址和端口访问的逻辑 Pod。
            </Typography.Text>
          </div>

          <div className="creation-card-grid">
            {serviceTypes.map((item) => (
              <Card
                hoverable
                key={item.key}
                className={selected === item.key ? 'creation-choice-card plain selected' : 'creation-choice-card plain'}
                style={{ '--card-tint': item.tint } as CSSProperties}
                onClick={() => setSelected(item.key)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelected(item.key);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={selected === item.key}
              >
                <div className="creation-choice-radio-top">
                  <Radio checked={selected === item.key} />
                </div>
                <div className="creation-choice-copy">
                  <Typography.Title level={4}>{item.title}</Typography.Title>
                  <Typography.Paragraph>{item.description}</Typography.Paragraph>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <footer className="wizard-footer">
          <Button>取消</Button>
          <Button type="primary">下一步</Button>
        </footer>
      </div>
    </div>
  );
}
