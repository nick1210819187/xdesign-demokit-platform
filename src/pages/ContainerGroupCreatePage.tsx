import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import type { TabsProps } from 'antd';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  CopyOutlined,
  DownOutlined,
  DownloadOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { FixedUnitNumberInput } from '../components/NumericInput';

type ContainerGroupCreatePageProps = {
  onExit: () => void;
};

type ContainerTab = {
  key: string;
  label: string;
  closable?: boolean;
};

const pageNav = [
  { key: 'general', label: '通用' },
  { key: 'health', label: '健康检查' },
  { key: 'resource', label: '资源' },
  { key: 'security', label: '安全性上下文' },
  { key: 'storage', label: '存储' },
  { key: 'gpu', label: 'GPU' },
];

const sideNavSections = [
  { key: 'cluster', title: '集群', items: ['集群概览'] },
  { key: 'workload', title: '工作负载', items: ['定时任务', '任务', '守护进程集', '无状态部署', '有状态集', '容器组'] },
  { key: 'app', title: '应用', items: ['应用实例', '应用模板'] },
  { key: 'storage', title: '存储', items: ['存储卷', '存储类'] },
  { key: 'network', title: '网络', items: ['服务', '路由'] },
  { key: 'policy', title: '策略', items: ['配额策略', '访问策略'] },
];

