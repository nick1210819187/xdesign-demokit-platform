import { useMemo, useState } from 'react';
import {
  App as AntdApp,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Collapse,
  Descriptions,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { CheckboxOptionType } from 'antd/es/checkbox/Group';
import type { MenuProps } from 'antd';
import {
  ApiOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  DownOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RocketOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { SpinnerNumberInput } from '../components/NumericInput';
import type { Locale } from '../i18n';

type ModelStatus = 'New' | '推荐' | '内测' | '已部署';

type ModelItem = {
  id: string;
  name: string;
  provider: string;
  org: string;
  type: string;
  context: string;
  source: string;
  scale: string;
  status: ModelStatus;
  description: string;
  descriptionEn: string;
  tags: string[];
  updatedAt: string;
  versions: number;
  logoText: string;
  logoTone: 'blue' | 'green' | 'purple' | 'dark';
};

type FilterKey = 'provider' | 'type' | 'context' | 'source' | 'ability' | 'scale';

const filterGroups: Array<{ key: FilterKey; label: string; options: string[] }> = [
  {
    key: 'provider',
    label: '提供方',
    options: ['深度求索', '通义千问', 'MiniMax', '腾讯混元', 'Kimi', '美团', '百川智能', '阶跃星辰', '商汤日日新'],
  },
  {
    key: 'type',
    label: '模型类型',
    options: ['文本生成', '图像分类', '目标检测', '语义分析', '向量表示', '重排序', '图像理解', '文生视频', '草稿模型', '其他'],
  },
  {
    key: 'context',
    label: '上下文长度',
    options: ['16K以下', '16K到64K', '64K以上'],
  },
  {
    key: 'source',
    label: '模型来源',
    options: ['预置', '自定义'],
  },
  {
    key: 'ability',
    label: '模型扩展能力',
    options: ['Function call', 'think', 'Tools', 'MoE', '多模态', '推理模型'],
  },
  {
    key: 'scale',
    label: '参数规模',
    options: ['10B以下', '10B到50B', '50B到100B', '100B以上'],
  },
];

const galleryText = {
  zh: {
    pageTitle: '左筛右卡',
    filters: '筛选器',
    clear: '清空',
    clearItem: '清除',
    search: '按模型名称 / 厂商 / 标签搜索',
    empty: '没有找到匹配的模型',
    updatedAt: '更新时间：',
    versions: '版本数量：',
    useModel: '使用此模型',
    onlineTrial: '在线体验',
    evaluate: '评估',
    deploy: '部署',
    detail: '模型详情',
    close: '关闭',
    basicInfo: '基本信息',
    capabilities: '能力说明',
    specs: '技术规格',
    cost: '费用 / 资源',
    history: '使用记录',
    modelName: '模型名称',
    provider: '厂商',
    modelType: '模型类型',
    scale: '参数规模',
    context: '上下文长度',
    releaseDate: '发布时间',
    version: '版本',
    scenario: '适用场景',
    advantage: '核心优势',
    limits: '限制说明',
    inputType: '输入类型',
    outputType: '输出类型',
    toolSupport: '支持工具调用',
    multimodalSupport: '支持多模态',
    yes: '是',
    no: '否',
    callCost: '调用成本',
    deployResource: '推荐部署资源',
    minGpu: '最小 GPU 要求',
    lastEval: '最近评估',
    lastDeploy: '最近部署',
    lastTrial: '最近体验',
    evalTitle: '发起模型评估',
    deployTitle: '发起模型部署',
    cancel: '取消',
    submitEval: '提交评估',
    submitDeploy: '提交部署',
    deleteDraft: '删除草稿',
    confirmDeleteDraft: '确认删除当前部署草稿？',
    ok: '确认',
    basicSection: '基本信息',
    evalTarget: '评估对象',
    evalConfig: '评估参数配置',
    resourceConfig: '资源配置',
    serviceConfig: '服务配置',
    taskName: '任务名称',
    cluster: '集群',
    node: '节点',
    description: '描述',
    inferenceService: '推理服务',
    baseModel: '基础模型',
    arena: '竞技场模式',
    datasetType: '数据集类型',
    datasetSelect: '数据集选择',
    addDataset: '添加数据集',
    datasetParams: '数据集参数',
    maxSamples: '最大评测数据量',
    otherParams: '其他参数',
    modelParams: '模型推理参数',
    stream: '流式请求',
    metrics: '评估方法',
    serviceName: '服务名称',
    deployCluster: '部署集群',
    gpuType: 'GPU 类型',
    gpuCount: 'GPU 数量',
    replicas: '实例数量',
    quota: '显存配额',
    route: '服务路径',
    auth: '启用鉴权',
  },
  en: {
    pageTitle: 'Model Gallery',
    filters: 'Filters',
    clear: 'Clear',
    clearItem: 'Clear',
    search: 'Search by model, provider, or tag',
    empty: 'No matching models',
    updatedAt: 'Updated: ',
    versions: 'Versions: ',
    useModel: 'Use Model',
    onlineTrial: 'Try Online',
    evaluate: 'Evaluate',
    deploy: 'Deploy',
    detail: 'Model Details',
    close: 'Close',
    basicInfo: 'Basic Information',
    capabilities: 'Capabilities',
    specs: 'Technical Specs',
    cost: 'Cost / Resources',
    history: 'Usage History',
    modelName: 'Model Name',
    provider: 'Provider',
    modelType: 'Model Type',
    scale: 'Scale',
    context: 'Context Length',
    releaseDate: 'Release Date',
    version: 'Versions',
    scenario: 'Scenarios',
    advantage: 'Strengths',
    limits: 'Limitations',
    inputType: 'Input Type',
    outputType: 'Output Type',
    toolSupport: 'Tool Calling',
    multimodalSupport: 'Multimodal',
    yes: 'Yes',
    no: 'No',
    callCost: 'Cost',
    deployResource: 'Recommended Resource',
    minGpu: 'Minimum GPU',
    lastEval: 'Last Evaluation',
    lastDeploy: 'Last Deployment',
    lastTrial: 'Last Trial',
    evalTitle: 'Start Model Evaluation',
    deployTitle: 'Start Model Deployment',
    cancel: 'Cancel',
    submitEval: 'Submit Evaluation',
    submitDeploy: 'Submit Deployment',
    deleteDraft: 'Delete Draft',
    confirmDeleteDraft: 'Delete the current deployment draft?',
    ok: 'OK',
    basicSection: 'Basic Information',
    evalTarget: 'Evaluation Target',
    evalConfig: 'Evaluation Parameters',
    resourceConfig: 'Resource Configuration',
    serviceConfig: 'Service Configuration',
    taskName: 'Task Name',
    cluster: 'Cluster',
    node: 'Node',
    description: 'Description',
    inferenceService: 'Inference Service',
    baseModel: 'Base Model',
    arena: 'Arena Mode',
    datasetType: 'Dataset Type',
    datasetSelect: 'Dataset',
    addDataset: 'Add Dataset',
    datasetParams: 'Dataset Parameters',
    maxSamples: 'Max Samples',
    otherParams: 'Other Parameters',
    modelParams: 'Inference Parameters',
    stream: 'Streaming',
    metrics: 'Metrics',
    serviceName: 'Service Name',
    deployCluster: 'Deployment Cluster',
    gpuType: 'GPU Type',
    gpuCount: 'GPU Count',
    replicas: 'Replicas',
    quota: 'GPU Memory Quota',
    route: 'Service Path',
    auth: 'Authentication',
  },
};

const galleryLabelEn: Record<string, string> = {
  提供方: 'Provider',
  模型类型: 'Model Type',
  上下文长度: 'Context Length',
  模型来源: 'Model Source',
  模型扩展能力: 'Model Capabilities',
  参数规模: 'Parameter Scale',
  深度求索: 'DeepSeek',
  通义千问: 'Qwen',
  腾讯混元: 'Tencent Hunyuan',
  美团: 'Meituan',
  百川智能: 'Baichuan',
  阶跃星辰: 'StepFun',
  商汤日日新: 'SenseTime',
  文本生成: 'Text Generation',
  图像分类: 'Image Classification',
  目标检测: 'Object Detection',
  语义分析: 'Semantic Analysis',
  向量表示: 'Embedding',
  重排序: 'Reranking',
  图像理解: 'Vision Understanding',
  文生视频: 'Text to Video',
  草稿模型: 'Draft Model',
  其他: 'Other',
  '16K以下': 'Below 16K',
  '16K到64K': '16K to 64K',
  '64K以上': 'Above 64K',
  预置: 'Built-in',
  自定义: 'Custom',
  多模态: 'Multimodal',
  推理模型: 'Reasoning',
  对话: 'Chat',
  视觉: 'Vision',
  视频: 'Video',
  内测: 'Beta',
  已部署: 'Deployed',
  推荐: 'Recommended',
  综合排序: 'Recommended',
  最近最新: 'Latest',
};

const models: ModelItem[] = [
  {
    id: 'longcat',
    name: 'meituan-longcat/LongCat-2.0',
    provider: '美团',
    org: '美团',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: 'New',
    description: '面向 Agent 开发场景的高性能语言模型，支持工具调用、多步推理和长上下文任务编排。',
    descriptionEn: 'A high-performance language model for agent development, tool calling, multi-step reasoning, and long-context orchestration.',
    tags: ['对话', 'Prefix', 'Tools', '1.6T', '1M', 'MoE', '推理模型'],
    updatedAt: '2026-08-25 17:27:23',
    versions: 1,
    logoText: 'M',
    logoTone: 'green',
  },
  {
    id: 'kimi-k3',
    name: 'moonshotai/Kimi-K3',
    provider: 'Kimi',
    org: 'Kimi',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: '推荐',
    description: '面向软件工程、知识工作和深度推理的旗舰模型，支持百万级长上下文和视觉理解。',
    descriptionEn: 'A flagship model for software engineering, knowledge work, and deep reasoning, with million-token context and vision understanding.',
    tags: ['对话', '视觉', 'Tools', '1M', '推理模型'],
    updatedAt: '2026-08-26 10:18:42',
    versions: 3,
    logoText: 'K',
    logoTone: 'dark',
  },
  {
    id: 'qwen35-plus',
    name: 'qwen/Qwen3.5-Plus',
    provider: '通义千问',
    org: '通义千问',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: 'New',
    description: '面向通用推理、多模态理解和企业生产调用的旗舰模型，适合复杂问答与长文档任务。',
    descriptionEn: 'A flagship model for general reasoning, multimodal understanding, and enterprise production calls across complex QA and long documents.',
    tags: ['对话', '视觉', '视频', '1M', '推理模型'],
    updatedAt: '2026-08-25 18:06:12',
    versions: 2,
    logoText: 'Q',
    logoTone: 'blue',
  },
  {
    id: 'minimax-m3',
    name: 'minimax/MiniMax-M3',
    provider: 'MiniMax',
    org: 'MiniMax',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: '推荐',
    description: '面向编码与智能体任务的多模态模型，支持长上下文、工具调用和复杂任务分解。',
    descriptionEn: 'A multimodal model for coding and agentic tasks, with long context, tool calling, and complex task decomposition.',
    tags: ['Tools', '多模态', '1M', 'Coder', '推理模型'],
    updatedAt: '2026-08-24 16:36:55',
    versions: 2,
    logoText: 'M',
    logoTone: 'purple',
  },
  {
    id: 'hunyuan-a13b',
    name: 'tencent-hunyuan/Hunyuan-A13B',
    provider: '腾讯混元',
    org: '腾讯混元',
    type: '文本生成',
    context: '16K到64K',
    source: '预置',
    scale: '10B到50B',
    status: 'New',
    description: '面向多语言理解、知识问答和轻量部署的开源模型，适合企业内网推理服务。',
    descriptionEn: 'An open model for multilingual understanding, knowledge QA, and lightweight enterprise intranet inference.',
    tags: ['对话', 'Tools', '33语种', '推理模型'],
    updatedAt: '2026-08-24 09:28:16',
    versions: 1,
    logoText: 'H',
    logoTone: 'blue',
  },
  {
    id: 'deepseek-pro',
    name: 'deepseek-ai/DeepSeek-V4-Pro',
    provider: 'DeepSeek',
    org: '深度求索',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: '已部署',
    description: '旗舰 MoE 语言模型，适合复杂推理、工具调用、知识问答和企业级服务部署。',
    descriptionEn: 'A flagship MoE language model for complex reasoning, tool calling, knowledge QA, and enterprise service deployment.',
    tags: ['对话', 'Tools', '1.6T', '1M', 'MoE', '推理模型'],
    updatedAt: '2026-08-23 09:35:42',
    versions: 3,
    logoText: 'D',
    logoTone: 'blue',
  },
  {
    id: 'step-audio',
    name: 'stepfun/Step-Audio-Chat',
    provider: '阶跃星辰',
    org: '阶跃星辰',
    type: '语义分析',
    context: '16K到64K',
    source: '自定义',
    scale: '50B到100B',
    status: '内测',
    description: '面向语音理解、会议摘要和多轮对话的多模态模型，适合音频内容生产与质检场景。',
    descriptionEn: 'A multimodal model for speech understanding, meeting summaries, and multi-turn dialogue in audio production and QA scenarios.',
    tags: ['多模态', '对话', 'Tools'],
    updatedAt: '2026-08-22 20:14:09',
    versions: 1,
    logoText: 'S',
    logoTone: 'green',
  },
  {
    id: 'baichuan-vision',
    name: 'baichuan/OmniVision-Pro',
    provider: '百川智能',
    org: '百川智能',
    type: '图像理解',
    context: '16K到64K',
    source: '自定义',
    scale: '50B到100B',
    status: '推荐',
    description: '面向图像理解和多模态问答的模型，可用于图文检索、质检识别和视觉推理。',
    descriptionEn: 'A model for visual understanding and multimodal QA, suitable for image-text retrieval, quality inspection, and visual reasoning.',
    tags: ['视觉', '多模态', '推理模型', 'Tools'],
    updatedAt: '2026-08-22 15:40:08',
    versions: 4,
    logoText: 'B',
    logoTone: 'purple',
  },
  {
    id: 'sensechat-v6',
    name: 'sensecore/SenseChat-V6',
    provider: '商汤日日新',
    org: '商汤日日新',
    type: '图像理解',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: '已部署',
    description: '面向图文理解、办公问答和行业知识助手的多模态模型，适合企业场景集成。',
    descriptionEn: 'A multimodal model for image-text understanding, office QA, and industry knowledge assistants in enterprise integrations.',
    tags: ['视觉', '多模态', '对话', 'Tools'],
    updatedAt: '2026-08-21 21:38:44',
    versions: 2,
    logoText: 'S',
    logoTone: 'dark',
  },
  {
    id: 'hunyuan-video',
    name: 'tencent-hunyuan/Text2Video-Lite',
    provider: '腾讯混元',
    org: '腾讯混元',
    type: '文生视频',
    context: '16K以下',
    source: '自定义',
    scale: '10B到50B',
    status: '内测',
    description: '轻量文生视频模型，适合快速生成短视频草稿、运营素材和内容创意验证。',
    descriptionEn: 'A lightweight text-to-video model for short video drafts, marketing assets, and fast content ideation.',
    tags: ['视频', '草稿模型', '多模态'],
    updatedAt: '2026-08-21 18:12:30',
    versions: 1,
    logoText: 'H',
    logoTone: 'blue',
  },
];

const initialFilters: Record<FilterKey, string[]> = {
  provider: [],
  type: [],
  context: [],
  source: [],
  ability: [],
  scale: [],
};

const statusColor: Partial<Record<ModelStatus, string>> = {
  New: 'red',
  推荐: 'blue',
};

function getLogoClass(tone: ModelItem['logoTone']) {
  return `model-logo ${tone}`;
}

function getDisplayModelName(name: string) {
  return name.split('/').pop() ?? name;
}

function hasFilter(filters: Record<FilterKey, string[]>) {
  return Object.values(filters).some((value) => value.length > 0);
}

export function ModelGalleryPage({ locale = 'zh', pageTitle }: { locale?: Locale; pageTitle?: string }) {
  const text = galleryText[locale];
  const labelOf = (value: string) => locale === 'en' ? galleryLabelEn[value] ?? value : value;
  const modelProvider = (model: ModelItem) => `${labelOf(model.provider)} / ${labelOf(model.org)}`;
  const menuItems: MenuProps['items'] = [
    { key: 'evaluate', label: text.evaluate, icon: <ExperimentOutlined /> },
    { key: 'deploy', label: text.deploy, icon: <RocketOutlined /> },
  ];
  const sortOptions = [
    { value: 'recommend', label: labelOf('综合排序') },
    { value: 'latest', label: labelOf('最近最新') },
  ];
  const { message } = AntdApp.useApp();
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommend');
  const [activeModel, setActiveModel] = useState<ModelItem | null>(models[0]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [evaluateOpen, setEvaluateOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [datasetExtraOpen, setDatasetExtraOpen] = useState(false);
  const [modelExtraOpen, setModelExtraOpen] = useState(false);
  const [evalForm] = Form.useForm();
  const [deployForm] = Form.useForm();

  const filteredModels = useMemo(() => {
    const next = models.filter((item) => {
      const searchText = `${item.name} ${item.provider} ${item.org} ${item.tags.join(' ')} ${item.descriptionEn}`.toLowerCase();
      const matchedSearch = !search || searchText.includes(search.trim().toLowerCase());
      const matchedProvider = !filters.provider.length || filters.provider.includes(item.org) || filters.provider.includes(item.provider);
      const matchedType = !filters.type.length || filters.type.includes(item.type);
      const matchedContext = !filters.context.length || filters.context.includes(item.context);
      const matchedSource = !filters.source.length || filters.source.includes(item.source);
      const matchedAbility = !filters.ability.length || filters.ability.some((tag) => item.tags.includes(tag));
      const matchedScale = !filters.scale.length || filters.scale.includes(item.scale);
      return matchedSearch && matchedProvider && matchedType && matchedContext && matchedSource && matchedAbility && matchedScale;
    });
    if (sort === 'latest') {
      return [...next].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return [...next].sort((a, b) => Number(b.status === '推荐') - Number(a.status === '推荐'));
  }, [filters, search, sort]);

  const openDetail = (model: ModelItem) => {
    setActiveModel(model);
    setDetailOpen(true);
  };

  const openEvaluate = (model: ModelItem) => {
    setActiveModel(model);
    evalForm.setFieldsValue({
      taskName: `${model.name.split('/').pop()} ${locale === 'en' ? 'evaluation' : '评估任务'}`,
      baseModel: model.name,
      datasets: [{ dataset: '通用问答评测集' }],
      maxSamples: 500,
      maxTokens: 2048,
      topP: 0.8,
      temperature: 0.7,
      topK: 40,
      stream: true,
      metrics: ['准确率', 'F1', 'Rouge-L'],
    });
    setEvaluateOpen(true);
  };

  const openDeploy = (model: ModelItem) => {
    setActiveModel(model);
    deployForm.setFieldsValue({
      serviceName: `${model.name.split('/').pop()}-service`,
      cluster: '上海-推理集群-A',
      replicas: 2,
      gpu: 'NVIDIA H800',
      gpuCount: 2,
      route: '/v1/chat/completions',
      auth: true,
    });
    setDeployOpen(true);
  };

  const handleUseMenu = (model: ModelItem): MenuProps['onClick'] => ({ key, domEvent }) => {
    domEvent.stopPropagation();
    if (key === 'evaluate') openEvaluate(model);
    if (key === 'deploy') openDeploy(model);
  };

  const submitFeedback = (type: '评估' | '部署') => {
    const typeLabel = type === '评估' ? text.evaluate : text.deploy;
    message.success(locale === 'en' ? `${typeLabel} task submitted` : `${type}任务已提交`);
    setEvaluateOpen(false);
    setDeployOpen(false);
  };

  const renderFilterPanel = () => (
    <aside className="model-filter-panel">
      <div className="model-filter-head">
        <Typography.Text strong>{text.filters}</Typography.Text>
        <Button
          type="link"
          size="small"
          disabled={!hasFilter(filters)}
          onClick={() => setFilters(initialFilters)}
        >
          {text.clear}
        </Button>
      </div>
      <Collapse
        ghost
        defaultActiveKey={filterGroups.map((group) => group.key)}
        items={filterGroups.map((group) => ({
          key: group.key,
          label: labelOf(group.label),
          extra: filters[group.key].length ? (
            <Button
              type="link"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                setFilters((current) => ({ ...current, [group.key]: [] }));
              }}
            >
              {text.clearItem}
            </Button>
          ) : null,
          children: (
            <Checkbox.Group
              value={filters[group.key]}
              onChange={(value) => setFilters((current) => ({ ...current, [group.key]: value as string[] }))}
            >
              <div className="filter-option-grid">
                {group.options.map((option) => (
                  <Checkbox key={option} value={option}>
                    {labelOf(option)}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          ),
        }))}
      />
    </aside>
  );

  const renderModelGrid = () => {
    if (!filteredModels.length) {
      return (
        <div className="model-state-panel">
          <Empty description={text.empty} />
        </div>
      );
    }
    return (
      <div className="model-card-grid">
        {filteredModels.map((model) => {
          const card = (
            <Card
              key={model.id}
              hoverable
              className="model-card"
              onClick={() => openDetail(model)}
            >
              <div className="model-card-main">
                <Avatar className={getLogoClass(model.logoTone)} shape="square" size={44}>
                  {model.logoText}
                </Avatar>
                <div className="model-card-body">
                  <Typography.Text strong className="model-name">
                    {getDisplayModelName(model.name)}
                  </Typography.Text>
                  <Typography.Text type="secondary" className="model-provider">{modelProvider(model)}</Typography.Text>
                </div>
              </div>
              <Typography.Paragraph ellipsis={{ rows: 2 }} className="model-desc">
                {locale === 'en' ? model.descriptionEn : model.description}
              </Typography.Paragraph>
              <div className="model-tag-row">
                {model.tags.map((tag, index) => (
                  <Tag key={tag} color={index === 0 ? 'blue' : undefined}>
                    {labelOf(tag)}
                  </Tag>
                ))}
              </div>
              <div className="model-meta-row">
                <Typography.Text type="secondary">{text.updatedAt}{model.updatedAt}</Typography.Text>
                <Typography.Text type="secondary">{text.versions}{model.versions}</Typography.Text>
              </div>
              <div className="model-card-hover-actions">
                <Dropdown menu={{ items: menuItems, onClick: handleUseMenu(model) }} trigger={['click']}>
                  <Button
                    onClick={(event) => event.stopPropagation()}
                  >
                    {text.useModel} <DownOutlined />
                  </Button>
                </Dropdown>
                <Button
                  type="primary"
                  icon={<ApiOutlined />}
                  onClick={(event) => {
                    event.stopPropagation();
                    message.success(locale === 'en' ? `Opened online trial for ${model.name}` : `已进入 ${model.name} 在线体验页`);
                  }}
                >
                  {text.onlineTrial}
                </Button>
              </div>
            </Card>
          );
          if (!statusColor[model.status]) return card;
          return (
            <Badge.Ribbon key={model.id} text={labelOf(model.status)} color={statusColor[model.status]}>
              {card}
            </Badge.Ribbon>
          );
        })}
      </div>
    );
  };

  return (
    <div className="model-gallery-page page-stack">
      <div className="page-heading compact">
        <div>
          <Typography.Title level={3}>{pageTitle ?? text.pageTitle}</Typography.Title>
        </div>
      </div>

      <div className="model-gallery-layout">
        {renderFilterPanel()}
        <section className="model-gallery-content">
          <div className="model-toolbar">
            <div className="model-toolbar-main">
              <Input
                className="model-search"
                allowClear
                prefix={<SearchOutlined />}
                placeholder={text.search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Space size={8} className="model-toolbar-side">
              <Select value={sort} options={sortOptions} onChange={setSort} />
            </Space>
          </div>
          {renderModelGrid()}
        </section>
      </div>

      <Drawer
        title={text.detail}
        size={560}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        footer={(
          <Space>
            <Button onClick={() => setDetailOpen(false)}>{text.close}</Button>
            <Button onClick={() => activeModel && message.success(locale === 'en' ? `Opened online trial for ${activeModel.name}` : `已进入 ${activeModel.name} 在线体验页`)}>{text.onlineTrial}</Button>
            <Button onClick={() => activeModel && openEvaluate(activeModel)}>{text.evaluate}</Button>
            <Button type="primary" onClick={() => activeModel && openDeploy(activeModel)}>{text.deploy}</Button>
          </Space>
        )}
      >
        {activeModel ? (
          <div className="drawer-section-stack">
            <Descriptions title={text.basicInfo} column={1} size="small" bordered>
              <Descriptions.Item label={text.modelName}>{activeModel.name}</Descriptions.Item>
              <Descriptions.Item label={text.provider}>{modelProvider(activeModel)}</Descriptions.Item>
              <Descriptions.Item label={text.modelType}>{labelOf(activeModel.type)}</Descriptions.Item>
              <Descriptions.Item label={text.scale}>{labelOf(activeModel.scale)}</Descriptions.Item>
              <Descriptions.Item label={text.context}>{labelOf(activeModel.context)}</Descriptions.Item>
              <Descriptions.Item label={text.releaseDate}>2026-08-25</Descriptions.Item>
              <Descriptions.Item label={text.version}>{activeModel.versions}</Descriptions.Item>
            </Descriptions>
            <Descriptions title={text.capabilities} column={1} size="small" bordered>
              <Descriptions.Item label={text.scenario}>{locale === 'en' ? 'Enterprise QA, code generation, agent orchestration, and model evaluation.' : '企业问答、代码生成、智能体编排、模型评估。'}</Descriptions.Item>
              <Descriptions.Item label={text.advantage}>{locale === 'en' ? activeModel.descriptionEn : activeModel.description}</Descriptions.Item>
              <Descriptions.Item label={text.limits}>{locale === 'en' ? 'Demo data is for DemoKit display only. Use the official model service notes for real limits.' : '演示数据仅用于 DemoKit 展示，真实限制以模型服务说明为准。'}</Descriptions.Item>
            </Descriptions>
            <Descriptions title={text.specs} column={1} size="small" bordered>
              <Descriptions.Item label={text.inputType}>{locale === 'en' ? 'Text / Image' : '文本 / 图像'}</Descriptions.Item>
              <Descriptions.Item label={text.outputType}>{locale === 'en' ? 'Text / Structured JSON' : '文本 / 结构化 JSON'}</Descriptions.Item>
              <Descriptions.Item label={text.toolSupport}>{activeModel.tags.includes('Tools') ? text.yes : text.no}</Descriptions.Item>
              <Descriptions.Item label={text.multimodalSupport}>{activeModel.tags.includes('多模态') || activeModel.tags.includes('视觉') ? text.yes : text.no}</Descriptions.Item>
            </Descriptions>
            <Descriptions title={text.cost} column={1} size="small" bordered>
              <Descriptions.Item label={text.callCost}>{locale === 'en' ? 'CNY 0.008 / 1K tokens' : '0.008 元 / 千 tokens'}</Descriptions.Item>
              <Descriptions.Item label={text.deployResource}>{locale === 'en' ? '2 H800 cards / 160GB GPU memory' : '2 卡 H800 / 160GB 显存'}</Descriptions.Item>
              <Descriptions.Item label={text.minGpu}>{locale === 'en' ? '1 H20 card' : '1 卡 H20'}</Descriptions.Item>
            </Descriptions>
            <Descriptions title={text.history} column={1} size="small" bordered>
              <Descriptions.Item label={text.lastEval}>2026-08-14 14:20:18</Descriptions.Item>
              <Descriptions.Item label={text.lastDeploy}>2026-08-13 18:42:09</Descriptions.Item>
              <Descriptions.Item label={text.lastTrial}>2026-08-14 16:05:33</Descriptions.Item>
            </Descriptions>
          </div>
        ) : null}
      </Drawer>

      <Drawer
        title={text.evalTitle}
        size={680}
        open={evaluateOpen}
        onClose={() => setEvaluateOpen(false)}
        footer={(
          <Space>
            <Button onClick={() => setEvaluateOpen(false)}>{text.cancel}</Button>
            <Button type="primary" onClick={() => evalForm.validateFields().then(() => submitFeedback('评估'))}>{text.submitEval}</Button>
          </Space>
        )}
      >
        <Form
          form={evalForm}
          layout="vertical"
          initialValues={{
            taskName: locale === 'en' ? 'Model evaluation task' : '模型评估任务',
            datasets: [{ dataset: '通用问答评测集' }],
            dataType: 'preset',
            stream: true,
            apiKey: 'default-ak',
            arena: false,
            metrics: ['准确率', 'F1'],
          }}
        >
          <FormSection title={text.basicSection} />
          <div className="drawer-form-grid">
            <Form.Item name="taskName" label={text.taskName} rules={[{ required: true, message: locale === 'en' ? 'Enter a task name' : '请输入任务名称' }]}>
              <Input placeholder={locale === 'en' ? 'Enter a task name' : '请输入任务名称'} />
            </Form.Item>
            <Form.Item name="cluster" label={text.cluster} rules={[{ required: true, message: locale === 'en' ? 'Select a cluster' : '请选择集群' }]}>
              <Select placeholder={locale === 'en' ? 'Select a cluster' : '请选择集群'} options={[
                { value: '上海-推理集群-A', label: locale === 'en' ? 'Shanghai Inference Cluster A' : '上海-推理集群-A' },
                { value: '北京-评测集群-B', label: locale === 'en' ? 'Beijing Evaluation Cluster B' : '北京-评测集群-B' },
              ]} />
            </Form.Item>
            <Form.Item name="node" label={text.node}>
              <Select allowClear placeholder={locale === 'en' ? 'Select a node' : '请选择节点'} options={[{ value: 'node-01' }, { value: 'node-02' }]} />
            </Form.Item>
            <Form.Item name="description" label={text.description}>
              <Input placeholder={locale === 'en' ? 'Enter a description' : '请输入描述'} />
            </Form.Item>
          </div>

          <FormSection title={text.evalTarget} />
          <Form.Item
            name="service"
            label={text.inferenceService}
            tooltip={locale === 'en' ? 'Model evaluation currently supports LLM inference services in standard, smart, and PD service scenarios.' : '模型评估目前仅支持标准推理和 smart、PD 服务场景的 LLM 模型推理服务'}
            rules={[{ required: true, message: locale === 'en' ? 'Select an inference service' : '请选择推理服务' }]}
          >
            <Select placeholder={locale === 'en' ? 'Select an inference service' : '请选择推理服务'} options={[{ value: 'standard-chat-service' }, { value: 'smart-pd-service' }]} />
          </Form.Item>
          <div className="drawer-form-grid">
            <Form.Item name="baseModel" label={text.baseModel}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="apiKey" label="API key" rules={[{ required: true, message: locale === 'en' ? 'Select an API key' : '请选择 API key' }]}>
              <Select options={[
                { value: 'default-ak', label: locale === 'en' ? 'Default API key' : '默认 API key' },
                { value: 'sandbox-ak', label: locale === 'en' ? 'Sandbox API key' : '沙箱 API key' },
              ]} />
            </Form.Item>
          </div>
          <Form.Item name="arena" label={text.arena} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="dataType"
            label={text.datasetType}
            tooltip={locale === 'en' ? 'Choose a built-in or custom dataset as the evaluation sample source.' : '选择预置数据集或自定义数据集作为评估样本来源'}
            rules={[{ required: true }]}
          >
            <Radio.Group options={[
              { value: 'preset', label: labelOf('预置') },
              { value: 'custom', label: labelOf('自定义') },
            ]} />
          </Form.Item>
          <Form.List name="datasets">
            {(fields, { add, remove }) => (
              <div className="form-list-stack">
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" className="dataset-row">
                    <Form.Item
                      {...field}
                      label={field.name === 0 ? text.datasetSelect : ''}
                      name={[field.name, 'dataset']}
                      tooltip={field.name === 0 ? (locale === 'en' ? 'Multiple datasets can be added. Keep at least one.' : '可添加多个数据集，至少保留一个') : undefined}
                      rules={[{ required: true, message: locale === 'en' ? 'Select a dataset' : '请选择数据集' }]}
                    >
                      <Select placeholder={locale === 'en' ? 'Select a dataset' : '请选择数据集'} options={[
                        { value: '通用问答评测集', label: locale === 'en' ? 'General QA Benchmark' : '通用问答评测集' },
                        { value: '代码能力评测集', label: locale === 'en' ? 'Coding Benchmark' : '代码能力评测集' },
                        { value: '工具调用评测集', label: locale === 'en' ? 'Tool Calling Benchmark' : '工具调用评测集' },
                      ]} />
                    </Form.Item>
                    <Button
                      icon={<DeleteOutlined />}
                      disabled={fields.length === 1}
                      onClick={() => remove(field.name)}
                    />
                  </Space>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ dataset: undefined })}>
                  {text.addDataset}
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item label={text.datasetParams} className="model-form-subsection">
            <Form.Item name="maxSamples" label={text.maxSamples}>
              <SpinnerNumberInput min={1} max={10000} />
            </Form.Item>
            <Button type="link" onClick={() => setDatasetExtraOpen((value) => !value)}>
              {text.otherParams} <DownOutlined rotate={datasetExtraOpen ? 180 : 0} />
            </Button>
            {datasetExtraOpen ? (
              <Form.Item name="datasetExtra">
                <Input.TextArea rows={5} placeholder={locale === 'en' ? 'Enter JSON or other parameters' : '请输入 JSON 或其他参数'} />
              </Form.Item>
            ) : null}
          </Form.Item>

          <FormSection title={text.evalConfig} />
          <Typography.Text strong>{text.modelParams}</Typography.Text>
          <div className="param-grid">
            {[
              ['maxTokens', 'max_tokens', 2048, 1],
              ['topP', 'top_p', 0.8, 0.1],
              ['temperature', 'temperature', 0.7, 0.1],
              ['topK', 'top_k', 40, 1],
            ].map(([name, label, defaultValue, step]) => (
              <Form.Item
                key={name}
                name={name}
                label={<span>{label} <Tooltip title={locale === 'en' ? 'Adjust with steppers or direct input.' : '可通过加减按钮或直接输入调整参数'}><InfoCircleOutlined /></Tooltip></span>}
              >
                <SpinnerNumberInput defaultValue={Number(defaultValue)} step={Number(step)} min={0} />
              </Form.Item>
            ))}
          </div>
          <Form.Item name="stream" label={text.stream} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="link" onClick={() => setModelExtraOpen((value) => !value)}>
            {text.otherParams} <DownOutlined rotate={modelExtraOpen ? 180 : 0} />
          </Button>
          {modelExtraOpen ? (
            <Form.Item name="modelExtra">
              <Input.TextArea rows={5} placeholder={locale === 'en' ? 'Enter extra inference parameters' : '请输入模型推理扩展参数'} />
            </Form.Item>
          ) : null}
          <Form.Item
            name="metrics"
            label={<span>{text.metrics} <Tooltip title={locale === 'en' ? 'Multiple automatic metrics are supported.' : '自动规则指标支持多选'}><InfoCircleOutlined /></Tooltip></span>}
            rules={[{ required: true, message: locale === 'en' ? 'Select metrics' : '请选择评估方法' }]}
          >
            <Checkbox.Group options={[
              { value: '准确率', label: locale === 'en' ? 'Accuracy' : '准确率' },
              { value: 'F1', label: 'F1' },
              { value: 'Rouge-1', label: 'Rouge-1' },
              { value: 'Rouge-2', label: 'Rouge-2' },
              { value: 'Rouge-L', label: 'Rouge-L' },
              { value: 'Bleu-4', label: 'Bleu-4' },
            ] as CheckboxOptionType[]} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={text.deployTitle}
        size={640}
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        footer={(
          <Space>
            <Popconfirm
              title={text.confirmDeleteDraft}
              okText={text.ok}
              cancelText={text.cancel}
              onConfirm={() => message.success(locale === 'en' ? 'Deployment draft deleted' : '部署草稿已删除')}
            >
              <Button danger>{text.deleteDraft}</Button>
            </Popconfirm>
            <Button onClick={() => setDeployOpen(false)}>{text.cancel}</Button>
            <Button type="primary" onClick={() => deployForm.validateFields().then(() => submitFeedback('部署'))}>{text.submitDeploy}</Button>
          </Space>
        )}
      >
        <Form form={deployForm} layout="vertical">
          <FormSection title={text.basicSection} />
          <div className="drawer-form-grid">
            <Form.Item name="serviceName" label={text.serviceName} rules={[{ required: true, message: locale === 'en' ? 'Enter a service name' : '请输入服务名称' }]}>
              <Input placeholder={locale === 'en' ? 'Enter a service name' : '请输入服务名称'} />
            </Form.Item>
            <Form.Item name="cluster" label={text.deployCluster} rules={[{ required: true, message: locale === 'en' ? 'Select a deployment cluster' : '请选择部署集群' }]}>
              <Select options={[
                { value: '上海-推理集群-A', label: locale === 'en' ? 'Shanghai Inference Cluster A' : '上海-推理集群-A' },
                { value: '北京-推理集群-B', label: locale === 'en' ? 'Beijing Inference Cluster B' : '北京-推理集群-B' },
              ]} />
            </Form.Item>
          </div>
          <Form.Item name="note" label={text.description}>
            <Input.TextArea rows={3} placeholder={locale === 'en' ? 'Enter deployment notes' : '请输入部署说明'} />
          </Form.Item>
          <FormSection title={text.resourceConfig} />
          <div className="drawer-form-grid">
            <Form.Item name="gpu" label={text.gpuType} rules={[{ required: true }]}>
              <Select options={[{ value: 'NVIDIA H800' }, { value: 'NVIDIA H20' }, { value: 'Ascend 910B' }]} />
            </Form.Item>
            <Form.Item name="gpuCount" label={text.gpuCount} rules={[{ required: true }]}>
              <SpinnerNumberInput min={1} max={16} />
            </Form.Item>
            <Form.Item name="replicas" label={text.replicas} rules={[{ required: true }]}>
              <SpinnerNumberInput min={1} max={20} />
            </Form.Item>
            <Form.Item name="quota" label={text.quota}>
              <Select options={[{ value: '80GB' }, { value: '160GB' }, { value: '320GB' }]} />
            </Form.Item>
          </div>
          <FormSection title={text.serviceConfig} />
          <Form.Item label={text.route} required>
            <Space.Compact block>
              <Button disabled>POST</Button>
              <Form.Item name="route" noStyle rules={[{ required: true, message: locale === 'en' ? 'Enter a service path' : '请输入服务路径' }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="auth" label={text.auth} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

function FormSection({ title }: { title: string }) {
  return <Typography.Title level={5} className="drawer-form-title">{title}</Typography.Title>;
}
