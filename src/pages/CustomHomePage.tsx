import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Area, Column, Line } from '@ant-design/charts';
import {
  App,
  Badge,
  Button,
  Card,
  Collapse,
  Empty,
  Input,
  Popconfirm,
  Popover,
  Progress,
  Segmented,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  DragOutlined,
  ExpandOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const GRID_COLUMNS = 4;
const GRID_ROWS = 4;

type WidgetCategory =
  | '告警与健康监控'
  | '资源用量与配额'
  | '资源状态与盘点'
  | '性能趋势与排行'
  | '个人工作台与入口'
  | '流程与费用';

type PreviewType = 'health' | 'alert' | 'usage' | 'inventory' | 'trend' | 'ranking' | 'shortcut' | 'todo' | 'process' | 'cost';

type WidgetDefinition = {
  id: string;
  title: string;
  category: WidgetCategory;
  description: string;
  defaultSpan: number;
  preview: PreviewType;
};

type LayoutItem = {
  id: string;
  row: number;
  col: number;
  span: number;
};

type DragData = {
  widgetId: string;
  source: 'library' | 'canvas';
  span: number;
};

type DropCandidate = {
  row: number;
  col: number;
  span: number;
  valid: boolean;
};

const categories: WidgetCategory[] = [
  '告警与健康监控',
  '资源用量与配额',
  '资源状态与盘点',
  '性能趋势与排行',
  '个人工作台与入口',
  '流程与费用',
];

const widgets: WidgetDefinition[] = [
  { id: 'health-score', title: '系统健康评分', category: '告警与健康监控', description: '展示系统整体健康分与风险状态', defaultSpan: 1, preview: 'health' },
  { id: 'alert-overview', title: 'GPU 告警概览', category: '告警与健康监控', description: '汇总紧急、警告和提示告警', defaultSpan: 3, preview: 'alert' },
  { id: 'resource-usage', title: '资源使用率趋势', category: '资源用量与配额', description: '查看 GPU、CPU 与内存使用趋势', defaultSpan: 2, preview: 'usage' },
  { id: 'quota-overview', title: '角色配额概览', category: '资源用量与配额', description: '展示当前角色的资源配额与余量', defaultSpan: 1, preview: 'usage' },
  { id: 'resource-pool', title: '资源池状态', category: '资源状态与盘点', description: '查看资源池在线、异常与空闲情况', defaultSpan: 2, preview: 'inventory' },
  { id: 'asset-overview', title: '资产概览', category: '资源状态与盘点', description: '汇总模型、数据集和智能体资产', defaultSpan: 1, preview: 'inventory' },
  { id: 'performance-trend', title: '推理性能趋势', category: '性能趋势与排行', description: '对比吞吐、时延和调用量变化', defaultSpan: 3, preview: 'trend' },
  { id: 'hot-ranking', title: '热门调用排行', category: '性能趋势与排行', description: '展示近期调用量最高的推理服务', defaultSpan: 2, preview: 'ranking' },
  { id: 'quick-entry', title: '快捷入口', category: '个人工作台与入口', description: '集中展示当前角色的常用操作', defaultSpan: 2, preview: 'shortcut' },
  { id: 'my-todo', title: '我的待办', category: '个人工作台与入口', description: '展示审批、任务和异常处理待办', defaultSpan: 1, preview: 'todo' },
  { id: 'process-progress', title: '流程进度', category: '流程与费用', description: '跟踪训练、评估和部署流程', defaultSpan: 2, preview: 'process' },
  { id: 'cost-trend', title: '费用趋势', category: '流程与费用', description: '展示资源费用构成与近期趋势', defaultSpan: 2, preview: 'cost' },
];

const widgetMap = new Map(widgets.map((item) => [item.id, item]));

const defaultLayout: LayoutItem[] = [
  { id: 'health-score', row: 1, col: 1, span: 1 },
  { id: 'alert-overview', row: 1, col: 2, span: 3 },
  { id: 'resource-usage', row: 2, col: 1, span: 2 },
  { id: 'quick-entry', row: 2, col: 3, span: 2 },
  { id: 'asset-overview', row: 3, col: 1, span: 1 },
  { id: 'performance-trend', row: 3, col: 2, span: 3 },
];

const miniTrendData = [
  { time: '00:00', value: 38 },
  { time: '04:00', value: 52 },
  { time: '08:00', value: 47 },
  { time: '12:00', value: 68 },
  { time: '16:00', value: 61 },
  { time: '20:00', value: 82 },
  { time: '24:00', value: 74 },
];

const miniCostData = [
  { time: '周一', value: 42 },
  { time: '周二', value: 56 },
  { time: '周三', value: 48 },
  { time: '周四', value: 72 },
  { time: '周五', value: 63 },
  { time: '周六', value: 81 },
  { time: '周日', value: 69 },
];

function rangesOverlap(colA: number, spanA: number, colB: number, spanB: number) {
  return colA < colB + spanB && colB < colA + spanA;
}

function canPlace(layout: LayoutItem[], widgetId: string, row: number, col: number, span: number) {
  if (row < 1 || row > GRID_ROWS || col < 1 || col + span - 1 > GRID_COLUMNS) return false;
  return !layout.some((item) => item.id !== widgetId && item.row === row && rangesOverlap(col, span, item.col, item.span));
}

function parseDropId(id: string): { row: number; col: number } | null {
  const match = /^cell-(\d+)-(\d+)$/.exec(id);
  return match ? { row: Number(match[1]), col: Number(match[2]) } : null;
}

function WidgetPreview({ type }: { type: PreviewType }) {
  if (type === 'health') {
    return (
      <div className="home-widget-preview preview-health">
        <Progress type="dashboard" percent={95} size={64} strokeWidth={10} />
        <Badge status="success" text="运行正常" />
      </div>
    );
  }
  if (type === 'alert') {
    return (
      <div className="home-widget-preview preview-alerts">
        <Badge status="error" text="紧急 2" />
        <Badge status="warning" text="警告 4" />
        <Badge status="processing" text="提示 7" />
      </div>
    );
  }
  if (type === 'usage') {
    return (
      <div className="home-widget-preview preview-chart" aria-hidden="true">
        <Area
          data={miniTrendData}
          xField="time"
          yField="value"
          axis={false}
          tooltip={false}
          style={{ fill: '#124DEE', fillOpacity: 0.12, stroke: '#124DEE', lineWidth: 2 }}
        />
      </div>
    );
  }
  if (type === 'trend') {
    return (
      <div className="home-widget-preview preview-chart" aria-hidden="true">
        <Line
          data={miniTrendData}
          xField="time"
          yField="value"
          axis={false}
          tooltip={false}
          style={{ stroke: '#124DEE', lineWidth: 2 }}
        />
      </div>
    );
  }
  if (type === 'cost') {
    return (
      <div className="home-widget-preview preview-chart" aria-hidden="true">
        <Column
          data={miniCostData}
          xField="time"
          yField="value"
          axis={false}
          tooltip={false}
          color="#124DEE"
          style={{ radiusTopLeft: 2, radiusTopRight: 2 }}
        />
      </div>
    );
  }
  if (type === 'inventory') {
    return (
      <div className="home-widget-preview preview-statistics">
        <Statistic title="模型" value={70} />
        <Statistic title="数据集" value={2000} />
        <Statistic title="Agent" value={18} />
      </div>
    );
  }
  if (type === 'ranking') {
    return (
      <div className="home-widget-preview preview-ranking">
        <span><b>1</b> DeepSeek-V4 <em>200</em></span>
        <span><b>2</b> Qwen3-32B <em>128</em></span>
        <span><b>3</b> GLM-5.2 <em>96</em></span>
      </div>
    );
  }
  if (type === 'shortcut') {
    return (
      <div className="home-widget-preview preview-shortcuts">
        <Tag color="blue">创建服务</Tag><Tag>上传模型</Tag><Tag>创建数据集</Tag><Tag>发起评估</Tag>
      </div>
    );
  }
  if (type === 'todo') {
    return <div className="home-widget-preview preview-todo"><Badge count={6}><AppstoreAddOutlined /></Badge><span>待处理事项</span></div>;
  }
  return (
    <div className="home-widget-preview preview-process">
      <Progress percent={68} showInfo={false} />
      <span>{type === 'process' ? '部署任务进行中' : '本月资源费用'}</span>
    </div>
  );
}

function LibraryCard({ widget, added }: { widget: WidgetDefinition; added: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${widget.id}`,
    disabled: added,
    data: { widgetId: widget.id, source: 'library', span: widget.defaultSpan } satisfies DragData,
  });

  return (
    <Card
      ref={setNodeRef}
      size="small"
      className={`component-library-card${added ? ' is-added' : ''}${isDragging ? ' is-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="component-library-card-head">
        <Typography.Text strong>{widget.title}</Typography.Text>
        {added ? <Tag icon={<CheckCircleFilled />}>已添加</Tag> : <Tag>{widget.defaultSpan} 栏</Tag>}
      </div>
      <Typography.Paragraph ellipsis={{ rows: 2 }}>{widget.description}</Typography.Paragraph>
      <div className={`component-size-sketch span-${widget.defaultSpan}`} aria-hidden="true">
        {Array.from({ length: widget.defaultSpan }, (_, index) => <i key={index} />)}
      </div>
    </Card>
  );
}

function DropCell({ row, col, candidate, dragging }: { row: number; col: number; candidate: DropCandidate | null; dragging: boolean }) {
  const { setNodeRef } = useDroppable({ id: `cell-${row}-${col}` });
  const highlighted = Boolean(candidate && candidate.row === row && col >= candidate.col && col < candidate.col + candidate.span);
  const className = [
    'homepage-grid-cell',
    dragging ? 'is-active' : '',
    highlighted ? (candidate?.valid ? 'is-valid' : 'is-invalid') : '',
  ].filter(Boolean).join(' ');
  return <div ref={setNodeRef} className={className} style={{ gridColumn: col, gridRow: row }} />;
}

function CanvasWidget({
  item,
  onDelete,
  onResize,
  canResize,
}: {
  item: LayoutItem;
  onDelete: (id: string) => void;
  onResize: (id: string, span: number) => void;
  canResize: (id: string, span: number) => boolean;
}) {
  const widget = widgetMap.get(item.id)!;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `canvas-${item.id}`,
    data: { widgetId: item.id, source: 'canvas', span: item.span } satisfies DragData,
  });
  const widthOptions = [1, 2, 3, 4].map((span) => ({
    label: `${span} 栏`,
    value: span,
  }));

  const editContent = (
    <div className="widget-width-editor" onPointerDown={(event) => event.stopPropagation()}>
      <Typography.Text strong>组件宽度</Typography.Text>
      <Segmented
        block
        options={widthOptions.map((option) => ({
          ...option,
          disabled: !canResize(item.id, option.value),
        }))}
        value={item.span}
        onChange={(value) => onResize(item.id, Number(value))}
      />
      <Typography.Text type="secondary">空间不足的宽度不可选择</Typography.Text>
    </div>
  );

  return (
    <Card
      ref={setNodeRef}
      className={`canvas-widget${isDragging ? ' is-dragging' : ''}`}
      style={{ gridColumn: `${item.col} / span ${item.span}`, gridRow: item.row }}
      {...attributes}
      {...listeners}
    >
      <div className="canvas-widget-head">
        <Space size={6}>
          <DragOutlined className="canvas-widget-drag" />
          <Typography.Text strong>{widget.title}</Typography.Text>
        </Space>
        <div className="canvas-widget-actions" onPointerDown={(event) => event.stopPropagation()}>
          <Popover trigger="click" placement="bottomRight" content={editContent}>
            <Button type="text" size="small" icon={<ExpandOutlined />}>调整</Button>
          </Popover>
          <Popconfirm
            title="删除组件？"
            description="删除后可在组件库中重新添加"
            placement="bottomRight"
            okText="确认"
            cancelText="取消"
            onConfirm={() => onDelete(item.id)}
          >
            <Button type="text" size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </div>
      </div>
      <WidgetPreview type={widget.preview} />
    </Card>
  );
}

