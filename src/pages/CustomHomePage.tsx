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
  Modal,
  Popconfirm,
  Popover,
  Progress,
  Segmented,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  DragOutlined,
  ExpandOutlined,
  EyeOutlined,
  MinusOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '../components/StatusBadge';

const GRID_COLUMNS = 4;
const GRID_ROW_UNITS = 2;
const DEFAULT_GRID_ROWS = 3;
const MIN_GRID_ROWS = 1;
const MAX_GRID_ROWS = 8;

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
  defaultRowSpan: number;
  preview: PreviewType;
};

type LayoutItem = {
  id: string;
  row: number;
  col: number;
  span: number;
  rowSpan: number;
};

type DragData = {
  widgetId: string;
  source: 'library' | 'canvas';
  span: number;
  rowSpan: number;
};

type DropCandidate = {
  row: number;
  col: number;
  span: number;
  rowSpan: number;
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
  { id: 'health-score', title: '系统健康评分', category: '告警与健康监控', description: '展示系统整体健康分与风险状态', defaultSpan: 1, defaultRowSpan: 1, preview: 'health' },
  { id: 'alert-overview', title: 'GPU 告警概览', category: '告警与健康监控', description: '汇总紧急、警告和提示告警', defaultSpan: 3, defaultRowSpan: 2, preview: 'alert' },
  { id: 'resource-usage', title: '资源使用率趋势', category: '资源用量与配额', description: '查看 GPU、CPU 与内存使用趋势', defaultSpan: 2, defaultRowSpan: 2, preview: 'usage' },
  { id: 'quota-overview', title: '角色配额概览', category: '资源用量与配额', description: '展示当前角色的资源配额与余量', defaultSpan: 1, defaultRowSpan: 1, preview: 'usage' },
  { id: 'resource-pool', title: '资源池状态', category: '资源状态与盘点', description: '查看资源池在线、异常与空闲情况', defaultSpan: 2, defaultRowSpan: 2, preview: 'inventory' },
  { id: 'asset-overview', title: '资产概览', category: '资源状态与盘点', description: '汇总模型、数据集和智能体资产', defaultSpan: 1, defaultRowSpan: 1, preview: 'inventory' },
  { id: 'performance-trend', title: '推理性能趋势', category: '性能趋势与排行', description: '对比吞吐、时延和调用量变化', defaultSpan: 3, defaultRowSpan: 2, preview: 'trend' },
  { id: 'hot-ranking', title: '热门调用排行', category: '性能趋势与排行', description: '展示近期调用量最高的推理服务', defaultSpan: 2, defaultRowSpan: 2, preview: 'ranking' },
  { id: 'quick-entry', title: '快捷入口', category: '个人工作台与入口', description: '集中展示当前角色的常用操作', defaultSpan: 2, defaultRowSpan: 1, preview: 'shortcut' },
  { id: 'my-todo', title: '我的待办', category: '个人工作台与入口', description: '展示审批、任务和异常处理待办', defaultSpan: 1, defaultRowSpan: 1, preview: 'todo' },
  { id: 'process-progress', title: '流程进度', category: '流程与费用', description: '跟踪训练、评估和部署流程', defaultSpan: 2, defaultRowSpan: 2, preview: 'process' },
  { id: 'cost-trend', title: '费用趋势', category: '流程与费用', description: '展示资源费用构成与近期趋势', defaultSpan: 2, defaultRowSpan: 2, preview: 'cost' },
];

const widgetMap = new Map(widgets.map((item) => [item.id, item]));

