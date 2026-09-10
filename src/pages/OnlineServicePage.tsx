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
  Modal,
  Popover,
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
import { FixedUnitNumberInput, SelectUnitNumberInput, SpinnerNumberInput } from '../components/NumericInput';
import { StatusBadge } from '../components/StatusBadge';
import type { Locale } from '../i18n';

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

const onlineText = {
  zh: {
    detail: '详情',
    enabled: '启用',
    disabled: '关闭',
    on: '开启',
    systemDefault: '系统默认',
    sequence: '序号',
    inferenceEngine: '推理引擎',
    accelerator: '加速卡',
    cpuCores: 'CPU（核）',
    memoryGib: '内存（GiB）',
    sharedMemoryGib: '共享内存（GiB）',
    nodeCount: '节点数量',
    parameterConfig: '参数配置',
    inputToken: '最大输入 Token',
    outputToken: '最大输出 Token',
    batchToken: '批处理 Token 上限',
    remoteCode: '远程代码加载',
    property: '属性',
    type: '类型',
    operator: '操作符',
    value: '取值',
    nodeLabel: '节点标签',
    acceleratorLabel: '加速卡标签',
    configure: '配置',
    serviceInfo: '服务信息',
    serviceName: '服务名称',
    enterServiceName: '请输入服务名称',
    modelSelect: '模型选择',
    modelSelectTip: '选择已注册并可以用于在线推理的模型。',
    selectModel: '选择模型',
    accessProtocol: '访问协议',
    port: '服务端口号',
    portTip: '服务对外提供访问的端口号。',
    apiTip: '兼容 OpenAI 协议的推理接口路径。',
    serviceSettings: '服务设置',
    multiInferenceService: '多推理服务',
    multiEndpointTip: '开启后仅支持标准推理下的单实例和单节点部署形态。',
    operation: '操作',
    deleteServiceGroup: '删除此服务组',
    add: '添加',
    endpointRemain: '您还可以添加 {count} 个端口映射',
    apiAuth: 'API Key 鉴权',
    apiAuthTip: '开启后，请求方需要在 Header 中携带有效的 API Key 才能访问当前推理服务。',
    multimodal: '多模态',
    description: '描述',
    enter: '请输入',
    deploymentStrategy: '部署策略',
    serviceScenario: '服务场景',
    standardInference: '标准推理',
    grayscaleRelease: '灰度发布',
    cluster: '集群',
    selectCluster: '选择集群',
    selectClusterPlaceholder: '请选择集群',
    clusterResource: '集群资源',
    clusterOverview: '节点资源实时概览',
    refreshResource: '刷新资源',
    memory: '内存',
    nodeResource: '节点资源',
    searchNode: '搜索节点名称',
    nodeName: '节点名称',
    cpuAvailableTotal: 'CPU（可用 / 总量）',
    memoryAvailableTotal: '内存（可用 / 总量）',
    node: '节点',
    selectNode: '请选择部署节点（可选）',
    instanceCount: '实例数量',
    resourceSpec: '资源规格',
    resourceSpecName: '资源规格-{index}',
    addResourceSpec: '添加资源规格',
    resourceSpecRemain: '还可以添加 {count} 条资源规格',
    schedulerType: '调度器类型',
    schedulerPolicy: '调度策略',
    resourceBalance: '资源均衡',
    searchResourceSpec: '搜索资源规格',
    runtimeParameters: '运行参数',
    runtimeParametersDesc: '参数作用于当前选中的资源规格。',
    copyConfig: '复制配置信息',
    config: '配置',
    advancedConfig: '高级配置',
    highPerformanceRouting: '高性能路由',
    scaling: '扩缩容',
    nodeAffinity: '节点亲和性',
    fileMount: '文件管理挂载',
    custom: '自定义',
    customJsonPlaceholder: '请输入自定义 JSON 参数',
    baseConfig: '基本配置',
    localAcceleration: '模型本地加速',
    multiEnabled: '开启（{count} 组）',
    inferenceConfig: '推理配置',
    autoSchedule: '自动调度',
    createOnlineService: '创建在线服务',
    back: '返回',
    stepBasic: '基本配置',
    stepBasicDesc: '服务与模型',
    stepInference: '推理配置',
    stepInferenceDesc: '资源与调度',
    stepParameter: '参数配置',
    stepParameterDesc: '运行参数',
    stepConfirm: '确认信息',
    stepConfirmDesc: '核对并创建',
    cancel: '取消',
    previous: '上一步',
    next: '下一步',
    confirmCreate: '确认创建',
    createSuccess: '在线服务已进入创建队列',
    acceleratorConfig: '加速卡配置',
    ok: '确定',
    useMode: '使用模式',
    passthrough: '直通',
    compute: '算力',
    vram: '显存',
    vramExtra: '支持1MiB的整数倍切分',
    scheduleMode: '调度方式',
    density: '密度',
    performance: '性能',
    partitionMode: '划分模式',
    partitionTip: '按业务弹性需求选择加速卡切分策略。',
    elastic: '弹性',
    fixed: '固定',
    exclusive: '独占',
    acceleratorUpdated: '加速卡配置已更新',
    searchModel: '搜索模型名称',
    modelType: '模型类型',
    modelCount: '模型（{count}）',
    owner: '创建人',
    modelEmpty: '当前类型暂无模型',
    versionCount: '版本（{count}）',
    selected: '已选：1 / 1',
    searchCluster: '请输入集群名称搜索',
    clusterName: '集群名称',
    cpuAllocatedTotal: 'CPU（已分配 / 总数）',
    memoryAllocatedTotal: '内存（已分配 / 总数）',
    clusterTotal: '共 {count} 个集群',
    validators: {
      serviceName: '请输入服务名称',
      accelerator: '请选择加速卡',
      mode: '请选择使用模式',
      compute: '请输入算力',
      vram: '请输入显存',
      schedule: '请选择调度方式',
      partition: '请选择划分模式',
    },
  },
  en: {
    detail: 'Details',
    enabled: 'Enabled',
    disabled: 'Off',
    on: 'On',
    systemDefault: 'System Default',
    sequence: 'No.',
    inferenceEngine: 'Inference Engine',
    accelerator: 'Accelerator',
    cpuCores: 'CPU (Cores)',
    memoryGib: 'Memory (GiB)',
    sharedMemoryGib: 'Shared Memory (GiB)',
    nodeCount: 'Nodes',
    parameterConfig: 'Parameter Configuration',
    inputToken: 'Max Input Tokens',
    outputToken: 'Max Output Tokens',
    batchToken: 'Max Batched Tokens',
    remoteCode: 'Remote Code Loading',
    property: 'Property',
    type: 'Type',
    operator: 'Operator',
    value: 'Value',
    nodeLabel: 'Node Label',
    acceleratorLabel: 'Accelerator Label',
    configure: 'Configure',
    serviceInfo: 'Service Information',
    serviceName: 'Service Name',
    enterServiceName: 'Enter service name',
    modelSelect: 'Model Selection',
    modelSelectTip: 'Select a registered model that can be used for online inference.',
    selectModel: 'Select Model',
    accessProtocol: 'Access Protocol',
    port: 'Service Port',
    portTip: 'The external port exposed by the service.',
    apiTip: 'Inference endpoint path compatible with the OpenAI protocol.',
    serviceSettings: 'Service Settings',
    multiInferenceService: 'Multiple Inference Services',
    multiEndpointTip: 'After enabled, only single-instance and single-node deployment are supported for standard inference.',
    operation: 'Operation',
    deleteServiceGroup: 'Delete this service group',
    add: 'Add',
    endpointRemain: 'You can add {count} more port mappings',
    apiAuth: 'API Key Authentication',
    apiAuthTip: 'After enabled, callers must include a valid API Key in the header to access this inference service.',
    multimodal: 'Multimodal',
    description: 'Description',
    enter: 'Enter',
    deploymentStrategy: 'Deployment Strategy',
    serviceScenario: 'Service Scenario',
    standardInference: 'Standard Inference',
    grayscaleRelease: 'Canary Release',
    cluster: 'Cluster',
    selectCluster: 'Select Cluster',
    selectClusterPlaceholder: 'Select a cluster',
    clusterResource: 'Cluster Resources',
    clusterOverview: 'Real-time node resource overview',
    refreshResource: 'Refresh resources',
    memory: 'Memory',
    nodeResource: 'Node Resources',
    searchNode: 'Search node name',
    nodeName: 'Node Name',
    cpuAvailableTotal: 'CPU (Available / Total)',
    memoryAvailableTotal: 'Memory (Available / Total)',
    node: 'Node',
    selectNode: 'Select deployment node (optional)',
    instanceCount: 'Instances',
    resourceSpec: 'Resource Specifications',
    resourceSpecName: 'Resource Spec {index}',
    addResourceSpec: 'Add Resource Spec',
    resourceSpecRemain: '{count} more resource specs can be added',
    schedulerType: 'Scheduler Type',
    schedulerPolicy: 'Scheduling Policy',
    resourceBalance: 'Resource Balanced',
    searchResourceSpec: 'Search resource specs',
    runtimeParameters: 'Runtime Parameters',
    runtimeParametersDesc: 'Parameters apply to the currently selected resource spec.',
    copyConfig: 'Copy Configuration',
    config: 'Configuration',
    advancedConfig: 'Advanced Configuration',
    highPerformanceRouting: 'High-performance Routing',
    scaling: 'Auto Scaling',
    nodeAffinity: 'Node Affinity',
    fileMount: 'File Management Mount',
    custom: 'Custom',
    customJsonPlaceholder: 'Enter custom JSON parameters',
    baseConfig: 'Basic Configuration',
    localAcceleration: 'Model Local Acceleration',
    multiEnabled: 'On ({count} groups)',
    inferenceConfig: 'Inference Configuration',
    autoSchedule: 'Auto Scheduling',
    createOnlineService: 'Create Online Service',
    back: 'Back',
    stepBasic: 'Basic Configuration',
    stepBasicDesc: 'Service and model',
    stepInference: 'Inference Configuration',
    stepInferenceDesc: 'Resources and scheduling',
    stepParameter: 'Parameter Configuration',
    stepParameterDesc: 'Runtime parameters',
    stepConfirm: 'Confirm Information',
    stepConfirmDesc: 'Review and create',
    cancel: 'Cancel',
    previous: 'Previous',
    next: 'Next',
    confirmCreate: 'Confirm Create',
    createSuccess: 'Online service has entered the creation queue',
    acceleratorConfig: 'Accelerator Configuration',
    ok: 'OK',
    useMode: 'Usage Mode',
    passthrough: 'Passthrough',
    compute: 'Compute',
    vram: 'VRAM',
    vramExtra: 'Supports partitioning by integer multiples of 1 MiB',
    scheduleMode: 'Scheduling Mode',
    density: 'Density',
    performance: 'Performance',
    partitionMode: 'Partition Mode',
    partitionTip: 'Select an accelerator partition policy based on elastic business needs.',
    elastic: 'Elastic',
    fixed: 'Fixed',
    exclusive: 'Exclusive',
    acceleratorUpdated: 'Accelerator configuration updated',
    searchModel: 'Search model name',
    modelType: 'Model Type',
    modelCount: 'Models ({count})',
    owner: 'Owner',
    modelEmpty: 'No models are available for this type',
    versionCount: 'Versions ({count})',
    selected: 'Selected: 1 / 1',
    searchCluster: 'Search cluster name',
    clusterName: 'Cluster Name',
    cpuAllocatedTotal: 'CPU (Allocated / Total)',
    memoryAllocatedTotal: 'Memory (Allocated / Total)',
    clusterTotal: '{count} clusters in total',
    validators: {
      serviceName: 'Enter service name',
      accelerator: 'Select an accelerator',
      mode: 'Select a usage mode',
      compute: 'Enter compute',
      vram: 'Enter VRAM',
      schedule: 'Select a scheduling mode',
      partition: 'Select a partition mode',
    },
  },
} as const;