export function CustomHomePage() {
  const { modal, message } = App.useApp();
  const [layout, setLayout] = useState<LayoutItem[]>(defaultLayout);
  const [search, setSearch] = useState('');
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const [candidate, setCandidate] = useState<DropCandidate | null>(null);
  const [dirty, setDirty] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const addedIds = useMemo(() => new Set(layout.map((item) => item.id)), [layout]);
  const filteredWidgets = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return keyword ? widgets.filter((item) => `${item.title}${item.description}${item.category}`.toLowerCase().includes(keyword)) : widgets;
  }, [search]);

  const updateCandidate = (event: DragOverEvent | DragEndEvent) => {
    const overId = event.over?.id ? String(event.over.id) : '';
    const cell = parseDropId(overId);
    const data = event.active.data.current as DragData | undefined;
    if (!cell || !data) {
      setCandidate(null);
      return null;
    }
    const next = {
      row: cell.row,
      col: cell.col,
      span: data.span,
      valid: canPlace(layout, data.widgetId, cell.row, cell.col, data.span),
    };
    setCandidate(next);
    return next;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDrag(event.active.data.current as DragData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const next = updateCandidate(event);
    const data = event.active.data.current as DragData | undefined;
    if (next?.valid && data) {
      setLayout((current) => {
        const existing = current.find((item) => item.id === data.widgetId);
        if (existing) {
          return current.map((item) => item.id === data.widgetId ? { ...item, row: next.row, col: next.col } : item);
        }
        return [...current, { id: data.widgetId, row: next.row, col: next.col, span: data.span }];
      });
      setDirty(true);
    }
    setActiveDrag(null);
    setCandidate(null);
  };

  const handleDelete = (id: string) => {
    setLayout((current) => current.filter((item) => item.id !== id));
    setDirty(true);
  };

  const handleResize = (id: string, span: number) => {
    setLayout((current) => {
      const item = current.find((entry) => entry.id === id);
      if (!item || !canPlace(current, id, item.row, item.col, span)) return current;
      setDirty(true);
      return current.map((entry) => entry.id === id ? { ...entry, span } : entry);
    });
  };

  const restoreDefault = () => {
    modal.confirm({
      title: '恢复默认首页？',
      content: '当前首页布局将恢复为系统默认配置，本次修改内容将被覆盖。',
      okText: '确认恢复',
      cancelText: '取消',
      onOk: () => {
        setLayout(defaultLayout.map((item) => ({ ...item })));
        setDirty(true);
        message.success('已恢复默认布局，点击保存后生效');
      },
    });
  };

  const cancelChanges = () => {
    if (!dirty) {
      message.info('当前没有未保存的修改');
      return;
    }
    modal.confirm({
      title: '当前修改尚未保存',
      content: '离开后本次修改将不会保留。',
      okText: '放弃修改',
      cancelText: '继续编辑',
      onOk: () => {
        setLayout(defaultLayout.map((item) => ({ ...item })));
        setDirty(false);
        message.info('已放弃本次修改');
      },
    });
  };

  const saveLayout = () => {
    setDirty(false);
    message.success('首页配置已保存');
  };

  const collapseItems = categories.map((category) => {
    const categoryWidgets = filteredWidgets.filter((item) => item.category === category);
    return {
      key: category,
      label: <Space size={6}><span>{category}</span><Typography.Text type="secondary">{categoryWidgets.length}</Typography.Text></Space>,
      children: categoryWidgets.length ? (
        <div className="component-library-list">
          {categoryWidgets.map((widget) => <LibraryCard key={widget.id} widget={widget} added={addedIds.has(widget.id)} />)}
        </div>
      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无匹配组件" />,
    };
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={updateCandidate}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { setActiveDrag(null); setCandidate(null); }}
    >
      <div className="workspace-page custom-home-page">
        <header className="custom-home-heading">
          <div>
            <Space size={10} align="center">
              <Button type="text" icon={<ArrowLeftOutlined />} aria-label="返回" />
              <Typography.Title level={3}>编辑首页</Typography.Title>
              <Tag color="blue">当前角色：运营管理员</Tag>
              {dirty ? <Badge status="warning" text="有未保存修改" /> : null}
            </Space>
          </div>
          <Space size={8}>
            <Button icon={<ReloadOutlined />} onClick={restoreDefault}>恢复默认</Button>
            <Button onClick={cancelChanges}>取消</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={saveLayout}>保存</Button>
          </Space>
        </header>

        <div className="custom-home-editor">
          <aside className="component-library-panel">
            <div className="component-library-panel-head">
              <div>
                <Typography.Title level={5}>组件库</Typography.Title>
                <Typography.Text type="secondary">拖动组件到右侧空闲位置</Typography.Text>
              </div>
              <Tag>{layout.length}/{widgets.length}</Tag>
            </div>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="搜索组件"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Collapse ghost size="small" defaultActiveKey={categories} items={collapseItems} />
          </aside>

          <main className="homepage-canvas-panel">
            <div className="homepage-canvas-toolbar">
              <Typography.Title level={5}>首页编辑画布</Typography.Title>
            </div>

            <div className="homepage-preview-shell">
              <div className={`homepage-grid${activeDrag ? ' is-dragging' : ''}`}>
                {Array.from({ length: GRID_ROWS }, (_, rowIndex) => (
                  Array.from({ length: GRID_COLUMNS }, (_, colIndex) => (
                    <DropCell
                      key={`${rowIndex + 1}-${colIndex + 1}`}
                      row={rowIndex + 1}
                      col={colIndex + 1}
                      candidate={candidate}
                      dragging={Boolean(activeDrag)}
                    />
                  ))
                ))}
                {layout.map((item) => (
                  <CanvasWidget
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onResize={handleResize}
                    canResize={(id, span) => {
                      const current = layout.find((entry) => entry.id === id);
                      return Boolean(current && canPlace(layout, id, current.row, current.col, span));
                    }}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          <div className="widget-drag-overlay">
            <DragOutlined />
            <span>{widgetMap.get(activeDrag.widgetId)?.title}</span>
            <Tag>{activeDrag.span} 栏</Tag>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
