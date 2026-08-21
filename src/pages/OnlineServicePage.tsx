import { useMemo, useState } from 'react';
import type { Key } from 'react';
import {
  App,
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Radio,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { TableColumnsType, TabsProps } from 'antd';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

type ModelItem = {
  name: string;
  provider: string;
  type: string;
  creator: string;
  description: string;
  hot?: boolean;
  versions: string[];
};

type ResourceSpec = {
  key: string;
  engine: string;
  accelerator: string;
  cpu: number;
  memory: number;
  sharedMemory: number;
  nodes: number;
};

type ClusterRow = {
  key: string;
  name: string;
  ip: string;
  cpu: string;
  memory: string;
  accelerator: string;
};

const modelTypes = [
  { key: 'text', label: '文本生成', count: 9 },
  { key: 'image-classification', label: '图像分类', count: 3 },
  { key: 'object-detection', label: '目标检测', count: 1 },
  { key: 'segmentation', label: '语义分割', count: 1 },
  { key: 'embedding', label: '向量表示', count: 2 },
  { key: 'rerank', label: '重排序', count: 1 },
  { key: 'other', label: '其他', count: 21 },
  { key: 'image-understanding', label: '图像理解', count: 2 },
];

const models: ModelItem[] = [
  { name: 'Qwen3-32B', provider: '通义实验室', type: 'text', creator: 'Admin', description: '兼顾推理能力与部署效率的通用语言模型', versions: ['V0001', 'V0002'] },
  { name: 'DeepSeek-V4-Flash-w8a8', provider: '深度求索', type: 'text', creator: 'Admin', description: '面向高吞吐推理场景的轻量化模型', hot: true, versions: ['V0001'] },
  { name: 'DeepSeek-V3', provider: '深度求索', type: 'text', creator: 'Admin', description: '由杭州深度求索人工智能基础技术研究有限公司发布的通用大模型', hot: true, versions: ['DeepSeek-V3-0324', 'DeepSeek-V3'] },
  { name: 'DeepSeek-R1', provider: '深度求索', type: 'text', creator: 'Admin', description: '强化推理能力，适用于复杂逻辑、数学与代码任务', hot: true, versions: ['DeepSeek-R1'] },
  { name: 'test', provider: '自定义', type: 'text', creator: 'Admin', description: '用于测试在线推理流程的文本生成模型', versions: ['V0001'] },
  { name: 'nieqi-test', provider: '自定义', type: 'text', creator: 'Admin', description: '内部验证模型', versions: ['V0001'] },
  { name: 'bge-m3-2', provider: '智源研究院', type: 'text', creator: 'Admin', description: '多语言语义表示模型', versions: ['V0001'] },
  { name: 'qwen1-5b', provider: '通义实验室', type: 'text', creator: 'Admin', description: '轻量级通用文本生成模型', versions: ['V0001'] },
  { name: 'ERNIE Lite', provider: '百度', type: 'text', creator: 'Admin', description: '轻量级文本生成模型，适用于低延迟在线服务', versions: ['ERNIE-Lite-8K'] },
  { name: 'ResNet50', provider: '模型广场', type: 'image-classification', creator: '平台', description: '通用图像分类模型', versions: ['V0003'] },
  { name: 'YOLOv8', provider: '模型广场', type: 'object-detection', creator: '平台', description: '实时目标检测模型', versions: ['V0002'] },
  { name: 'BGE-Large-ZH', provider: '共享模型', type: 'embedding', creator: '模型团队', description: '中文向量表示模型', versions: ['V0004'] },
  { name: 'BGE-Reranker', provider: '共享模型', type: 'rerank', creator: '模型团队', description: '文本相关性重排序模型', versions: ['V0001'] },
  { name: 'Qwen2-VL', provider: '模型广场', type: 'image-understanding', creator: '平台', description: '图文理解多模态模型', versions: ['V0002'] },
];

const clusters: ClusterRow[] = [
  { key: 'local', name: 'local', ip: '70.189.197.10', cpu: '140.50 核 / 384.00 核', memory: '434.71 GiB / 1949.69 GiB', accelerator: '昇腾 / Ascend 910B · 7 / 16' },
  { key: 'yigou_base_user', name: 'yigou_base_user_', ip: '70.189.12.115', cpu: '33.96 核 / 720.00 核', memory: '91.65 GiB / 1255.99 GiB', accelerator: '英伟达 / RTX-PRO-5000 · 1 / 4' },
];

const nodes = [
  { key: 'worker11', name: 'worker11', cpu: '143.41 / 192 核', memory: '722.11 / 1006.34 GiB', accelerator: 'RTX PRO 5000 · 2 / 4' },
  { key: 'master10', name: 'master10', cpu: '150.09 / 192 核', memory: '738.87 / 943.34 GiB', accelerator: 'RTX PRO 5000 · 1 / 4' },
  { key: 'worker12', name: 'worker12', cpu: '128.74 / 192 核', memory: '698.32 / 1006.34 GiB', accelerator: 'RTX PRO 5000 · 3 / 4' },
  { key: 'worker13', name: 'worker13', cpu: '119.28 / 192 核', memory: '676.19 / 1006.34 GiB', accelerator: 'RTX PRO 5000 · 2 / 4' },
  { key: 'worker14', name: 'worker14', cpu: '156.83 / 192 核', memory: '801.27 / 1006.34 GiB', accelerator: 'RTX PRO 5000 · 1 / 4' },
  { key: 'worker15', name: 'worker15', cpu: '137.66 / 192 核', memory: '744.52 / 1006.34 GiB', accelerator: 'RTX PRO 5000 · 2 / 4' },
];

const baseSpec: ResourceSpec = {
  key: '1',
  engine: 'vLLM 0.8.10',
  accelerator: '英伟达 RTX PRO 5000 × 1',
  cpu: 32,
  memory: 256,
  sharedMemory: 128,
  nodes: 1,
};

const affinityRows = Array.from({ length: 8 }, (_, index) => ({
  key: String(index + 1),
  property: index % 2 === 0 ? 'node.kubernetes.io/instance-type' : 'accelerator.vendor',
  type: index % 2 === 0 ? '节点标签' : '加速卡标签',
  operator: index % 3 === 0 ? 'In' : 'Equals',
  value: index % 2 === 0 ? 'gpu-compute' : 'nvidia',
}));

function FieldHelp({ children, tip }: { children: string; tip?: string }) {
  return (
    <Space size={6}>
      {children}
      {tip ? <Tooltip title={tip}><QuestionCircleOutlined className="field-help" /></Tooltip> : null}
    </Space>
  );
}

function NumberField({ value, min = 0 }: { value: number; min?: number }) {
  return <InputNumber defaultValue={value} min={min} controls className="number-field" />;
}

export function OnlineServicePage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [modelOpen, setModelOpen] = useState(false);
  const [clusterOpen, setClusterOpen] = useState(false);
  const [modelTab, setModelTab] = useState('mine');
  const [modelType, setModelType] = useState('text');
  const [modelSearch, setModelSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('Qwen3-32B');
  const [selectedVersion, setSelectedVersion] = useState('V0001');
  const [draftModel, setDraftModel] = useState('Qwen3-32B');
  const [draftVersion, setDraftVersion] = useState('V0001');
  const [clusterSearch, setClusterSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('yigou_base_user');
  const [draftCluster, setDraftCluster] = useState('yigou_base_user');
  const [nodeSearch, setNodeSearch] = useState('');
  const [accelerator, setAccelerator] = useState('nvidia');
  const [multiEndpoint, setMultiEndpoint] = useState(false);
  const [apiAuth, setApiAuth] = useState(false);
  const [multimodal, setMultimodal] = useState(false);
  const [affinity, setAffinity] = useState(true);
  const [description, setDescription] = useState('');
  const [endpoints, setEndpoints] = useState([{ id: 1, port: 18000, api: '/v1/chat/completions', enabled: true }]);
  const [resourceSpecs, setResourceSpecs] = useState<ResourceSpec[]>([baseSpec]);

  const filteredModels = useMemo(() => models.filter((item) => (
    (modelTab === 'mine' ? item.creator === 'Admin' : modelTab === 'shared' ? item.provider === '共享模型' : item.provider === '模型广场')
    && item.type === modelType
    && item.name.toLowerCase().includes(modelSearch.toLowerCase())
  )), [modelSearch, modelTab, modelType]);

  const activeDraftModel = models.find((item) => item.name === draftModel);
  const filteredClusters = useMemo(() => clusters.filter((item) => `${item.name}${item.ip}`.toLowerCase().includes(clusterSearch.toLowerCase())), [clusterSearch]);
  const filteredNodes = useMemo(() => nodes.filter((item) => item.name.toLowerCase().includes(nodeSearch.trim().toLowerCase())), [nodeSearch]);

  const selectModelTab = (key: string) => {
    const nextType = key === 'mine' ? 'text' : key === 'shared' ? 'embedding' : 'image-classification';
    const nextModel = models.find((item) => (
      (key === 'mine' ? item.creator === 'Admin' : key === 'shared' ? item.provider === '共享模型' : item.provider === '模型广场') && item.type === nextType
    ));
    setModelTab(key);
    setModelType(nextType);
    if (nextModel) {
      setDraftModel(nextModel.name);
      setDraftVersion(nextModel.versions[0]);
    }
  };

  const selectModelType = (key: string) => {
    const nextModel = models.find((item) => (
      (modelTab === 'mine' ? item.creator === 'Admin' : modelTab === 'shared' ? item.provider === '共享模型' : item.provider === '模型广场') && item.type === key
    ));
    setModelType(key);
    setDraftModel(nextModel?.name ?? '');
    setDraftVersion(nextModel?.versions[0] ?? '');
  };

  const resourceColumns: TableColumnsType<ResourceSpec> = [
    { title: '序号', width: 64, render: (_value, _record, index) => index + 1 },
    { title: '推理引擎', dataIndex: 'engine', width: 220, render: (value) => <Select defaultValue={value} options={[{ value: 'vLLM 0.8.10' }, { value: 'MindIE 2.0' }]} /> },
    { title: '加速卡', dataIndex: 'accelerator', width: 240, render: (value) => <Space><Badge status="success" />{value}<Button type="link" size="small">配置</Button></Space> },
    { title: 'CPU（核）', dataIndex: 'cpu', width: 140, render: (value) => <NumberField value={value} min={1} /> },
    { title: '内存（GiB）', dataIndex: 'memory', width: 150, render: (value) => <NumberField value={value} min={1} /> },
    { title: '共享内存（GiB）', dataIndex: 'sharedMemory', width: 170, render: (value) => <NumberField value={value} /> },
    { title: '节点数量', dataIndex: 'nodes', width: 130, render: (value) => <NumberField value={value} min={1} /> },
  ];

  const modelTabs: TabsProps['items'] = [
    { key: 'mine', label: '我的模型' },
    { key: 'shared', label: '共享的模型' },
    { key: 'market', label: '模型广场' },
  ];

  const nextStep = async () => {
    if (current === 0) await form.validateFields(['serviceName', 'port', 'api']);
    setCurrent((value) => Math.min(3, value + 1));
  };

  const serviceInfo = (
    <div className="section-stack">
      <section className="form-section">
        <h2>服务信息</h2>
        <Form.Item name="serviceName" label="服务名称" rules={[{ required: true, message: '请输入服务名称' }]}>
          <Input placeholder="请输入服务名称" maxLength={64} showCount />
        </Form.Item>
        <Form.Item label={<FieldHelp tip="选择已注册并可以用于在线推理的模型。">模型选择</FieldHelp>} required>
          <Space.Compact className="full">
            <Input value={`${selectedModel} / ${selectedVersion}`} readOnly />
            <Button onClick={() => {
              setDraftModel(selectedModel);
              setDraftVersion(selectedVersion);
              setModelOpen(true);
            }}>选择模型</Button>
          </Space.Compact>
        </Form.Item>
        <Form.Item name="protocol" label="访问协议" initialValue="HTTPS">
          <Radio.Group options={['HTTPS', 'HTTP']} />
        </Form.Item>
        <Form.Item name="port" label={<FieldHelp tip="服务对外提供访问的端口号。">服务端口号</FieldHelp>} initialValue={18000} rules={[{ required: true }]}>
          <InputNumber min={1} max={65535} />
        </Form.Item>
        <Form.Item name="api" label={<FieldHelp tip="兼容 OpenAI 协议的推理接口路径。">API</FieldHelp>} initialValue="/v1/chat/completions" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </section>

      <section className="form-section service-settings">
        <h2>服务设置</h2>
        <div className="setting-row">
          <Typography.Text>多推理服务</Typography.Text>
          <div className="setting-control">
            <Space>
              <Switch checked={multiEndpoint} onChange={setMultiEndpoint} />
              <Typography.Text type="secondary">开启后仅支持标准推理下的单实例和单节点部署形态。</Typography.Text>
            </Space>
            {multiEndpoint ? (
              <div className="endpoint-panel">
                <div className="endpoint-table-head">
                  <span>服务端口号</span>
                  <span>API</span>
                  <span>操作</span>
                </div>
                {endpoints.map((item, index) => (
                  <div className="endpoint-row" key={item.id}>
                    <InputNumber min={1} max={65535} value={item.port} onChange={(value) => setEndpoints((items) => items.map((next) => next.id === item.id ? { ...next, port: value ?? undefined } : next))} />
                    <Input value={item.api} onChange={(event) => setEndpoints((items) => items.map((next) => next.id === item.id ? { ...next, api: event.target.value } : next))} />
                    <Space size={8}>
                      <Switch size="small" checked={item.enabled} onChange={(value) => setEndpoints((items) => items.map((next) => next.id === item.id ? { ...next, enabled: value } : next))} />
                      <Tooltip title={endpoints.length === 1 ? '至少保留一组服务' : '删除此服务组'}>
                        <Button
                          aria-label={`删除服务组 ${index + 1}`}
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          disabled={endpoints.length === 1}
                          onClick={() => setEndpoints((items) => items.filter((next) => next.id !== item.id))}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                ))}
                <Space className="endpoint-add" size={4}>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    disabled={endpoints.length >= 28}
                    onClick={() => setEndpoints((items) => [...items, { id: Math.max(0, ...items.map((item) => item.id)) + 1, port: 18000, api: '/v1/chat/completions', enabled: true }])}
                  >
                    添加
                  </Button>
                  <Typography.Text type="secondary">您还可以添加 {28 - endpoints.length} 个端口映射</Typography.Text>
                </Space>
              </div>
            ) : null}
          </div>
        </div>
        <div className="setting-row">
          <FieldHelp tip="开启后，请求方需要在 Header 中携带有效的 API Key 才能访问当前推理服务。">API Key 鉴权</FieldHelp>
          <Switch checked={apiAuth} onChange={setApiAuth} />
        </div>
        <div className="setting-row">
          <Typography.Text>多模态</Typography.Text>
          <Switch checked={multimodal} onChange={setMultimodal} />
        </div>
        <div className="setting-row setting-description">
          <Typography.Text>描述</Typography.Text>
          <Input.TextArea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={200} showCount rows={3} placeholder="请输入" />
        </div>
      </section>
    </div>
  );

  const inferenceConfig = (
    <div className="section-stack">
      <section className="form-section">
        <div className="section-head">
          <h2>部署策略</h2>
        </div>
        <Form.Item label="服务场景" required>
          <Select options={['标准推理', 'SmartPD', '灰度发布'].map((value) => ({ value }))} defaultValue="标准推理" />
        </Form.Item>
        <Form.Item label="集群" required>
          <Space.Compact className="full">
            <Input value={clusters.find((item) => item.key === selectedCluster)?.name ?? ''} placeholder="请选择集群" readOnly />
            <Button
              icon={<SearchOutlined />}
              onClick={() => {
                setDraftCluster(selectedCluster || 'yigou_base_user');
                setClusterOpen(true);
              }}
            >
              选择集群
            </Button>
          </Space.Compact>
        </Form.Item>
        {selectedCluster ? (
          <div className="cluster-inline-panel">
            <div className="cluster-inline-head">
              <div>
                <Typography.Text strong>集群资源</Typography.Text>
                <Typography.Text type="secondary">{clusters.find((item) => item.key === selectedCluster)?.name} · 节点资源实时概览</Typography.Text>
              </div>
              <Tooltip title="刷新资源"><Button type="text" icon={<ReloadOutlined />} /></Tooltip>
            </div>
            <div className="cluster-metrics compact">
              <Card size="small"><b>CPU</b><span>293.50 / 384.00 核</span><Progress percent={76} showInfo={false} /></Card>
              <Card size="small"><b>内存</b><span>1460.98 / 1949.69 GiB</span><Progress percent={75} showInfo={false} /></Card>
              <Card size="small" className="accelerator-metric-card">
                <div className="accelerator-metric-row">
                  <b><ThunderboltOutlined /> 加速卡</b>
                  <div className="accelerator-metric-value">
                    <Select className="accelerator-selector" size="small" value={accelerator} onChange={setAccelerator} options={[
                      { value: 'nvidia', label: '英伟达' },
                      { value: 'ascend', label: '昇腾' },
                      { value: 'metax', label: '沐曦' },
                    ]} />
                    <span>1 / 4 张</span>
                  </div>
                </div>
                <Progress percent={25} showInfo={false} />
              </Card>
            </div>
            <div className="cluster-node-toolbar">
              <Typography.Text strong>节点资源</Typography.Text>
              <Input prefix={<SearchOutlined />} value={nodeSearch} onChange={(event) => setNodeSearch(event.target.value)} placeholder="搜索节点名称" allowClear />
            </div>
            <div className="cluster-node-scroll">
              <Table
                size="small"
                sticky
                rowKey="key"
                dataSource={filteredNodes}
                pagination={false}
                scroll={{ x: 760, y: 164 }}
                columns={[
                  { title: '节点名称', dataIndex: 'name', width: 140 },
                  { title: 'CPU（可用 / 总量）', dataIndex: 'cpu', width: 190 },
                  { title: '内存（可用 / 总量）', dataIndex: 'memory', width: 220 },
                  { title: '加速卡', dataIndex: 'accelerator', width: 210 },
                ]}
              />
            </div>
          </div>
        ) : null}
        <Form.Item label="节点">
          <Select allowClear placeholder="请选择部署节点（可选）" options={nodes.map((item) => ({ value: item.key, label: item.name }))} />
        </Form.Item>
        <Form.Item label="实例数量">
          <InputNumber min={1} defaultValue={1} />
        </Form.Item>
      </section>

      <section className="form-section table-section">
        <h2>资源规格</h2>
        <Table rowKey="key" columns={resourceColumns} dataSource={resourceSpecs} pagination={false} scroll={{ x: 1120 }} />
        <Space className="add-row">
          <Button type="link" icon={<PlusOutlined />} onClick={() => setResourceSpecs((items) => [...items, { ...baseSpec, key: String(items.length + 1) }])}>添加资源规格</Button>
          <Typography.Text type="secondary">还可以添加 {64 - resourceSpecs.length} 条资源规格</Typography.Text>
        </Space>
        <Descriptions colon={false} column={2} items={[
          { key: 'scheduler', label: '调度器类型', children: 'xxl-engine-scheduler' },
          { key: 'strategy', label: '调度策略', children: <Tag color="blue">资源均衡</Tag> },
        ]} />
      </section>
    </div>
  );

  const parameterConfig = (
    <div className="parameter-layout">
      <aside className="resource-list">
        <Input prefix={<SearchOutlined />} placeholder="搜索资源规格" />
        {resourceSpecs.map((item, index) => (
          <Card size="small" className={`resource-card ${index === 0 ? 'active' : ''}`} key={item.key}>
            <Typography.Text strong>资源规格-{index + 1}</Typography.Text>
            <Descriptions colon={false} size="small" column={1} items={[
              { key: 'engine', label: '推理引擎', children: item.engine },
              { key: 'accelerator', label: '加速卡', children: item.accelerator },
            ]} />
          </Card>
        ))}
      </aside>
      <section className="form-section parameter-form">
        <div className="section-head">
          <div>
            <h2>运行参数</h2>
            <Typography.Text type="secondary">参数作用于当前选中的资源规格。</Typography.Text>
          </div>
          <Button icon={<CopyOutlined />}>复制配置信息</Button>
        </div>
        <Tabs
          defaultActiveKey="config"
          items={[
            {
              key: 'config',
              label: '配置',
              children: (
                <div className="parameter-grid">
                  <Form.Item label={<FieldHelp tip="允许加载模型仓库中的自定义远程代码。">trust-remote-code</FieldHelp>}><Switch defaultChecked /></Form.Item>
                  <Form.Item label="max-input-token-len"><NumberField value={2048} /></Form.Item>
                  <Form.Item label="max-output-token-len"><NumberField value={2048} /></Form.Item>
                  <Form.Item label="max-num-batched-tokens"><NumberField value={0} /></Form.Item>
                  <Collapse
                    className="advanced-collapse"
                    expandIconPosition="end"
                    ghost
                    items={[{
                      key: 'advanced',
                      label: '高级配置',
                      children: (
                        <div className="advanced-grid">
                          <Form.Item label="高性能路由"><Switch defaultChecked /></Form.Item>
                          <Form.Item label="扩缩容"><Switch /></Form.Item>
                          <Form.Item label="节点亲和性"><Switch checked={affinity} onChange={setAffinity} /></Form.Item>
                          <Form.Item label="文件管理挂载"><Switch /></Form.Item>
                        </div>
                      ),
                    }]}
                  />
                </div>
              ),
            },
            { key: 'custom', label: '自定义', children: <Input.TextArea rows={12} placeholder="请输入自定义 JSON 参数" /> },
          ]}
        />
      </section>
    </div>
  );

  const confirmInfo = (
    <div className="section-stack">
      <section className="form-section">
        <h2>基本配置</h2>
        <Descriptions colon={false} column={4} items={[
          { key: 'name', label: '服务名称', children: form.getFieldValue('serviceName') || 'Qwen3-32B 在线服务' },
          { key: 'model', label: '模型选择', children: `${selectedModel} / ${selectedVersion}` },
          { key: 'local', label: '模型本地加速', children: <Badge status="success" text="启用" /> },
          { key: 'protocol', label: '访问协议', children: form.getFieldValue('protocol') || 'HTTPS' },
          { key: 'port', label: '服务端口号', children: form.getFieldValue('port') || 18000 },
          { key: 'api', label: 'API', children: form.getFieldValue('api') || '/v1/chat/completions' },
          { key: 'multi', label: '多推理服务', children: multiEndpoint ? `开启（${endpoints.length} 组）` : '关闭' },
          { key: 'auth', label: 'API Key 鉴权', children: apiAuth ? '开启' : '关闭' },
        ]} />
      </section>
      <section className="form-section table-section">
        <h2>推理配置</h2>
        <Descriptions colon={false} column={4} items={[
          { key: 'scene', label: '服务场景', children: '标准推理' },
          { key: 'cluster', label: '集群', children: clusters.find((item) => item.key === selectedCluster)?.name || 'yigou_base_user_' },
          { key: 'node', label: '节点', children: '自动调度' },
          { key: 'instance', label: '实例数量', children: 1 },
        ]} />
        <Table
          rowKey="key"
          dataSource={resourceSpecs}
          pagination={false}
          scroll={{ x: 1180 }}
          columns={[
            { title: '序号', width: 64, render: (_value, _record, index) => index + 1 },
            { title: '推理引擎', dataIndex: 'engine', width: 150 },
            { title: '加速卡', dataIndex: 'accelerator', width: 240 },
            { title: 'CPU（核）', dataIndex: 'cpu', width: 100 },
            { title: '内存（GiB）', dataIndex: 'memory', width: 120 },
            { title: '共享内存（GiB）', dataIndex: 'sharedMemory', width: 140 },
            { title: '节点数量', dataIndex: 'nodes', width: 100 },
            { title: '参数配置', width: 100, render: () => <Button type="link" size="small">详情</Button> },
          ]}
        />
      </section>
      <section className="form-section">
        <h2>高级配置</h2>
        <Descriptions colon={false} column={4} items={[
          { key: 'route', label: '高性能路由', children: <Badge status="success" text="启用" /> },
          { key: 'scale', label: '扩缩容', children: '关闭' },
          { key: 'affinity', label: '节点亲和性', children: affinity ? <Badge status="success" text="启用" /> : '关闭' },
          { key: 'mount', label: '文件管理挂载', children: '关闭' },
        ]} />
      </section>
    </div>
  );

  return (
    <div className="workspace-page online-service-page">
      <div className="service-page-heading">
        <Space size={8}>
          <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" />
          <Typography.Title level={3}>创建在线服务</Typography.Title>
        </Space>
      </div>
      <Form form={form} colon={false} layout="vertical" className="wizard-surface">
        <div className="steps-wrap">
          <Steps
            current={current}
            responsive
            items={[
              { title: '基本配置', description: '服务与模型' },
              { title: '推理配置', description: '资源与调度' },
              { title: '参数配置', description: '运行参数' },
              { title: '确认信息', description: '核对并创建' },
            ]}
          />
        </div>
        <div className="wizard-content">
          {[serviceInfo, inferenceConfig, parameterConfig, confirmInfo][current]}
        </div>
        <footer className="wizard-footer">
          <Button>取消</Button>
          {current > 0 ? <Button onClick={() => setCurrent((value) => value - 1)}>上一步</Button> : null}
          {current < 3 ? (
            <Button type="primary" onClick={nextStep}>下一步</Button>
          ) : (
            <Button type="primary" onClick={() => message.success('在线服务已进入创建队列')}>确认创建</Button>
          )}
        </footer>
      </Form>

      <Modal
        className="model-picker-modal"
        title="选择模型"
        open={modelOpen}
        onCancel={() => setModelOpen(false)}
        onOk={() => {
          setSelectedModel(draftModel);
          setSelectedVersion(draftVersion);
          setModelOpen(false);
        }}
        width={1240}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ disabled: !draftModel || !draftVersion }}
        styles={{ body: { paddingTop: 0 } }}
      >
        <Tabs
          className="model-picker-tabs"
          activeKey={modelTab}
          onChange={selectModelTab}
          items={modelTabs}
          tabBarExtraContent={<Input prefix={<SearchOutlined />} value={modelSearch} onChange={(event) => setModelSearch(event.target.value)} placeholder="搜索模型名称" allowClear className="model-search" />}
        />
        <div className="model-picker-grid">
          <div className="model-type-column">
            <h3>模型类型</h3>
            <div className="model-type-list">
              {modelTypes.map((item) => (
                <button type="button" className={modelType === item.key ? 'model-type-option selected' : 'model-type-option'} key={item.key} onClick={() => selectModelType(item.key)}>
                  <span>{item.label}</span>
                  <Tag>{item.count}</Tag>
                </button>
              ))}
            </div>
          </div>
          <div className="model-column">
            <h3>模型（{filteredModels.length}）</h3>
            <Radio.Group value={draftModel} onChange={(event) => {
              const nextModel = models.find((item) => item.name === event.target.value);
              setDraftModel(event.target.value);
              setDraftVersion(nextModel?.versions[0] ?? '');
            }}>
              <div className="model-option-list">
                {filteredModels.length ? filteredModels.map((item, index) => (
                  <div className={draftModel === item.name ? 'model-option selected' : 'model-option'} key={item.name}>
                    <Radio value={item.name}>
                      <span className="model-option-content">
                        <Avatar size={40} className={`model-logo model-tone-${index % 6}`}>{item.name.charAt(0)}</Avatar>
                        <span className="model-copy">
                          <b>{item.name}</b>
                          <small>{item.description}</small>
                        </span>
                        <span className="model-owner">创建人 {item.creator}</span>
                      </span>
                    </Radio>
                  </div>
                )) : <div className="model-empty">当前类型暂无模型</div>}
              </div>
            </Radio.Group>
          </div>
          <div className="version-column">
            <h3>版本（{activeDraftModel?.versions.length ?? 0}）</h3>
            <Radio.Group value={draftVersion} onChange={(event) => setDraftVersion(event.target.value)}>
              {activeDraftModel?.versions.map((item) => (
                <Radio className={draftVersion === item ? 'version-option selected' : 'version-option'} value={item} key={item}>
                  <span className="version-name">{item}</span>
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className="model-picker-footer">
          <div className="model-picker-summary">
            <Typography.Text type="secondary">已选：1 / 1</Typography.Text>
            <Tag>{draftModel}</Tag>
          </div>
        </div>
      </Modal>

      <Modal
        className="cluster-picker-modal"
        title="选择集群"
        open={clusterOpen}
        onCancel={() => setClusterOpen(false)}
        onOk={() => {
          setSelectedCluster(draftCluster);
          setClusterOpen(false);
        }}
        width={920}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ disabled: !draftCluster }}
      >
        <div className="cluster-picker-toolbar">
          <Input prefix={<SearchOutlined />} value={clusterSearch} onChange={(event) => setClusterSearch(event.target.value)} placeholder="请输入集群名称搜索" allowClear />
        </div>
        <Table
          size="small"
          rowKey="key"
          dataSource={filteredClusters}
          pagination={false}
          rowClassName={(record) => record.key === draftCluster ? 'cluster-row-selected' : ''}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [draftCluster],
            onChange: (keys: Key[]) => setDraftCluster(String(keys[0])),
          }}
          onRow={(record) => ({ onClick: () => setDraftCluster(record.key) })}
          columns={[
            { title: '集群名称', dataIndex: 'name', width: 160 },
            { title: 'IP', dataIndex: 'ip', width: 132 },
            { title: 'CPU（已分配 / 总数）', dataIndex: 'cpu', width: 190 },
            { title: '内存（已分配 / 总数）', dataIndex: 'memory', width: 220 },
            { title: '加速卡', dataIndex: 'accelerator', width: 210 },
          ]}
        />
        <Typography.Text className="cluster-total" type="secondary">共 {filteredClusters.length} 个集群</Typography.Text>
      </Modal>
    </div>
  );
}