type OnlineText = typeof onlineText.zh;

const providerEn: Record<string, string> = {
  通义实验室: 'Tongyi Lab',
  深度求索: 'DeepSeek',
  自定义: 'Custom',
  智源研究院: 'BAAI',
  百度: 'Baidu',
  模型广场: 'Model Gallery',
  共享模型: 'Shared Models',
  平台: 'Platform',
  模型团队: 'Model Team',
};

const modelDescriptionEn: Record<string, string> = {
  'Qwen3-32B': 'A general-purpose language model balancing reasoning quality and deployment efficiency',
  'DeepSeek-V4-Flash-w8a8': 'A lightweight model for high-throughput inference scenarios',
  'DeepSeek-V3': 'A general-purpose foundation model released by DeepSeek',
  'DeepSeek-R1': 'Enhanced reasoning for complex logic, math, and coding tasks',
  test: 'A text generation model for testing online inference flows',
  'nieqi-test': 'Internal validation model',
  'bge-m3-2': 'Multilingual semantic embedding model',
  'qwen1-5b': 'Lightweight general-purpose text generation model',
  'ERNIE Lite': 'Lightweight text generation model for low-latency online services',
  ResNet50: 'General image classification model',
  YOLOv8: 'Real-time object detection model',
  'BGE-Large-ZH': 'Chinese text embedding model',
  'BGE-Reranker': 'Text relevance reranking model',
  'Qwen2-VL': 'Multimodal model for image-text understanding',
};

