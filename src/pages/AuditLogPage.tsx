import { useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, Key, MouseEvent as ReactMouseEvent } from 'react';
import {
  App as AntdApp,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Descriptions,
  Dropdown,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Tabs,
  Tooltip,
  Typography,
  Popover,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { CheckboxOptionType } from 'antd/es/checkbox/Group';
import type { MenuProps, TabsProps } from 'antd';
import type { Dayjs } from 'dayjs';
import {
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  UpOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { auditLogs, type AuditLog } from '../data/auditLogs';

const { RangePicker } = DatePicker;

const tableMeasureSelectors = {
  toolbar: '.table-toolbar',
  table: '.audit-table',
  header: '.audit-table .ant-table-header, .audit-table .ant-table-thead',
  pagination: '.audit-table .ant-pagination',
};

const defaultColumnWidths = {
  logType: 112,
  operationName: 150,
  operationType: 124,
  target: 210,
  user: 170,
  ip: 146,
  result: 120,
  time: 172,
  detail: 320,
  action: 88,
} satisfies Record<string, number>;

type ColumnWidthKey = keyof typeof defaultColumnWidths;

type ResizableHeaderCellProps = HTMLAttributes<HTMLTableCellElement> & {
  width?: number;
  minWidth?: number;
  onResizeColumn?: (width: number) => void;
};

type QueryValues = {
  logType?: '全部' | AuditLog['logType'];
  result?: '全部' | AuditLog['result'];
  time?: [Dayjs, Dayjs];
  operationType?: AuditLog['operationType'];
  target?: string;
  user?: string;
  ip?: string;
  detail?: string;
};

type ExpandedDataType = {
  key: string;
  date: string;
  name: string;
  upgradeNum: string;
};

type ComplexTableRow = {
  key: string;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
};

const operationTypeOptions = Array.from(new Set(auditLogs.map((item) => item.operationType))).map((value) => ({
  label: value,
  value,
}));

const logTypeOptions = ['全部', '操作日志', '安全日志'].map((value) => ({ label: value, value }));
const resultOptions = ['全部', '成功', '失败', '进行中'].map((value) => ({ label: value, value }));

const moreActionItems: MenuProps['items'] = [
  { key: 'pause', label: '暂停任务' },
  { key: 'stop', label: '停止任务' },
  { key: 'copy', label: '复制配置' },
  { key: 'archive', label: '归档记录' },
];

const tabItems: TabsProps['items'] = [
  { key: 'all', label: '全部', children: null },
  { key: 'running', label: '运行中', children: null },
  { key: 'finished', label: '已完成', children: null },
];

const expandDataSource: ExpandedDataType[] = Array.from({ length: 3 }).map((_, index) => ({
  key: String(index),
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));

const complexTableRows: ComplexTableRow[] = Array.from({ length: 36 }).map((_, index) => ({
  key: String(index),
  name: index % 3 === 0 ? 'Screen' : index % 3 === 1 ? 'FusionOne Agent' : 'Console Service',
  platform: index % 2 === 0 ? 'iOS' : 'Web',
  version: `10.${index % 8}.${index + 3}.5654`,
  upgradeNum: 500 + index * 8,
  creator: index % 2 === 0 ? 'Jack' : 'Administrator',
  createdAt: '2014-12-24 23:12:00',
}));

const columnSettingOptions: CheckboxOptionType<string>[] = [
  { label: '日志类型', value: 'logType' },
  { label: '操作名称', value: 'operationName' },
  { label: '操作类型', value: 'operationType' },
  { label: '操作对象', value: 'target' },
  { label: '操作用户', value: 'user' },
  { label: '操作用户IP', value: 'ip' },
  { label: '操作结果', value: 'result' },
  { label: '发生时间', value: 'time' },
  { label: '详情', value: 'detail' },
  { label: '操作', value: 'action' },
];

const defaultVisibleColumns = columnSettingOptions.map((item) => String(item.value));

function includesText(source: string, query?: string) {
  if (!query?.trim()) return true;
  return source.toLowerCase().includes(query.trim().toLowerCase());
}

function resultBadge(value: AuditLog['result']) {
  const status = value === '成功' ? 'success' : value === '失败' ? 'error' : 'processing';
  return <Badge status={status} text={value} />;
}

function TwoLineCell({ children, mono = false }: { children: string; mono?: boolean }) {
  return (
    <Tooltip title={children} mouseEnterDelay={0.4}>
      <Typography.Text className={`two-line-cell ${mono ? 'mono' : ''}`}>
        {children}
      </Typography.Text>
    </Tooltip>
  );
}

function SingleLineCell({ children, mono = false }: { children: string; mono?: boolean }) {
  return (
    <Tooltip title={children} mouseEnterDelay={0.4}>
      <Typography.Text className={`single-line-cell ${mono ? 'mono' : ''}`}>
        {children}
      </Typography.Text>
    </Tooltip>
  );
}

function OperationNameCell({ value, row }: { value: string; row: AuditLog }) {
  if (row.rowExample === 'double') {
    return (
      <Tooltip title="双行内容由真实文字自然撑开，不固定行高" mouseEnterDelay={0.4}>
        <span className="table-cell-stack">
          <span>{value}</span>
          <Typography.Text type="secondary">第二行辅助信息</Typography.Text>
        </span>
      </Tooltip>
    );
  }

  if (row.rowExample === 'single') {
    return <SingleLineCell>{value}</SingleLineCell>;
  }

  return <TwoLineCell>{value}</TwoLineCell>;
}

function ResizableHeaderCell({
  width,
  minWidth = 88,
  onResizeColumn,
  children,
  className,
  ...restProps
}: ResizableHeaderCellProps) {
  const dragState = useRef({ startX: 0, startWidth: 0 });

  const handleMouseDown = (event: ReactMouseEvent<HTMLSpanElement>) => {
    if (!onResizeColumn) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current = {
      startX: event.clientX,
      startWidth: width || event.currentTarget.parentElement?.getBoundingClientRect().width || minWidth,
    };

    document.body.classList.add('is-resizing-table-column');

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.max(
        minWidth,
        Math.round(dragState.current.startWidth + moveEvent.clientX - dragState.current.startX),
      );
      onResizeColumn(nextWidth);
    };

    const handleMouseUp = () => {
      document.body.classList.remove('is-resizing-table-column');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <th {...restProps} className={`${className || ''} resizable-table-cell`} style={{ ...restProps.style, width }}>
      {children}
      {onResizeColumn ? (
        <span
          aria-hidden
          className="column-resize-handle"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={handleMouseDown}
        />
      ) : null}
    </th>
  );
}

type AuditLogPageProps = {
  title?: string;
  showRetention?: boolean;
  tableMode?: 'standard' | 'complex';
  queryMode?: 'simple' | 'full';
};

export function AuditLogPage({
  title = '审计日志',
  showRetention = true,
  tableMode = 'standard',
  queryMode = 'full',
}: AuditLogPageProps = {}) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<QueryValues>();
  const [query, setQuery] = useState<QueryValues>({ logType: '全部', result: '全部' });
  const [expanded, setExpanded] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns);
  const [columnWidths, setColumnWidths] = useState<Record<ColumnWidthKey, number>>(defaultColumnWidths);
  const [tableScrollY, setTableScrollY] = useState(275);
  const tableSurfaceRef = useRef<HTMLElement | null>(null);
  const isComplexTable = tableMode === 'complex';
  const isSimpleQuery = queryMode === 'simple';
  const hasSelectedRows = selectedRowKeys.length > 0;

  const guardSelection = (action: string) => {
    if (!hasSelectedRows) {
      message.warning('请先选择列表中的某一项，再点击按钮');
      return;
    }
    message.success(`${action}已应用到 ${selectedRowKeys.length} 项`);
  };

  const filteredRows = useMemo(() => {
    return auditLogs.filter((row) => {
      const time = dayjs(row.time, 'YYYY-MM-DD HH:mm:ss');
      const start = query.time?.[0]?.startOf('day');
      const end = query.time?.[1]?.endOf('day');
      const keyword = tableSearch.trim().toLowerCase();
      const matchToolbarSearch = !keyword || [
        row.logType,
        row.operationName,
        row.operationType,
        row.target,
        row.user,
        row.ip,
        row.result,
        row.time,
        row.detail,
      ].some((value) => value.toLowerCase().includes(keyword));
      return (
        (!query.logType || query.logType === '全部' || row.logType === query.logType) &&
        (!query.result || query.result === '全部' || row.result === query.result) &&
        (!query.operationType || row.operationType === query.operationType) &&
        includesText(row.target, query.target) &&
        includesText(row.user, query.user) &&
        includesText(row.ip, query.ip) &&
        includesText(row.detail, query.detail) &&
        matchToolbarSearch &&
        (!start || time.isAfter(start) || time.isSame(start)) &&
        (!end || time.isBefore(end) || time.isSame(end))
      );
    });
  }, [query, tableSearch]);

  const complexRows = useMemo(() => {
    const keyword = tableSearch.trim().toLowerCase();
    return complexTableRows.filter((row) => {
      const matchKeyword = !keyword || [row.name, row.platform, row.version, row.creator, row.createdAt]
        .some((value) => value.toLowerCase().includes(keyword));
      if (activeTab === 'running') return matchKeyword && Number(row.key) % 3 === 1;
      if (activeTab === 'finished') return matchKeyword && Number(row.key) % 3 !== 1;
      return matchKeyword;
    });
  }, [activeTab, tableSearch]);

  useEffect(() => {
    const surface = tableSurfaceRef.current;
    if (!surface) return;

    const getOuterHeight = (selector: string) => {
      const element = surface.querySelector<HTMLElement>(selector);
      if (!element) return 0;
      const styles = getComputedStyle(element);
      return (
        element.getBoundingClientRect().height +
        (Number.parseFloat(styles.marginTop) || 0) +
        (Number.parseFloat(styles.marginBottom) || 0)
      );
    };

    const measure = () => {
      const tableElement = surface.querySelector<HTMLElement>(tableMeasureSelectors.table);
      const toolbarHeight = getOuterHeight(tableMeasureSelectors.toolbar);
      const tableMargin = getOuterHeight(tableMeasureSelectors.table) - (tableElement?.getBoundingClientRect().height || 0);
      const headerHeight = getOuterHeight(tableMeasureSelectors.header);
      const paginationHeight = getOuterHeight(tableMeasureSelectors.pagination);
      const nextScrollY = Math.max(
        180,
        Math.floor(surface.clientHeight - toolbarHeight - tableMargin - headerHeight - paginationHeight),
      );
      setTableScrollY(nextScrollY);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(surface);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [filteredRows.length, visibleColumns.length]);

  const allColumns: ColumnsType<AuditLog> = [
    {
      title: '日志类型',
      key: 'logType',
      dataIndex: 'logType',
      width: columnWidths.logType,
      fixed: 'start',
      filters: [
        { text: '安全日志', value: '安全日志' },
        { text: '操作日志', value: '操作日志' },
      ],
      onFilter: (value, record) => record.logType === value,
      render: (value: AuditLog['logType']) => <Tag color={value === '安全日志' ? 'blue' : 'default'}>{value}</Tag>,
    },
    {
      title: '操作名称',
      key: 'operationName',
      dataIndex: 'operationName',
      width: columnWidths.operationName,
      sorter: (a, b) => a.operationName.localeCompare(b.operationName),
      fixed: 'start',
      render: (value: string, row) => <OperationNameCell value={value} row={row} />,
    },
    {
      title: '操作类型',
      key: 'operationType',
      dataIndex: 'operationType',
      width: columnWidths.operationType,
      render: (value: string) => <TwoLineCell>{value}</TwoLineCell>,
    },
    {
      title: '操作对象',
      key: 'target',
      dataIndex: 'target',
      width: columnWidths.target,
      render: (value: string, row) => (
        <span className="target-cell">
          <TwoLineCell>{value}</TwoLineCell>
          {row.targetMore ? <Button type="link" size="small" onClick={() => setSelectedLog(row)}>更多</Button> : null}
        </span>
      ),
    },
    {
      title: '操作用户',
      key: 'user',
      dataIndex: 'user',
      width: columnWidths.user,
      sorter: (a, b) => a.user.localeCompare(b.user),
      render: (value: string) => value === '-' ? <Typography.Text type="secondary">-</Typography.Text> : <TwoLineCell>{value}</TwoLineCell>,
    },
    {
      title: '操作用户IP',
      key: 'ip',
      dataIndex: 'ip',
      width: columnWidths.ip,
      render: (value: string) => <TwoLineCell mono>{value}</TwoLineCell>,
    },
    {
      title: '操作结果',
      key: 'result',
      dataIndex: 'result',
      width: columnWidths.result,
      sorter: (a, b) => a.result.localeCompare(b.result),
      render: resultBadge,
    },
    {
      title: '发生时间',
      key: 'time',
      dataIndex: 'time',
      width: columnWidths.time,
      sorter: (a, b) => a.time.localeCompare(b.time),
      render: (value: string) => <SingleLineCell mono>{value}</SingleLineCell>,
    },
    {
      title: '详情',
      key: 'detail',
      dataIndex: 'detail',
      width: columnWidths.detail,
      render: (value: string) => <TwoLineCell>{value}</TwoLineCell>,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'end',
      width: columnWidths.action,
      render: (_, row) => <Button type="link" size="small" onClick={() => setSelectedLog(row)}>详情</Button>,
    },
  ];

  const columns = allColumns
    .filter((column) => visibleColumns.includes(String(column.key || column.dataIndex)))
    .map((column) => {
      const key = String(column.key || column.dataIndex) as ColumnWidthKey;
      const minWidth = key === 'action' ? 72 : 96;
      return {
        ...column,
        onHeaderCell: () => ({
          width: columnWidths[key],
          minWidth,
          onResizeColumn: (width: number) => setColumnWidths((current) => ({ ...current, [key]: width })),
        }),
      };
    });
  const tableScrollX = columns.reduce((total, column) => total + Number(column.width || 120), 48);

  const expandColumns: ColumnsType<ExpandedDataType> = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      key: 'state',
      render: () => <Badge status="success" text="Finished" />,
    },
    { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    {
      title: 'Action',
      key: 'operation',
      render: () => (
        <Space size="middle">
          <Typography.Link>Pause</Typography.Link>
          <Typography.Link>Stop</Typography.Link>
          <Dropdown menu={{ items: moreActionItems }} trigger={['hover']}>
            <Typography.Link>
              <Space size={2}>
                More
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const expandedRowRender = () => (
    <Table<ExpandedDataType>
      className="nested-inner-table"
      columns={expandColumns}
      dataSource={expandDataSource}
      pagination={false}
      size="small"
      rowKey="key"
    />
  );

  const complexColumns: ColumnsType<ComplexTableRow> = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (value: string) => <TwoLineCell>{value}</TwoLineCell> },
    { title: 'Platform', dataIndex: 'platform', key: 'platform' },
    { title: 'Version', dataIndex: 'version', key: 'version', render: (value: string) => <TwoLineCell mono>{value}</TwoLineCell> },
    { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (value: string) => <SingleLineCell mono>{value}</SingleLineCell> },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'end',
      width: 190,
      render: () => (
        <Space size="small" className="row-action-group">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">删除</Button>
          <Dropdown
            menu={{
              items: moreActionItems,
              selectable: true,
              defaultSelectedKeys: ['copy'],
            }}
            trigger={['hover']}
          >
            <Typography.Link className="more-action-link">
              <Space size={2}>
                更多
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const reset = () => {
    form.resetFields();
    form.setFieldsValue({ logType: '全部', result: '全部' });
    setQuery({ logType: '全部', result: '全部' });
  };

  return (
    <div className="audit-page page-stack">
      <div className="page-heading">
        <div>
          <Typography.Title level={3}>{title}</Typography.Title>
        </div>
        {showRetention ? (
          <Space className="retention-control">
            <Typography.Text>保存周期：</Typography.Text>
            <Typography.Text strong>30 天</Typography.Text>
            <Tooltip title="编辑保存周期"><Button type="text" icon={<EditOutlined />} /></Tooltip>
          </Space>
        ) : null}
      </div>

      {isComplexTable ? (
        <Tabs
          className="page-mode-tabs"
          activeKey={activeTab}
          items={tabItems}
          onChange={(key) => {
            setActiveTab(key);
            setSelectedRowKeys([]);
          }}
        />
      ) : null}

      <section className="surface query-surface">
        <Form<QueryValues>
          form={form}
          layout="vertical"
          initialValues={{ logType: '全部', result: '全部' }}
          onFinish={(values) => setQuery(values)}
        >
          <div className="audit-query-grid">
            <Form.Item className="query-field" label="日志类型" name="logType">
              <Select options={logTypeOptions} />
            </Form.Item>
            <Form.Item className="query-field query-field-range" label="时间筛选" name="time">
              <RangePicker
                allowClear
                format="YYYY-MM-DD"
                presets={[
                  { label: '今天', value: [dayjs(), dayjs()] },
                  { label: '最近 7 天', value: [dayjs().subtract(7, 'day'), dayjs()] },
                  { label: '本月', value: [dayjs().startOf('month'), dayjs()] },
                ]}
              />
            </Form.Item>
            <Form.Item className="query-field" label="操作用户" name="user">
              <Input allowClear placeholder="请输入操作用户" />
            </Form.Item>
            {!isSimpleQuery ? (
              <>
                <Form.Item className="query-field" label="操作结果" name="result">
                  <Select options={resultOptions} />
                </Form.Item>
                <Form.Item className="query-field" label="操作用户IP" name="ip">
                  <Input allowClear placeholder="请输入操作用户IP" />
                </Form.Item>
                <Form.Item className="query-field" label="操作类型" name="operationType">
                  <Select allowClear placeholder="请选择操作类型" options={operationTypeOptions} />
                </Form.Item>
                <Form.Item className="query-field" label="操作对象" name="target">
                  <Input allowClear placeholder="请输入操作对象" />
                </Form.Item>
                {expanded ? (
                  <Form.Item className="query-field" label="日志详情" name="detail">
                    <Input allowClear placeholder="请输入日志详情" />
                  </Form.Item>
                ) : null}
              </>
            ) : null}
            <Form.Item className="query-actions">
              <Space className="query-action-group">
                <Button onClick={reset}>重置</Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
                {!isSimpleQuery ? (
                  <Button className="expand-toggle-button" type="link" onClick={() => setExpanded((value) => !value)}>
                    <span>{expanded ? '收起更多' : '展开更多'}</span>
                    {expanded ? <UpOutlined className="expand-toggle-icon" /> : <DownOutlined className="expand-toggle-icon" />}
                  </Button>
                ) : null}
              </Space>
            </Form.Item>
          </div>
        </Form>
      </section>

      <section ref={tableSurfaceRef} className="surface table-surface">
        <div className="table-toolbar">
          <Space className="table-toolbar-main">
            <Button type="primary" icon={<DownloadOutlined />}>导出日志</Button>
            <Button
              data-soft-disabled={!hasSelectedRows}
              className={!hasSelectedRows ? 'soft-disabled-action' : ''}
              onClick={() => guardSelection('批量启用')}
            >
              批量启用
            </Button>
            <Button
              data-soft-disabled={!hasSelectedRows}
              className={!hasSelectedRows ? 'soft-disabled-action' : ''}
              onClick={() => guardSelection('批量停用')}
            >
              批量停用
            </Button>
            <Button
              danger
              data-soft-disabled={!hasSelectedRows}
              className={!hasSelectedRows ? 'soft-disabled-action' : ''}
              onClick={() => guardSelection('批量删除')}
            >
              批量删除
            </Button>
          </Space>
          <Space className="table-toolbar-side">
            <Input.Search
              allowClear
              className="table-toolbar-search"
              placeholder="搜索表格"
              value={tableSearch}
              onChange={(event) => setTableSearch(event.target.value)}
              onSearch={(value) => setTableSearch(value)}
            />
            <Tooltip title="刷新数据"><Button icon={<ReloadOutlined />} /></Tooltip>
            <Popover
              arrow
              placement="bottomRight"
              trigger="hover"
              title="列设置"
              content={(
                <Checkbox.Group
                  className="column-setting-panel"
                  options={columnSettingOptions}
                  value={visibleColumns}
                  onChange={(values) => setVisibleColumns(values.map(String))}
                />
              )}
            >
              <Button aria-label="列设置" icon={<SettingOutlined />} />
            </Popover>
          </Space>
        </div>
        {isComplexTable ? (
          <Table<ComplexTableRow>
            className="audit-table complex-nested-table"
            rowKey="key"
            size="large"
            columns={complexColumns}
            dataSource={complexRows}
            expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
            rowSelection={{
              fixed: true,
              columnWidth: 40,
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            scroll={{ x: 1180, y: tableScrollY }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        ) : (
          <Table<AuditLog>
            className="audit-table"
            rowKey="key"
            size="large"
            columns={columns}
            dataSource={filteredRows}
            components={{ header: { cell: ResizableHeaderCell } }}
            rowSelection={{
              fixed: true,
              columnWidth: 40,
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            scroll={{ x: tableScrollX, y: tableScrollY }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        )}
      </section>

      <Drawer
        title="日志详情"
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        size="default"
        extra={<Button type="primary">复制详情</Button>}
      >
        {selectedLog ? (
          <Descriptions
            column={1}
            bordered
            size="small"
            items={[
              { key: 'type', label: '日志类型', children: selectedLog.logType },
              { key: 'name', label: '操作名称', children: selectedLog.operationName },
              { key: 'operationType', label: '操作类型', children: selectedLog.operationType },
              { key: 'target', label: '操作对象', children: selectedLog.target },
              { key: 'user', label: '操作用户', children: selectedLog.user },
              { key: 'ip', label: '操作用户IP', children: selectedLog.ip },
              { key: 'result', label: '操作结果', children: resultBadge(selectedLog.result) },
              { key: 'time', label: '发生时间', children: selectedLog.time },
              { key: 'detail', label: '详情', children: selectedLog.detail },
            ]}
          />
        ) : null}
      </Drawer>
    </div>
  );
}
