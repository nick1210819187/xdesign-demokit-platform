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
    options: ['深度求索', '百川智能', '通义千问', 'Meta', 'minimax', '腾讯混元', '智谱AI', '智源研究院', 'Kimi'],
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

const models: ModelItem[] = [
  {
    id: 'longcat',
    name: 'meituan-longcat/LongCat-2.0',
    provider: '美团',
    org: '深度求索',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: 'New',
    description: '面向 Agent 开发场景的高性能语言模型，支持工具调用、多步推理和长上下文任务编排。',
    tags: ['对话', 'Prefix', 'Tools', '1.6T', '1M', 'MoE', '推理模型'],
    updatedAt: '2026-08-25 17:27:23',
    versions: 1,
    logoText: 'M',
    logoTone: 'green',
  },
  {
    id: 'glm52',
    name: 'zai-org/GLM-5.2',
    provider: '智谱AI',
    org: '智谱AI',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: '推荐',
    description: '旗舰通用模型，适合长程任务、代码生成、复杂推理和多轮业务问答。',
    tags: ['对话', 'Tools', '753B', '1M', 'MoE', 'Vibe Coding'],
    updatedAt: '2026-08-25 17:27:23',
    versions: 2,
    logoText: 'Z',
    logoTone: 'dark',
  },
  {
    id: 'kimi-code',
    name: 'moonshotai/Kimi-K2.7-Code',
    provider: 'Kimi',
    org: 'Kimi',
    type: '文本生成',
    context: '64K以上',
    source: '预置',
    scale: '100B以上',
    status: '内测',
    description: '面向代码任务的 agentic 模型，适用于真实研发流程中的理解、生成、修复与重构。',
    tags: ['Tools', '视觉', '1T', '256K', 'Coder', '推理模型'],
    updatedAt: '2026-08-24 11:09:18',
    versions: 1,
    logoText: 'K',
    logoTone: 'dark',
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
    tags: ['对话', 'Tools', '1.6T', '1M', 'MoE', '推理模型'],
    updatedAt: '2026-08-23 09:35:42',
    versions: 3,
    logoText: 'D',
    logoTone: 'blue',
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
    tags: ['视觉', '多模态', '推理模型', 'Tools'],
    updatedAt: '2026-08-22 15:40:08',
    versions: 4,
    logoText: 'B',
    logoTone: 'purple',
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

const sortOptions = [
  { value: 'recommend', label: '综合排序' },
  { value: 'latest', label: '最近最新' },
];

const menuItems: MenuProps['items'] = [
  { key: 'evaluate', label: '评估', icon: <ExperimentOutlined /> },
  { key: 'deploy', label: '部署', icon: <RocketOutlined /> },
];

function getLogoClass(tone: ModelItem['logoTone']) {
  return `model-logo ${tone}`;
}

function getDisplayModelName(name: string) {
  return name.split('/').pop() ?? name;
}

function hasFilter(filters: Record<FilterKey, string[]>) {
  return Object.values(filters).some((value) => value.length > 0);
}

export function ModelGalleryPage() {
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
      const text = `${item.name} ${item.provider} ${item.org} ${item.tags.join(' ')}`.toLowerCase();
      const matchedSearch = !search || text.includes(search.trim().toLowerCase());
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
      taskName: `${model.name.split('/').pop()} 评估任务`,
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
    message.success(`${type}任务已提交`);
    setEvaluateOpen(false);
    setDeployOpen(false);
  };

  const renderFilterPanel = () => (
    <aside className="model-filter-panel">
      <div className="model-filter-head">
        <Typography.Text strong>筛选器</Typography.Text>
        <Button
          type="link"
          size="small"
          disabled={!hasFilter(filters)}
          onClick={() => setFilters(initialFilters)}
        >
          清空
        </Button>
      </div>
      <Collapse
        ghost
        defaultActiveKey={filterGroups.map((group) => group.key)}
        items={filterGroups.map((group) => ({
          key: group.key,
          label: group.label,
          extra: filters[group.key].length ? (
            <Button
              type="link"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                setFilters((current) => ({ ...current, [group.key]: [] }));
              }}
            >
              清除
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
                    {option}
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
          <Empty description="没有找到匹配的模型" />
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
                  <Typography.Text type="secondary" className="model-provider">{model.provider} / {model.org}</Typography.Text>
                </div>
              </div>
              <Typography.Paragraph ellipsis={{ rows: 2 }} className="model-desc">
                {model.description}
              </Typography.Paragraph>
              <div className="model-tag-row">
                {model.tags.map((tag, index) => (
                  <Tag key={tag} color={index === 0 ? 'blue' : undefined}>
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className="model-meta-row">
                <Typography.Text type="secondary">更新时间：{model.updatedAt}</Typography.Text>
                <Typography.Text type="secondary">版本数量：{model.versions}</Typography.Text>
              </div>
              <div className="model-card-hover-actions">
                <Dropdown menu={{ items: menuItems, onClick: handleUseMenu(model) }} trigger={['click']}>
                  <Button
                    onClick={(event) => event.stopPropagation()}
                  >
                    使用此模型 <DownOutlined />
                  </Button>
                </Dropdown>
                <Button
                  type="primary"
                  icon={<ApiOutlined />}
                  onClick={(event) => {
                    event.stopPropagation();
                    message.success(`已进入 ${model.name} 在线体验页`);
                  }}
                >
                  在线体验
                </Button>
              </div>
            </Card>
          );
          if (!statusColor[model.status]) return card;
          return (
            <Badge.Ribbon key={model.id} text={model.status} color={statusColor[model.status]}>
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
          <Typography.Title level={3}>左筛右卡</Typography.Title>
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
                placeholder="按模型名称 / 厂商 / 标签搜索"
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
        title="模型详情"
        size={560}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        footer={(
          <Space>
            <Button onClick={() => setDetailOpen(false)}>关闭</Button>
            <Button onClick={() => activeModel && message.success(`已进入 ${activeModel.name} 在线体验页`)}>在线体验</Button>
            <Button onClick={() => activeModel && openEvaluate(activeModel)}>评估</Button>
            <Button type="primary" onClick={() => activeModel && openDeploy(activeModel)}>部署</Button>
          </Space>
        )}
      >
        {activeModel ? (
          <div className="drawer-section-stack">
            <Descriptions title="基本信息" column={1} size="small" bordered>
              <Descriptions.Item label="模型名称">{activeModel.name}</Descriptions.Item>
              <Descriptions.Item label="厂商">{activeModel.provider}</Descriptions.Item>
              <Descriptions.Item label="模型类型">{activeModel.type}</Descriptions.Item>
              <Descriptions.Item label="参数规模">{activeModel.scale}</Descriptions.Item>
              <Descriptions.Item label="上下文长度">{activeModel.context}</Descriptions.Item>
              <Descriptions.Item label="发布时间">2026-08-25</Descriptions.Item>
              <Descriptions.Item label="版本">{activeModel.versions}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="能力说明" column={1} size="small" bordered>
              <Descriptions.Item label="适用场景">企业问答、代码生成、智能体编排、模型评估。</Descriptions.Item>
              <Descriptions.Item label="核心优势">{activeModel.description}</Descriptions.Item>
              <Descriptions.Item label="限制说明">演示数据仅用于 DemoKit 展示，真实限制以模型服务说明为准。</Descriptions.Item>
            </Descriptions>
            <Descriptions title="技术规格" column={1} size="small" bordered>
              <Descriptions.Item label="输入类型">文本 / 图像</Descriptions.Item>
              <Descriptions.Item label="输出类型">文本 / 结构化 JSON</Descriptions.Item>
              <Descriptions.Item label="支持工具调用">{activeModel.tags.includes('Tools') ? '是' : '否'}</Descriptions.Item>
              <Descriptions.Item label="支持多模态">{activeModel.tags.includes('多模态') || activeModel.tags.includes('视觉') ? '是' : '否'}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="费用 / 资源" column={1} size="small" bordered>
              <Descriptions.Item label="调用成本">0.008 元 / 千 tokens</Descriptions.Item>
              <Descriptions.Item label="推荐部署资源">2 卡 H800 / 160GB 显存</Descriptions.Item>
              <Descriptions.Item label="最小 GPU 要求">1 卡 H20</Descriptions.Item>
            </Descriptions>
            <Descriptions title="使用记录" column={1} size="small" bordered>
              <Descriptions.Item label="最近评估">2026-08-14 14:20:18</Descriptions.Item>
              <Descriptions.Item label="最近部署">2026-08-13 18:42:09</Descriptions.Item>
              <Descriptions.Item label="最近体验">2026-08-14 16:05:33</Descriptions.Item>
            </Descriptions>
          </div>
        ) : null}
      </Drawer>

      <Drawer
        title="发起模型评估"
        size={680}
        open={evaluateOpen}
        onClose={() => setEvaluateOpen(false)}
        footer={(
          <Space>
            <Button onClick={() => setEvaluateOpen(false)}>取消</Button>
            <Button type="primary" onClick={() => evalForm.validateFields().then(() => submitFeedback('评估'))}>提交评估</Button>
          </Space>
        )}
      >
        <Form
          form={evalForm}
          layout="vertical"
          initialValues={{
            taskName: '模型评估任务',
            datasets: [{ dataset: '通用问答评测集' }],
            dataType: 'preset',
            stream: true,
            apiKey: 'default-ak',
            arena: false,
            metrics: ['准确率', 'F1'],
          }}
        >
          <FormSection title="基本信息" />
          <div className="drawer-form-grid">
            <Form.Item name="taskName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
              <Input placeholder="请输入任务名称" />
            </Form.Item>
            <Form.Item name="cluster" label="集群" rules={[{ required: true, message: '请选择集群' }]}>
              <Select placeholder="请选择集群" options={[{ value: '上海-推理集群-A' }, { value: '北京-评测集群-B' }]} />
            </Form.Item>
            <Form.Item name="node" label="节点">
              <Select allowClear placeholder="请选择节点" options={[{ value: 'node-01' }, { value: 'node-02' }]} />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input placeholder="请输入描述" />
            </Form.Item>
          </div>

          <FormSection title="评估对象" />
          <Form.Item
            name="service"
            label="推理服务"
            tooltip="模型评估目前仅支持标准推理和 smart、PD 服务场景的 LLM 模型推理服务"
            rules={[{ required: true, message: '请选择推理服务' }]}
          >
            <Select placeholder="请选择推理服务" options={[{ value: 'standard-chat-service' }, { value: 'smart-pd-service' }]} />
          </Form.Item>
          <div className="drawer-form-grid">
            <Form.Item name="baseModel" label="基础模型">
              <Input disabled />
            </Form.Item>
            <Form.Item name="apiKey" label="API key" rules={[{ required: true, message: '请选择 API key' }]}>
              <Select options={[{ value: 'default-ak', label: '默认 API key' }, { value: 'sandbox-ak', label: '沙箱 API key' }]} />
            </Form.Item>
          </div>
          <Form.Item name="arena" label="竞技场模式" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="dataType"
            label="数据集类型"
            tooltip="选择预置数据集或自定义数据集作为评估样本来源"
            rules={[{ required: true }]}
          >
            <Radio.Group options={[{ value: 'preset', label: '预置数据集' }, { value: 'custom', label: '自定义数据集' }]} />
          </Form.Item>
          <Form.List name="datasets">
            {(fields, { add, remove }) => (
              <div className="form-list-stack">
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" className="dataset-row">
                    <Form.Item
                      {...field}
                      label={field.name === 0 ? '数据集选择' : ''}
                      name={[field.name, 'dataset']}
                      tooltip={field.name === 0 ? '可添加多个数据集，至少保留一个' : undefined}
                      rules={[{ required: true, message: '请选择数据集' }]}
                    >
                      <Select placeholder="请选择数据集" options={[{ value: '通用问答评测集' }, { value: '代码能力评测集' }, { value: '工具调用评测集' }]} />
                    </Form.Item>
                    <Button
                      icon={<DeleteOutlined />}
                      disabled={fields.length === 1}
                      onClick={() => remove(field.name)}
                    />
                  </Space>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ dataset: undefined })}>
                  添加数据集
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item label="数据集参数" className="model-form-subsection">
            <Form.Item name="maxSamples" label="最大评测数据量">
              <SpinnerNumberInput min={1} max={10000} />
            </Form.Item>
            <Button type="link" onClick={() => setDatasetExtraOpen((value) => !value)}>
              其他参数 <DownOutlined rotate={datasetExtraOpen ? 180 : 0} />
            </Button>
            {datasetExtraOpen ? (
              <Form.Item name="datasetExtra">
                <Input.TextArea rows={5} placeholder="请输入 JSON 或其他参数" />
              </Form.Item>
            ) : null}
          </Form.Item>

          <FormSection title="评估参数配置" />
          <Typography.Text strong>模型推理参数</Typography.Text>
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
                label={<span>{label} <Tooltip title="可通过加减按钮或直接输入调整参数"><InfoCircleOutlined /></Tooltip></span>}
              >
                <SpinnerNumberInput defaultValue={Number(defaultValue)} step={Number(step)} min={0} />
              </Form.Item>
            ))}
          </div>
          <Form.Item name="stream" label="流式请求" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="link" onClick={() => setModelExtraOpen((value) => !value)}>
            其他参数 <DownOutlined rotate={modelExtraOpen ? 180 : 0} />
          </Button>
          {modelExtraOpen ? (
            <Form.Item name="modelExtra">
              <Input.TextArea rows={5} placeholder="请输入模型推理扩展参数" />
            </Form.Item>
          ) : null}
          <Form.Item
            name="metrics"
            label={<span>评估方法 <Tooltip title="自动规则指标支持多选"><InfoCircleOutlined /></Tooltip></span>}
            rules={[{ required: true, message: '请选择评估方法' }]}
          >
            <Checkbox.Group options={['准确率', 'F1', 'Rouge-1', 'Rouge-2', 'Rouge-L', 'Bleu-4'] as CheckboxOptionType[]} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="发起模型部署"
        size={640}
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        footer={(
          <Space>
            <Popconfirm
              title="确认删除当前部署草稿？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => message.success('部署草稿已删除')}
            >
              <Button danger>删除草稿</Button>
            </Popconfirm>
            <Button onClick={() => setDeployOpen(false)}>取消</Button>
            <Button type="primary" onClick={() => deployForm.validateFields().then(() => submitFeedback('部署'))}>提交部署</Button>
          </Space>
        )}
      >
        <Form form={deployForm} layout="vertical">
          <FormSection title="基本信息" />
          <div className="drawer-form-grid">
            <Form.Item name="serviceName" label="服务名称" rules={[{ required: true, message: '请输入服务名称' }]}>
              <Input placeholder="请输入服务名称" />
            </Form.Item>
            <Form.Item name="cluster" label="部署集群" rules={[{ required: true, message: '请选择部署集群' }]}>
              <Select options={[{ value: '上海-推理集群-A' }, { value: '北京-推理集群-B' }]} />
            </Form.Item>
          </div>
          <Form.Item name="note" label="描述">
            <Input.TextArea rows={3} placeholder="请输入部署说明" />
          </Form.Item>
          <FormSection title="资源配置" />
          <div className="drawer-form-grid">
            <Form.Item name="gpu" label="GPU 类型" rules={[{ required: true }]}>
              <Select options={[{ value: 'NVIDIA H800' }, { value: 'NVIDIA H20' }, { value: 'Ascend 910B' }]} />
            </Form.Item>
            <Form.Item name="gpuCount" label="GPU 数量" rules={[{ required: true }]}>
              <SpinnerNumberInput min={1} max={16} />
            </Form.Item>
            <Form.Item name="replicas" label="实例数量" rules={[{ required: true }]}>
              <SpinnerNumberInput min={1} max={20} />
            </Form.Item>
            <Form.Item name="quota" label="显存配额">
              <Select options={[{ value: '80GB' }, { value: '160GB' }, { value: '320GB' }]} />
            </Form.Item>
          </div>
          <FormSection title="服务配置" />
          <Form.Item label="服务路径" required>
            <Space.Compact block>
              <Button disabled>POST</Button>
              <Form.Item name="route" noStyle rules={[{ required: true, message: '请输入服务路径' }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="auth" label="启用鉴权" valuePropName="checked">
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