export function ContainerGroupCreatePage({ onExit }: ContainerGroupCreatePageProps) {
  const [activeTab, setActiveTab] = useState('container-1');
  const [tabs, setTabs] = useState<ContainerTab[]>([
    { key: 'container-group', label: '容器组', closable: false },
    { key: 'container-0', label: 'container-0', closable: false },
    { key: 'container-1', label: 'container-1' },
  ]);
  const newTabIndex = useRef(2);
  const [activeAnchor, setActiveAnchor] = useState('general');
  const [expandedSideKeys, setExpandedSideKeys] = useState<string[]>([]);

  const addContainer = () => {
    const nextKey = `container-${newTabIndex.current++}`;
    setTabs([...tabs, { key: nextKey, label: nextKey }]);
    setActiveTab(nextKey);
  };

  const toggleSideSection = (key: string) => {
    setExpandedSideKeys((keys) => (
      keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key]
    ));
  };

  const removeContainer = (targetKey: string) => {
    const targetIndex = tabs.findIndex((item) => item.key === targetKey);
    const nextTabs = tabs.filter((item) => item.key !== targetKey);
    if (!nextTabs.length) return;
    if (activeTab === targetKey) {
      const nextActiveIndex = Math.max(0, targetIndex - 1);
      setActiveTab(nextTabs[nextActiveIndex]?.key ?? nextTabs[0].key);
    }
    setTabs(nextTabs);
  };

  const handleCloseTab = (event: MouseEvent<HTMLElement>, targetKey: string) => {
    event.stopPropagation();
    removeContainer(targetKey);
  };

  const containerEditorContent = (
    <div className="container-editor-body">
      <nav className="container-anchor-nav" aria-label="容器配置导航">
        {pageNav.map((item) => (
          <button
            type="button"
            className={activeAnchor === item.key ? 'active' : ''}
            key={item.key}
            onClick={() => setActiveAnchor(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="container-form-content">
        <div className="container-form-section">
          <div className="container-form-section-head">
            <Typography.Title level={4}>通用</Typography.Title>
          </div>
          <div className="container-field-grid">
            <Form.Item label="容器名称">
                <Input value={activeTab === 'container-group' ? 'container-1' : activeTab} readOnly />
            </Form.Item>
            <Form.Item label="容器类型">
              <Radio.Group defaultValue="standard" options={[
                { value: 'init', label: '初始化容器' },
                { value: 'standard', label: '标准容器' },
              ]} />
            </Form.Item>
          </div>
        </div>

        <div className="container-form-section">
          <Typography.Title level={4}>镜像</Typography.Title>
          <div className="container-field-grid two-column">
            <Form.Item label="容器镜像" required>
              <Input placeholder="例如：nginx:latest" />
            </Form.Item>
            <Form.Item label="镜像拉取策略">
              <Select defaultValue="Always" options={[
                { value: 'Always', label: 'Always' },
                { value: 'IfNotPresent', label: 'IfNotPresent' },
                { value: 'Never', label: 'Never' },
              ]} />
            </Form.Item>
            <Form.Item label="拉取密文">
              <Select placeholder="请选择密文" options={[
                { value: 'default-secret', label: 'default-secret' },
                { value: 'registry-token', label: 'registry-token' },
              ]} />
            </Form.Item>
          </div>
        </div>

        <div className="container-form-section">
          <div className="container-section-heading">
            <Typography.Title level={4}>网络</Typography.Title>
            <Typography.Text className="container-section-help">
              定义一个 Service 来公开容器，或定义一个非功能性命名端口，以便知道容器中的应用程序应该在哪里运行。
            </Typography.Text>
          </div>
          <Button className="container-network-add" type="link" icon={<PlusOutlined />}>添加端口或 Service</Button>
        </div>

        <div className="container-form-section">
          <Typography.Title level={4}>资源</Typography.Title>
          <div className="container-field-grid compact-resource-grid">
            <Form.Item label="CPU 请求">
              <FixedUnitNumberInput min={1} defaultValue={2} unit="核" />
            </Form.Item>
            <Form.Item label="内存请求">
              <FixedUnitNumberInput min={1} defaultValue={8} unit="GiB" />
            </Form.Item>
            <Form.Item label="GPU 数量">
              <FixedUnitNumberInput min={0} defaultValue={1} unit="张" />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );

  const tabItems: TabsProps['items'] = tabs.map((item) => ({
    key: item.key,
    label: (
      <span className="container-tab-label">
        <span>{item.label}</span>
        {item.closable === false ? null : (
          <Button
            aria-label={`删除 ${item.label}`}
            className="container-tab-close"
            icon={<CloseOutlined />}
            size="small"
            type="text"
            onClick={(event) => handleCloseTab(event, item.key)}
          />
        )}
      </span>
    ),
    children: containerEditorContent,
  }));

  return (
    <div className="workspace-page container-create-page">
      <aside className="container-create-side">
        <div className="container-side-head">
          <Tooltip title="返回">
            <Button aria-label="返回" icon={<ArrowLeftOutlined />} onClick={onExit} />
          </Tooltip>
          <Select
            value="sqb"
            options={[
              { value: 'sqb', label: 'sqb（cluster-eebd...）' },
              { value: 'local', label: 'local（local）' },
              { value: 'prod', label: 'prod（cluster-prod）' },
            ]}
          />
        </div>
        <nav className="container-side-nav" aria-label="资源导航">
          {sideNavSections.map((section) => {
            const expanded = expandedSideKeys.includes(section.key);
            return (
            <div className="container-side-section" key={section.title}>
              <button
                className={expanded ? 'container-side-group open' : 'container-side-group'}
                type="button"
                onClick={() => toggleSideSection(section.key)}
              >
                <Typography.Text className="container-side-title">{section.title}</Typography.Text>
                <DownOutlined className="container-side-chevron" />
              </button>
              {expanded ? (
                <div className="container-side-children">
                  {section.items.map((item) => (
                <button
                  className={item === '容器组' ? 'container-side-child active' : 'container-side-child'}
                  type="button"
                  key={item}
                >
                  {item}
                </button>
                  ))}
                </div>
              ) : null}
            </div>
            );
          })}
        </nav>
      </aside>

      <main className="container-create-main">
        <header className="container-create-top">
          <Space size={8} className="container-create-titlebar">
            <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" onClick={onExit} />
            <Typography.Title level={3}>创建</Typography.Title>
          </Space>
          <Space size={8} className="page-tool-actions">
            <Tooltip title="上传"><Button icon={<UploadOutlined />} /></Tooltip>
            <Tooltip title="终端"><Button icon={<DownloadOutlined />} /></Tooltip>
            <Tooltip title="导入 YAML"><Button icon={<ExportOutlined />} /></Tooltip>
            <Tooltip title="复制"><Button icon={<CopyOutlined />} /></Tooltip>
            <Tooltip title="搜索"><Button icon={<SearchOutlined />} /></Tooltip>
          </Space>
        </header>

        <Form layout="vertical" colon={false} className="container-create-form">
          <section className="container-basic-panel">
            <Form.Item label="命名空间" required>
              <Select defaultValue="default" options={[{ value: 'default', label: 'default' }, { value: 'kube-system', label: 'kube-system' }]} />
            </Form.Item>
            <Form.Item label="名称" required>
              <Input placeholder="输入名称" />
            </Form.Item>
            <Form.Item label="描述">
              <Input placeholder="输入可以描述该资源的文本" />
            </Form.Item>
          </section>

          <section className="container-editor-panel">
            <Tabs
              className="container-edit-tabs"
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarExtraContent={(
                <Button
                  aria-label="添加容器"
                  className="container-tab-add"
                  icon={<PlusOutlined />}
                  onClick={addContainer}
                />
              )}
              items={tabItems}
            />
          </section>
        </Form>

        <footer className="container-create-footer">
          <Button onClick={onExit}>取消</Button>
          <Button>以 YAML 文件编辑</Button>
          <Button type="primary">创建</Button>
        </footer>
      </main>
    </div>
  );
}