const defaultLayout: LayoutItem[] = [
  { id: 'health-score', row: 1, col: 1, span: 1, rowSpan: 1 },
  { id: 'alert-overview', row: 1, col: 2, span: 3, rowSpan: 2 },
  { id: 'resource-usage', row: 3, col: 1, span: 2, rowSpan: 2 },
  { id: 'quick-entry', row: 3, col: 3, span: 2, rowSpan: 1 },
  { id: 'asset-overview', row: 2, col: 1, span: 1, rowSpan: 1 },
  { id: 'performance-trend', row: 5, col: 2, span: 3, rowSpan: 2 },
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

function rangesOverlap(startA: number, sizeA: number, startB: number, sizeB: number) {
  return startA < startB + sizeB && startB < startA + sizeA;
}

function canPlace(
  layout: LayoutItem[],
  widgetId: string,
  row: number,
  col: number,
  span: number,
  rowSpan: number,
  rowCount: number,
) {
  const totalRowUnits = rowCount * GRID_ROW_UNITS;
  if (
    row < 1
    || row + rowSpan - 1 > totalRowUnits
    || col < 1
    || col + span - 1 > GRID_COLUMNS
  ) return false;
  return !layout.some((item) => (
    item.id !== widgetId
    && rangesOverlap(row, rowSpan, item.row, item.rowSpan)
    && rangesOverlap(col, span, item.col, item.span)
  ));
}

function parseDropId(id: string): { row: number; col: number } | null {
  const match = /^cell-(\d+)-(\d+)$/.exec(id);
  return match ? { row: Number(match[1]), col: Number(match[2]) } : null;
}

function WidgetPreview({ type, compact = false }: { type: PreviewType; compact?: boolean }) {
  if (compact) {
    if (type === 'health') {
      return (
        <div className="home-widget-preview preview-compact">
          <Typography.Text strong>95%</Typography.Text>
          <StatusBadge status="success" text="运行正常" />
        </div>
      );
    }
    if (type === 'inventory') {
      return (
        <div className="home-widget-preview preview-compact preview-compact-stats">
          <span><b>70</b> 模型</span>
          <span><b>2,000</b> 数据集</span>
          <span><b>18</b> Agent</span>
        </div>
      );
    }
    if (type === 'shortcut') {
      return (
        <div className="home-widget-preview preview-compact preview-compact-tags">
          <Tag color="blue">创建服务</Tag><Tag>上传模型</Tag><Tag>创建数据集</Tag>
        </div>
      );
    }
    if (type === 'todo') {
      return (
        <div className="home-widget-preview preview-compact">
          <Badge count={6} size="small" />
          <Typography.Text>待处理事项</Typography.Text>
        </div>
      );
    }
    return (
      <div className="home-widget-preview preview-compact">
        <Progress percent={68} showInfo={false} size="small" />
      </div>
    );
  }
  if (type === 'health') {
    return (
      <div className="home-widget-preview preview-health">
        <Progress type="dashboard" percent={95} size={64} strokeWidth={10} />
        <StatusBadge status="success" text="运行正常" />
      </div>
    );
  }
  if (type === 'alert') {
    return (
      <div className="home-widget-preview preview-alerts">
        <StatusBadge status="error" text="紧急 2" />
        <StatusBadge status="warning" text="警告 4" />
        <StatusBadge status="processing" text="提示 7" />
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
    data: {
      widgetId: widget.id,
      source: 'library',
      span: widget.defaultSpan,
      rowSpan: widget.defaultRowSpan,
    } satisfies DragData,
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
      </div>
      <Typography.Paragraph ellipsis={{ rows: 2 }}>{widget.description}</Typography.Paragraph>
    </Card>
  );
}

function DropCell({ row, col, candidate, dragging, emptyRow }: { row: number; col: number; candidate: DropCandidate | null; dragging: boolean; emptyRow: boolean }) {
  const { setNodeRef } = useDroppable({ id: `cell-${row}-${col}` });
  const highlighted = Boolean(
    candidate
    && row >= candidate.row
    && row < candidate.row + candidate.rowSpan
    && col >= candidate.col
    && col < candidate.col + candidate.span,
  );
  const className = [
    'homepage-grid-cell',
    emptyRow ? 'is-empty-row' : '',
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
    data: {
      widgetId: item.id,
      source: 'canvas',
      span: item.span,
      rowSpan: item.rowSpan,
    } satisfies DragData,
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
      <Typography.Text type="secondary">组件高度由组件库固定，空间不足的宽度不可选择</Typography.Text>
    </div>
  );

  return (
    <Card
      ref={setNodeRef}
      className={`canvas-widget row-span-${item.rowSpan}${isDragging ? ' is-dragging' : ''}`}
      style={{ gridColumn: `${item.col} / span ${item.span}`, gridRow: `${item.row} / span ${item.rowSpan}` }}
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
      <WidgetPreview type={widget.preview} compact={item.rowSpan === 1} />
    </Card>
  );
}

type CustomHomePageProps = {
  onExit?: () => void;
};

export function CustomHomePage({ onExit }: CustomHomePageProps) {
  const { modal, message } = App.useApp();
  const [layout, setLayout] = useState<LayoutItem[]>(defaultLayout);
  const [rowCount, setRowCount] = useState(DEFAULT_GRID_ROWS);
  const [search, setSearch] = useState('');
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const [candidate, setCandidate] = useState<DropCandidate | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const addedIds = useMemo(() => new Set(layout.map((item) => item.id)), [layout]);
  const occupiedRowUnits = useMemo(() => {
    const units = new Set<number>();
    layout.forEach((item) => {
      for (let row = item.row; row < item.row + item.rowSpan; row += 1) units.add(row);
    });
    return units;
  }, [layout]);
  const lastRowStart = (rowCount - 1) * GRID_ROW_UNITS + 1;
  const lastRowIsEmpty = !layout.some((item) => (
    rangesOverlap(item.row, item.rowSpan, lastRowStart, GRID_ROW_UNITS)
  ));
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
      rowSpan: data.rowSpan,
      valid: canPlace(layout, data.widgetId, cell.row, cell.col, data.span, data.rowSpan, rowCount),
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
        return [...current, {
          id: data.widgetId,
          row: next.row,
          col: next.col,
          span: data.span,
          rowSpan: data.rowSpan,
        }];
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
      if (!item || !canPlace(current, id, item.row, item.col, span, item.rowSpan, rowCount)) return current;
      setDirty(true);
      return current.map((entry) => entry.id === id ? { ...entry, span } : entry);
    });
  };

  const addRow = () => {
    if (rowCount >= MAX_GRID_ROWS) return;
    setRowCount((current) => current + 1);
    setDirty(true);
  };

  const removeLastRow = () => {
    if (rowCount <= MIN_GRID_ROWS || !lastRowIsEmpty) return;
    setRowCount((current) => current - 1);
    setDirty(true);
  };

  const restoreDefault = () => {
    modal.confirm({
      title: '恢复默认首页？',
      content: '当前首页布局将恢复为系统默认配置，本次修改内容将被覆盖。',
      okText: '确认恢复',
      cancelText: '取消',
      onOk: () => {
        setLayout(defaultLayout.map((item) => ({ ...item })));
        setRowCount(DEFAULT_GRID_ROWS);
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
        setRowCount(DEFAULT_GRID_ROWS);
        setDirty(false);
        message.info('已放弃本次修改');
      },
    });
  };

  const confirmCancelAndExit = () => {
    if (!onExit) {
      cancelChanges();
      return;
    }
    modal.confirm({
      title: '取消编辑首页？',
      content: '确认取消后将退出当前编辑页面，并返回首页。',
      okText: '确认取消',
      cancelText: '继续编辑',
      onOk: () => {
        setLayout(defaultLayout.map((item) => ({ ...item })));
        setRowCount(DEFAULT_GRID_ROWS);
        setDirty(false);
        onExit();
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
              <Tooltip title="退出编辑">
                <Button type="text" icon={<ArrowLeftOutlined />} aria-label="退出编辑" onClick={onExit} />
              </Tooltip>
              <Typography.Title level={3}>编辑首页</Typography.Title>
              <Tag color="blue">当前角色：运营管理员</Tag>
              {dirty ? <StatusBadge status="warning" text="有未保存修改" /> : null}
            </Space>
          </div>
          <Space size={8}>
            <Button icon={<ReloadOutlined />} onClick={restoreDefault}>恢复默认</Button>
            <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>预览</Button>
            <Button onClick={confirmCancelAndExit}>取消</Button>
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
              <div
                className={`homepage-grid${activeDrag ? ' is-dragging' : ''}`}
                style={{ gridTemplateRows: `repeat(${rowCount * GRID_ROW_UNITS}, 60px)` }}
              >
                {Array.from({ length: rowCount * GRID_ROW_UNITS }, (_, rowIndex) => (
                  Array.from({ length: GRID_COLUMNS }, (_, colIndex) => (
                    <DropCell
                      key={`${rowIndex + 1}-${colIndex + 1}`}
                      row={rowIndex + 1}
                      col={colIndex + 1}
                      candidate={candidate}
                      dragging={Boolean(activeDrag)}
                      emptyRow={!occupiedRowUnits.has(rowIndex + 1)}
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
                      return Boolean(current && canPlace(
                        layout,
                        id,
                        current.row,
                        current.col,
                        span,
                        current.rowSpan,
                        rowCount,
                      ));
                    }}
                  />
                ))}
              </div>
              <div className="homepage-row-controls">
                <Tooltip title={!lastRowIsEmpty ? '请先移动或删除末行中的组件' : rowCount <= MIN_GRID_ROWS ? '至少保留 1 行' : ''}>
                  <span>
                    <Button
                      icon={<MinusOutlined />}
                      disabled={rowCount <= MIN_GRID_ROWS || !lastRowIsEmpty}
                      onClick={removeLastRow}
                    >
                      删除末行
                    </Button>
                  </span>
                </Tooltip>
                <Typography.Text type="secondary">当前 {rowCount} 行</Typography.Text>
                <Tooltip title={rowCount >= MAX_GRID_ROWS ? '最多支持 8 行' : ''}>
                  <span>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      disabled={rowCount >= MAX_GRID_ROWS}
                      onClick={addRow}
                    >
                      新增一行
                    </Button>
                  </span>
                </Tooltip>
              </div>
            </div>
          </main>
        </div>
        <Modal
          centered
          className="homepage-preview-modal"
          footer={null}
          open={previewOpen}
          title="首页预览"
          width={1080}
          onCancel={() => setPreviewOpen(false)}
        >
          <div className="homepage-preview-modal-canvas" role="img" aria-label="配置后的首页预览图示意">
            <div className="homepage-preview-placeholder">
              配置后的首页预览图示意
            </div>
          </div>
        </Modal>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          <div className="widget-drag-overlay">
            <DragOutlined />
            <span>{widgetMap.get(activeDrag.widgetId)?.title}</span>
            <Tag>{activeDrag.span} 栏 × {activeDrag.rowSpan / GRID_ROW_UNITS} 行</Tag>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