const formatResourceText = (locale: Locale, value: string) => {
  if (locale === 'zh') return value;
  return value
    .replace('英伟达 RTX PRO 5000 × 1', 'NVIDIA RTX PRO 5000 x 1')
    .replace('昇腾 / Ascend 910B', 'Ascend 910B')
    .replace('昇腾 / Ascend910B', 'Ascend 910B')
    .replace('沐曦 MXC500 × 1', 'MetaX MXC500 x 1')
    .replace(/ 核/g, ' cores')
    .replace(/ 张/g, ' cards');
};

function InferenceParametersPopover({ text }: { text: OnlineText }) {
  return (
    <div className="config-popover parameter-summary-popover">
      <Descriptions
        size="small"
        colon={false}
        column={1}
        items={[
          { key: 'input', label: text.inputToken, children: '2048' },
          { key: 'output', label: text.outputToken, children: '2048' },
          { key: 'batch', label: text.batchToken, children: text.systemDefault },
          { key: 'code', label: text.remoteCode, children: <StatusBadge status="success" text={text.on} /> },
        ]}
      />
    </div>
  );
}

function AffinityRulesPopover({ locale, text }: { locale: Locale; text: OnlineText }) {
  return (
    <div className="config-popover affinity-popover">
      <Table
        size="small"
        rowKey="key"
        dataSource={affinityRows}
        pagination={false}
        scroll={{ x: 640, y: 220 }}
        columns={[
          { title: text.property, dataIndex: 'property', width: 250 },
          { title: text.type, dataIndex: 'type', width: 130, render: (value) => locale === 'en' ? (value === '节点标签' ? text.nodeLabel : text.acceleratorLabel) : value },
          { title: text.operator, dataIndex: 'operator', width: 100 },
          { title: text.value, dataIndex: 'value', width: 140 },
        ]}
      />
    </div>
  );
}

function FieldHelp({ children, tip }: { children: string; tip?: string }) {
  return (
    <Space size={4}>
      {children}
      {tip ? <Tooltip title={tip}><QuestionCircleOutlined className="field-help" /></Tooltip> : null}
    </Space>
  );
}

function NumberField({ value, min = 0 }: { value: number; min?: number }) {
  return <SpinnerNumberInput defaultValue={value} min={min} className="number-field" />;
}

type OnlineServicePageProps = {
  locale?: Locale;
  onOpenContainerCreate?: () => void;
};

