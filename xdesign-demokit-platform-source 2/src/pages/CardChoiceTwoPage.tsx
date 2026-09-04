import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Radio, Space, Steps, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

type ClusterType = 'physical' | 'virtual';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const clusterTypes: Array<{
  key: ClusterType;
  title: string;
  description: string;
  image: string;
  tint: string;
}> = [
  {
    key: 'physical',
    title: '物理机集群',
    description: '控制平面节点由物理机构成的 Kubernetes 集群',
    image: assetPath('/assets/card-choice/physical-cluster.png'),
    tint: '18, 77, 238',
  },
  {
    key: 'virtual',
    title: '虚拟机集群',
    description: '控制平面节点由虚拟机构成的 Kubernetes 集群',
    image: assetPath('/assets/card-choice/virtual-cluster.png'),
    tint: '122, 90, 248',
  },
];

export function CardChoiceTwoPage() {
  const [selected, setSelected] = useState<ClusterType>('physical');

  return (
    <div className="workspace-page card-choice-two-page">
      <div className="service-page-heading">
        <Space size={8}>
          <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" />
          <Typography.Title level={3}>创建集群</Typography.Title>
        </Space>
      </div>

      <div className="wizard-surface">
        <div className="steps-wrap card-choice-steps">
          <Steps
            current={0}
            responsive
            items={[
              { title: '集群类型' },
              { title: '集群配置' },
              { title: '节点配置' },
              { title: '确认信息' },
            ]}
          />
        </div>

        <div className="wizard-content card-choice-two-content">
          <div className="cluster-type-grid">
            {clusterTypes.map((item) => (
              <div
                key={item.key}
                className={selected === item.key ? 'cluster-type-card selected' : 'cluster-type-card'}
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
                <div className="cluster-type-visual">
                  <img src={item.image} alt="" draggable={false} />
                </div>
                <div className="cluster-type-copy">
                  <Typography.Title level={4}>{item.title}</Typography.Title>
                  <Typography.Paragraph>{item.description}</Typography.Paragraph>
                </div>
              </div>
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
