import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Card, Radio, Space, Steps, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

type ChoiceKey = 'create' | 'template' | 'clone' | 'import' | 'convert';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const creationChoices: Array<{
  key: ChoiceKey;
  title: string;
  description: string;
  image: string;
  tint: string;
}> = [
  {
    key: 'create',
    title: '创建新虚拟机',
    description: '此选项将指导您完成创建新虚拟机的过程。您可以自定义 CPU、内存、网卡和磁盘。创建之后将需要安装客户机操作系统。',
    image: assetPath('/assets/card-choice/create-vm.png'),
    tint: '18, 77, 238',
  },
  {
    key: 'template',
    title: '模板部署虚拟机',
    description: '此选项将指导您完成从模板部署虚拟机的过程。模板是最佳配置的虚拟机映像，使您轻松创建可以立即使用的虚拟机。',
    image: assetPath('/assets/card-choice/template-deploy.png'),
    tint: '122, 90, 248',
  },
  {
    key: 'clone',
    title: '克隆虚拟机',
    description: '此选项将指导您完成部署现有虚拟机副本的过程。',
    image: assetPath('/assets/card-choice/clone-vm.png'),
    tint: '22, 199, 190',
  },
  {
    key: 'import',
    title: '导入虚拟机',
    description: '此选项将指导您完成从本地或网络上的虚拟机模板文件来创建一台完整的虚拟机。',
    image: assetPath('/assets/card-choice/import-vm.png'),
    tint: '18, 77, 238',
  },
  {
    key: 'convert',
    title: '模板转为虚拟机',
    description: '此选项将指导您完成将模板转化为一个虚拟机。',
    image: assetPath('/assets/card-choice/template-convert.png'),
    tint: '74, 130, 255',
  },
];

export function CardChoicePage() {
  const [selected, setSelected] = useState<ChoiceKey>('create');

  return (
    <div className="workspace-page card-choice-page">
      <div className="service-page-heading">
        <Space size={8}>
          <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" />
          <Typography.Title level={3}>卡片选择</Typography.Title>
        </Space>
      </div>

      <div className="wizard-surface">
        <div className="steps-wrap card-choice-steps">
          <Steps
            current={0}
            responsive
            items={[
              { title: '选择创建方式' },
              { title: '配置基本信息' },
              { title: '配置虚拟机规格' },
              { title: '确认信息' },
            ]}
          />
        </div>

        <div className="wizard-content card-choice-content">
          <div className="creation-card-grid">
            {creationChoices.map((item) => (
              <Card
                hoverable
                key={item.key}
                className={selected === item.key ? 'creation-choice-card selected' : 'creation-choice-card'}
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
                <div className="creation-choice-visual">
                  <img src={item.image} alt="" draggable={false} />
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
