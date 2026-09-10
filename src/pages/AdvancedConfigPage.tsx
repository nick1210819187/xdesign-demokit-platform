import { ArrowRightOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

type Entry = {
  key: string;
  title: string;
};

type Section = {
  title: string;
  entries: Entry[];
};

const clusterEntries: Entry[] = [
  { key: 'node-management', title: '节点管理' },
  { key: 'image-management', title: '镜像管理' },
  { key: 'network-management', title: '网络管理' },
  { key: 'disk-pool', title: '硬盘池' },
  { key: 'ruin-pool', title: '废墟池' },
];

const serviceSections: Section[] = [
  {
    title: '块服务',
    entries: [
      { key: 'volume-management', title: '卷管理' },
      { key: 'snapshot-policy', title: '快照策略' },
      { key: 'snapshot-management', title: '快照管理' },
      { key: 'client-management', title: '客户端管理' },
      { key: 'block-gateway-management', title: '网关管理' },
    ],
  },
  {
    title: '文件服务',
    entries: [
      { key: 'folder-management', title: '文件夹管理' },
      { key: 'user-management', title: '用户管理' },
      { key: 'share-management', title: '共享管理' },
      { key: 'permission-management', title: '权限管理' },
      { key: 'file-gateway-management', title: '网关管理' },
      { key: 'ad-domain-management', title: 'AD 域管理' },
    ],
  },
];

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function EntryBlock({ entry, onOpenEntry }: { entry: Entry; onOpenEntry: (entry: Entry) => void }) {
  return (
    <button className="advanced-entry-block" type="button" onClick={() => onOpenEntry(entry)}>
      <span>{entry.title}</span>
      <ArrowRightOutlined />
    </button>
  );
}

function ModuleHeader({ image, title }: { image: string; title: string }) {
  return (
    <div className="advanced-module-header">
      <span className="advanced-module-visual">
        <img src={image} alt="" draggable={false} />
      </span>
      <span className="advanced-module-copy">
        <Typography.Title level={4}>{title}</Typography.Title>
      </span>
    </div>
  );
}

export function AdvancedConfigPage({ onOpenEntry }: { onOpenEntry: (entry: Entry) => void }) {
  return (
    <div className="workspace-page advanced-config-page">
      <div className="service-page-heading">
        <Typography.Title level={3}>高级配置</Typography.Title>
      </div>

      <div className="advanced-config-content">
        <section className="advanced-module-panel">
          <ModuleHeader
            image={assetPath('/assets/advanced-config/cluster.png')}
            title="集群管理"
          />
          <div className="advanced-entry-grid">
            {clusterEntries.map((entry) => (
              <EntryBlock key={entry.key} entry={entry} onOpenEntry={onOpenEntry} />
            ))}
          </div>
        </section>

        <section className="advanced-module-panel advanced-service-panel">
          <ModuleHeader
            image={assetPath('/assets/advanced-config/service.png')}
            title="服务管理"
          />
          <div className="advanced-service-sections">
            {serviceSections.map((section) => (
              <section className="advanced-service-section" key={section.title}>
                <div className="advanced-section-head">
                  <Typography.Title level={4}>{section.title}</Typography.Title>
                </div>
                <div className="advanced-entry-grid">
                  {section.entries.map((entry) => (
                    <EntryBlock key={entry.key} entry={entry} onOpenEntry={onOpenEntry} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