export function OnlineServicePage({ locale = 'zh', onOpenContainerCreate }: OnlineServicePageProps) {
  const { message } = App.useApp();
  const text = onlineText[locale];
  const [form] = Form.useForm();
  const [acceleratorForm] = Form.useForm();
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
  const [acceleratorConfigOpen, setAcceleratorConfigOpen] = useState(false);

  const filteredModels = useMemo(() => models.filter((item) => (
    (modelTab === 'mine' ? item.creator === 'Admin' : modelTab === 'shared' ? item.provider === '共享模型' : item.provider === '模型广场')
    && item.type === modelType
    && item.name.toLowerCase().includes(modelSearch.toLowerCase())
  )), [modelSearch, modelTab, modelType]);

  const activeDraftModel = models.find((item) => item.name === draftModel);
  const filteredClusters = useMemo(() => clusters.filter((item) => `${item.name}${item.ip}`.toLowerCase().includes(clusterSearch.toLowerCase())), [clusterSearch]);
  const filteredNodes = useMemo(() => nodes.filter((item) => item.name.toLowerCase().includes(nodeSearch.trim().toLowerCase())), [nodeSearch]);
  const format = (value: string) => formatResourceText(locale, value);
  const providerName = (value: string) => locale === 'en' ? providerEn[value] ?? value : value;
  const modelDescription = (item: ModelItem) => locale === 'en' ? modelDescriptionEn[item.name] ?? item.description : item.description;

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

  const openAcceleratorConfig = (record: ResourceSpec) => {
    acceleratorForm.setFieldsValue({
      accelerator: record.accelerator,
      mode: 'eNPU',
      compute: 1,
      memory: 1,
      schedule: 'density',
      partition: 'elastic',
    });
    setAcceleratorConfigOpen(true);
  };

  const resourceColumns: TableColumnsType<ResourceSpec> = [
    { title: text.sequence, width: 64, render: (_value, _record, index) => index + 1 },
    { title: text.inferenceEngine, dataIndex: 'engine', width: 220, render: (value) => <Select defaultValue={value} options={[{ value: 'vLLM 0.8.10' }, { value: 'MindIE 2.0' }]} /> },
    {
      title: text.accelerator,
      dataIndex: 'accelerator',
      width: 240,
      render: (value, record) => (
        <Space size={6} wrap>
          <Badge status="success" />
          <span>{format(value)}</span>
          <Button type="link" size="small" onClick={() => openAcceleratorConfig(record)}>{text.configure}</Button>
        </Space>
      ),
    },
    { title: text.cpuCores, dataIndex: 'cpu', width: 140, render: (value) => <NumberField value={value} min={1} /> },
    { title: text.memoryGib, dataIndex: 'memory', width: 150, render: (value) => <NumberField value={value} min={1} /> },
    { title: text.sharedMemoryGib, dataIndex: 'sharedMemory', width: 170, render: (value) => <NumberField value={value} /> },
    { title: text.nodeCount, dataIndex: 'nodes', width: 130, render: (value) => <NumberField value={value} min={1} /> },
  ];

  const modelTabs: TabsProps['items'] = [
    { key: 'mine', label: locale === 'en' ? 'My Models' : '我的模型' },
    { key: 'shared', label: locale === 'en' ? 'Shared Models' : '共享的模型' },
    { key: 'market', label: locale === 'en' ? 'Model Gallery' : '模型广场' },
  ];

  const nextStep = async () => {
    if (current === 0) await form.validateFields(['serviceName', 'port', 'api']);
    setCurrent((value) => Math.min(3, value + 1));
  };

  const serviceInfo = (
    <div className="section-stack">
      <section className="form-section">
        <h2>{text.serviceInfo}</h2>
        <Form.Item name="serviceName" label={text.serviceName} rules={[{ required: true, message: text.validators.serviceName }]}>
          <Input placeholder={text.enterServiceName} maxLength={64} showCount />
        </Form.Item>
        <Form.Item label={<FieldHelp tip={text.modelSelectTip}>{text.modelSelect}</FieldHelp>} required>
          <Space.Compact className="full">
            <Input value={`${selectedModel} / ${selectedVersion}`} readOnly />
            <Button onClick={() => {
              setDraftModel(selectedModel);
              setDraftVersion(selectedVersion);
              setModelOpen(true);
            }}>{text.selectModel}</Button>
          </Space.Compact>
        </Form.Item>
        <Form.Item name="protocol" label={text.accessProtocol} initialValue="HTTPS">
          <Radio.Group options={['HTTPS', 'HTTP']} />
        </Form.Item>
        <Form.Item name="port" label={<FieldHelp tip={text.portTip}>{text.port}</FieldHelp>} initialValue={18000} rules={[{ required: true }]}>
          <SpinnerNumberInput min={1} max={65535} />
        </Form.Item>
        <Form.Item name="api" label={<FieldHelp tip={text.apiTip}>API</FieldHelp>} initialValue="/v1/chat/completions" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </section>

      <section className="form-section service-settings">
        <h2>{text.serviceSettings}</h2>
        <div className="setting-row">
          <Typography.Text>{text.multiInferenceService}</Typography.Text>
          <div className="setting-control">
            <Space>
              <Switch checked={multiEndpoint} onChange={setMultiEndpoint} />
              <Typography.Text type="secondary">{text.multiEndpointTip}</Typography.Text>
            </Space>
            {multiEndpoint ? (
              <div className="endpoint-panel">
                {endpoints.map((item, index) => (
                  <div className={`endpoint-row${index > 0 ? ' is-unlabeled' : ''}`} key={item.id}>
                    <Form.Item label={index === 0 ? text.port : undefined}>
                      <SpinnerNumberInput min={1} max={65535} value={item.port} onChange={(value) => setEndpoints((items) => items.map((next) => next.id === item.id ? { ...next, port: value ?? undefined } : next))} />
                    </Form.Item>
                    <Form.Item label={index === 0 ? 'API' : undefined}>
                      <Input value={item.api} onChange={(event) => setEndpoints((items) => items.map((next) => next.id === item.id ? { ...next, api: event.target.value } : next))} />
                    </Form.Item>
                    <div className="endpoint-operation">
                      {index === 0 && <Typography.Text className="endpoint-operation-label">{text.operation}</Typography.Text>}
                      <div className="endpoint-operation-controls">
                        <Switch size="small" checked={item.enabled} onChange={(value) => setEndpoints((items) => items.map((next) => next.id === item.id ? { ...next, enabled: value } : next))} />
                        {endpoints.length > 1 && (
                          <Tooltip title={text.deleteServiceGroup}>
                            <Button
                              aria-label={`${text.deleteServiceGroup} ${index + 1}`}
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => setEndpoints((items) => items.filter((next) => next.id !== item.id))}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Space className="endpoint-add" size={4}>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    disabled={endpoints.length >= 28}
                    onClick={() => setEndpoints((items) => [...items, { id: Math.max(0, ...items.map((item) => item.id)) + 1, port: 18000, api: '/v1/chat/completions', enabled: true }])}
                  >
                    {text.add}
                  </Button>
                  <Typography.Text type="secondary">{text.endpointRemain.replace('{count}', String(28 - endpoints.length))}</Typography.Text>
                </Space>
              </div>
            ) : null}
          </div>
        </div>
        <div className="setting-row">
          <FieldHelp tip={text.apiAuthTip}>{text.apiAuth}</FieldHelp>
          <Switch checked={apiAuth} onChange={setApiAuth} />
        </div>
        <div className="setting-row">
          <Typography.Text>{text.multimodal}</Typography.Text>
          <Switch checked={multimodal} onChange={setMultimodal} />
        </div>
        <div className="setting-row setting-description">
          <Typography.Text>{text.description}</Typography.Text>
          <Input.TextArea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={200} showCount rows={3} placeholder={text.enter} />
        </div>
      </section>
    </div>
  );

  const inferenceConfig = (
    <div className="section-stack">
      <section className="form-section">
        <div className="section-head">
          <h2>{text.deploymentStrategy}</h2>
        </div>
        <Form.Item label={text.serviceScenario} required>
          <Select
            options={[
              { value: '标准推理', label: text.standardInference },
              { value: 'SmartPD', label: 'SmartPD' },
              { value: '灰度发布', label: text.grayscaleRelease },
            ]}
            defaultValue="标准推理"
          />
        </Form.Item>
        <Form.Item label={text.cluster} required>
          <Space.Compact className="full">
            <Input value={clusters.find((item) => item.key === selectedCluster)?.name ?? ''} placeholder={text.selectClusterPlaceholder} readOnly />
            <Button
              icon={<SearchOutlined />}
              onClick={() => {
                setDraftCluster(selectedCluster || 'yigou_base_user');
                setClusterOpen(true);
              }}
            >
              {text.selectCluster}
            </Button>
          </Space.Compact>
        </Form.Item>
        {selectedCluster ? (
          <div className="cluster-inline-panel">
            <div className="cluster-inline-head">
              <div>
                <Typography.Text strong>{text.clusterResource}</Typography.Text>
                <Typography.Text type="secondary">{clusters.find((item) => item.key === selectedCluster)?.name} · {text.clusterOverview}</Typography.Text>
              </div>
              <Tooltip title={text.refreshResource}><Button type="text" icon={<ReloadOutlined />} /></Tooltip>
            </div>
            <div className="cluster-metrics compact">
              <Card size="small"><b>CPU</b><span>{format('293.50 / 384.00 核')}</span><Progress percent={76} showInfo={false} /></Card>
              <Card size="small"><b>{text.memory}</b><span>1460.98 / 1949.69 GiB</span><Progress percent={75} showInfo={false} /></Card>
              <Card size="small" className="accelerator-metric-card">
                <div className="accelerator-metric-row">
                  <b><ThunderboltOutlined /> {text.accelerator}</b>
                  <div className="accelerator-metric-value">
                    <Select className="accelerator-selector" size="small" value={accelerator} onChange={setAccelerator} options={[
                      { value: 'nvidia', label: locale === 'en' ? 'NVIDIA' : '英伟达' },
                      { value: 'ascend', label: locale === 'en' ? 'Ascend' : '昇腾' },
                      { value: 'metax', label: locale === 'en' ? 'MetaX' : '沐曦' },
                    ]} />
                    <span>{locale === 'en' ? '1 / 4 cards' : '1 / 4 张'}</span>
                  </div>
                </div>
                <Progress percent={25} showInfo={false} />
              </Card>
            </div>
            <div className="cluster-node-toolbar">
              <Typography.Text strong>{text.nodeResource}</Typography.Text>
              <Input prefix={<SearchOutlined />} value={nodeSearch} onChange={(event) => setNodeSearch(event.target.value)} placeholder={text.searchNode} allowClear />
            </div>
            <div className="cluster-node-scroll">
              <Table
                size="small"
                sticky
                rowKey="key"
                dataSource={filteredNodes}
                pagination={false}
                scroll={{ x: 760, y: 164 }}
                onRow={() => ({
                  onClick: onOpenContainerCreate,
                })}
                rowClassName={onOpenContainerCreate ? 'clickable-table-row' : ''}
                columns={[
                  { title: text.nodeName, dataIndex: 'name', width: 140 },
                  { title: text.cpuAvailableTotal, dataIndex: 'cpu', width: 190, render: (value) => format(value) },
                  { title: text.memoryAvailableTotal, dataIndex: 'memory', width: 220 },
                  { title: text.accelerator, dataIndex: 'accelerator', width: 210, render: (value) => format(value) },
                ]}
              />
            </div>
          </div>
        ) : null}
        <Form.Item label={text.node}>
          <Select allowClear placeholder={text.selectNode} options={nodes.map((item) => ({ value: item.key, label: item.name }))} />
        </Form.Item>
        <Form.Item label={text.instanceCount}>
          <SpinnerNumberInput min={1} defaultValue={1} />
        </Form.Item>
      </section>

      <section className="form-section table-section">
        <h2>{text.resourceSpec}</h2>
        <Table size="middle" rowKey="key" columns={resourceColumns} dataSource={resourceSpecs} pagination={false} scroll={{ x: 1120 }} />
        <Space className="add-row">
          <Button type="link" icon={<PlusOutlined />} onClick={() => setResourceSpecs((items) => [...items, { ...baseSpec, key: String(items.length + 1) }])}>{text.addResourceSpec}</Button>
          <Typography.Text type="secondary">{text.resourceSpecRemain.replace('{count}', String(64 - resourceSpecs.length))}</Typography.Text>
        </Space>
        <Descriptions colon={false} column={2} items={[
          { key: 'scheduler', label: text.schedulerType, children: 'xxl-engine-scheduler' },
          { key: 'strategy', label: text.schedulerPolicy, children: <Tag color="blue">{text.resourceBalance}</Tag> },
        ]} />
      </section>
    </div>
  );

  const parameterConfig = (
    <div className="parameter-layout">
      <aside className="resource-list">
        <Input prefix={<SearchOutlined />} placeholder={text.searchResourceSpec} />
        {resourceSpecs.map((item, index) => (
          <Card size="small" className={`resource-card ${index === 0 ? 'active' : ''}`} key={item.key}>
            <Typography.Text strong>{text.resourceSpecName.replace('{index}', String(index + 1))}</Typography.Text>
            <Descriptions colon={false} size="small" column={1} items={[
              { key: 'engine', label: text.inferenceEngine, children: item.engine },
              { key: 'accelerator', label: text.accelerator, children: format(item.accelerator) },
            ]} />
          </Card>
        ))}
      </aside>
      <section className="form-section parameter-form">
        <div className="section-head">
          <div>
            <h2>{text.runtimeParameters}</h2>
            <Typography.Text type="secondary">{text.runtimeParametersDesc}</Typography.Text>
          </div>
          <Button icon={<CopyOutlined />}>{text.copyConfig}</Button>
        </div>
        <Tabs
          defaultActiveKey="config"
          items={[
            {
              key: 'config',
              label: text.config,
              children: (
                <div className="parameter-grid">
                  <Form.Item label={<FieldHelp tip={locale === 'en' ? 'Allow custom remote code from the model repository to be loaded.' : '允许加载模型仓库中的自定义远程代码。'}>trust-remote-code</FieldHelp>}><Switch defaultChecked /></Form.Item>
                  <Form.Item label="max-input-token-len"><NumberField value={2048} /></Form.Item>
                  <Form.Item label="max-output-token-len"><NumberField value={2048} /></Form.Item>
                  <Form.Item label="max-num-batched-tokens"><NumberField value={0} /></Form.Item>
                  <Collapse
                    className="advanced-collapse"
                    expandIconPosition="end"
                    ghost
                    items={[{
                      key: 'advanced',
                      label: text.advancedConfig,
                      children: (
                        <div className="advanced-grid">
                          <Form.Item label={text.highPerformanceRouting}><Switch defaultChecked /></Form.Item>
                          <Form.Item label={text.scaling}><Switch /></Form.Item>
                          <Form.Item label={text.nodeAffinity}><Switch checked={affinity} onChange={setAffinity} /></Form.Item>
                          <Form.Item label={text.fileMount}><Switch /></Form.Item>
                        </div>
                      ),
                    }]}
                  />
                </div>
              ),
            },
            { key: 'custom', label: text.custom, children: <Input.TextArea rows={12} placeholder={text.customJsonPlaceholder} /> },
          ]}
        />
      </section>
    </div>
  );

  const confirmInfo = (
    <div className="section-stack">
      <section className="form-section">
        <h2>{text.baseConfig}</h2>
        <Descriptions colon={false} column={4} items={[
          { key: 'name', label: text.serviceName, children: form.getFieldValue('serviceName') || (locale === 'en' ? 'Qwen3-32B Online Service' : 'Qwen3-32B 在线服务') },
          { key: 'model', label: text.modelSelect, children: `${selectedModel} / ${selectedVersion}` },
          { key: 'local', label: text.localAcceleration, children: <StatusBadge status="success" text={text.enabled} /> },
          { key: 'protocol', label: text.accessProtocol, children: form.getFieldValue('protocol') || 'HTTPS' },
          { key: 'port', label: text.port, children: form.getFieldValue('port') || 18000 },
          { key: 'api', label: 'API', children: form.getFieldValue('api') || '/v1/chat/completions' },
          { key: 'multi', label: text.multiInferenceService, children: multiEndpoint ? text.multiEnabled.replace('{count}', String(endpoints.length)) : text.disabled },
          { key: 'auth', label: text.apiAuth, children: apiAuth ? text.on : text.disabled },
        ]} />
      </section>
      <section className="form-section table-section">
        <h2>{text.inferenceConfig}</h2>
        <Descriptions colon={false} column={4} items={[
          { key: 'scene', label: text.serviceScenario, children: text.standardInference },
          { key: 'cluster', label: text.cluster, children: clusters.find((item) => item.key === selectedCluster)?.name || 'yigou_base_user_' },
          { key: 'node', label: text.node, children: text.autoSchedule },
          { key: 'instance', label: text.instanceCount, children: 1 },
        ]} />
        <Table
          size="middle"
          rowKey="key"
          dataSource={resourceSpecs}
          pagination={false}
          scroll={{ x: 1180 }}
          columns={[
            { title: text.sequence, width: 64, render: (_value, _record, index) => index + 1 },
            { title: text.inferenceEngine, dataIndex: 'engine', width: 150 },
            { title: text.accelerator, dataIndex: 'accelerator', width: 240, render: (value) => format(value) },
            { title: text.cpuCores, dataIndex: 'cpu', width: 100 },
            { title: text.memoryGib, dataIndex: 'memory', width: 120 },
            { title: text.sharedMemoryGib, dataIndex: 'sharedMemory', width: 140 },
            { title: text.nodeCount, dataIndex: 'nodes', width: 100 },
            {
              title: text.parameterConfig,
              width: 100,
              render: () => (
                <Popover
                  arrow
                  placement="leftTop"
                  trigger="hover"
                  content={<InferenceParametersPopover text={text} />}
                >
                  <Button type="link" size="small">{text.detail}</Button>
                </Popover>
              ),
            },
          ]}
        />
      </section>
      <section className="form-section">
        <h2>{text.advancedConfig}</h2>
        <Descriptions colon={false} column={4} items={[
          { key: 'route', label: text.highPerformanceRouting, children: <StatusBadge status="success" text={text.enabled} /> },
          { key: 'scale', label: text.scaling, children: text.disabled },
          {
            key: 'affinity',
            label: text.nodeAffinity,
            children: affinity ? (
              <Space size={4}>
                <StatusBadge status="success" text={text.enabled} />
                <Popover
                  arrow
                  placement="top"
                  trigger="hover"
                  content={<AffinityRulesPopover locale={locale} text={text} />}
                >
                  <Button className="config-detail-trigger" type="link" size="small">{text.detail}</Button>
                </Popover>
              </Space>
            ) : text.disabled,
          },
          { key: 'mount', label: text.fileMount, children: text.disabled },
        ]} />
      </section>
    </div>
  );

  return (
    <div className="workspace-page online-service-page">
      <div className="service-page-heading">
        <Space size={8}>
          <Button type="text" icon={<ArrowLeftOutlined />} aria-label={text.back} />
          <Typography.Title level={3}>{text.createOnlineService}</Typography.Title>
        </Space>
      </div>
      <Form form={form} colon={false} layout="vertical" className="wizard-surface">
        <div className="steps-wrap">
          <Steps
            current={current}
            responsive
            items={[
              { title: text.stepBasic, description: text.stepBasicDesc },
              { title: text.stepInference, description: text.stepInferenceDesc },
              { title: text.stepParameter, description: text.stepParameterDesc },
              { title: text.stepConfirm, description: text.stepConfirmDesc },
            ]}
          />
        </div>
        <div className="wizard-content">
          {[serviceInfo, inferenceConfig, parameterConfig, confirmInfo][current]}
        </div>
        <footer className="wizard-footer">
          <Button>{text.cancel}</Button>
          {current > 0 ? <Button onClick={() => setCurrent((value) => value - 1)}>{text.previous}</Button> : null}
          {current < 3 ? (
            <Button type="primary" onClick={nextStep}>{text.next}</Button>
          ) : (
            <Button type="primary" onClick={() => message.success(text.createSuccess)}>{text.confirmCreate}</Button>
          )}
        </footer>
      </Form>

      <Modal
        className="accelerator-config-modal"
        title={text.acceleratorConfig}
        open={acceleratorConfigOpen}
        width={520}
        okText={text.ok}
        cancelText={text.cancel}
        onCancel={() => setAcceleratorConfigOpen(false)}
        onOk={() => {
          acceleratorForm.validateFields().then(() => {
            setAcceleratorConfigOpen(false);
            message.success(text.acceleratorUpdated);
          });
        }}
      >
        <Form
          form={acceleratorForm}
          className="accelerator-config-form"
          layout="vertical"
          colon={false}
        >
          <Form.Item name="accelerator" label={text.accelerator} rules={[{ required: true, message: text.validators.accelerator }]}>
            <Select options={[
              { value: '英伟达 RTX PRO 5000 × 1', label: format('英伟达 RTX PRO 5000 × 1') },
              { value: '昇腾 / Ascend910B', label: format('昇腾 / Ascend910B') },
              { value: '沐曦 MXC500 × 1', label: format('沐曦 MXC500 × 1') },
            ]} />
          </Form.Item>
          <Form.Item name="mode" label={text.useMode} rules={[{ required: true, message: text.validators.mode }]}>
            <Radio.Group options={[
              { value: 'passthrough', label: text.passthrough },
              { value: 'eNPU', label: 'eNPU' },
            ]} />
          </Form.Item>
          <Form.Item name="compute" label={text.compute} rules={[{ required: true, message: text.validators.compute }]}>
            <FixedUnitNumberInput min={1} max={100} unit="%" />
          </Form.Item>
          <Form.Item name="memory" label={text.vram} extra={text.vramExtra} rules={[{ required: true, message: text.validators.vram }]}>
            <SelectUnitNumberInput min={1} unitDefaultValue="MiB" />
          </Form.Item>
          <Form.Item name="schedule" label={text.scheduleMode} rules={[{ required: true, message: text.validators.schedule }]}>
            <Radio.Group options={[
              { value: 'density', label: text.density },
              { value: 'performance', label: text.performance },
            ]} />
          </Form.Item>
          <Form.Item
            name="partition"
            label={<FieldHelp tip={text.partitionTip}>{text.partitionMode}</FieldHelp>}
            rules={[{ required: true, message: text.validators.partition }]}
          >
            <Select options={[
              { value: 'elastic', label: text.elastic },
              { value: 'fixed', label: text.fixed },
              { value: 'exclusive', label: text.exclusive },
            ]} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="model-picker-modal"
        title={text.selectModel}
        open={modelOpen}
        onCancel={() => setModelOpen(false)}
        onOk={() => {
          setSelectedModel(draftModel);
          setSelectedVersion(draftVersion);
          setModelOpen(false);
        }}
        width={1240}
        okText={text.ok}
        cancelText={text.cancel}
        okButtonProps={{ disabled: !draftModel || !draftVersion }}
        styles={{ body: { paddingTop: 0 } }}
      >
        <Tabs
          className="model-picker-tabs"
          activeKey={modelTab}
          onChange={selectModelTab}
          items={modelTabs}
          tabBarExtraContent={<Input prefix={<SearchOutlined />} value={modelSearch} onChange={(event) => setModelSearch(event.target.value)} placeholder={text.searchModel} allowClear className="model-search" />}
        />
        <div className="model-picker-grid">
          <div className="model-type-column">
            <h3>{text.modelType}</h3>
            <div className="model-type-list">
              {modelTypes.map((item) => (
                <button type="button" className={modelType === item.key ? 'model-type-option selected' : 'model-type-option'} key={item.key} onClick={() => selectModelType(item.key)}>
                  <span>{locale === 'en' ? {
                    text: 'Text Generation',
                    'image-classification': 'Image Classification',
                    'object-detection': 'Object Detection',
                    segmentation: 'Semantic Segmentation',
                    embedding: 'Embeddings',
                    rerank: 'Rerank',
                    other: 'Other',
                    'image-understanding': 'Image Understanding',
                  }[item.key] : item.label}</span>
                  <Tag>{item.count}</Tag>
                </button>
              ))}
            </div>
          </div>
          <div className="model-column">
            <h3>{text.modelCount.replace('{count}', String(filteredModels.length))}</h3>
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
                          <small>{modelDescription(item)}</small>
                        </span>
                        <span className="model-owner">{text.owner} {providerName(item.creator)}</span>
                      </span>
                    </Radio>
                  </div>
                )) : <div className="model-empty">{text.modelEmpty}</div>}
              </div>
            </Radio.Group>
          </div>
          <div className="version-column">
            <h3>{text.versionCount.replace('{count}', String(activeDraftModel?.versions.length ?? 0))}</h3>
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
            <Typography.Text type="secondary">{text.selected}</Typography.Text>
            <Tag>{draftModel}</Tag>
          </div>
        </div>
      </Modal>

      <Modal
        className="cluster-picker-modal"
        title={text.selectCluster}
        open={clusterOpen}
        onCancel={() => setClusterOpen(false)}
        onOk={() => {
          setSelectedCluster(draftCluster);
          setClusterOpen(false);
        }}
        width={920}
        okText={text.ok}
        cancelText={text.cancel}
        okButtonProps={{ disabled: !draftCluster }}
      >
        <div className="cluster-picker-toolbar">
          <Input prefix={<SearchOutlined />} value={clusterSearch} onChange={(event) => setClusterSearch(event.target.value)} placeholder={text.searchCluster} allowClear />
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
            { title: text.clusterName, dataIndex: 'name', width: 160 },
            { title: 'IP', dataIndex: 'ip', width: 132 },
            { title: text.cpuAllocatedTotal, dataIndex: 'cpu', width: 190, render: (value) => format(value) },
            { title: text.memoryAllocatedTotal, dataIndex: 'memory', width: 220 },
            { title: text.accelerator, dataIndex: 'accelerator', width: 210, render: (value) => format(value) },
          ]}
        />
        <Typography.Text className="cluster-total" type="secondary">{text.clusterTotal.replace('{count}', String(filteredClusters.length))}</Typography.Text>
      </Modal>
    </div>
  );
}
