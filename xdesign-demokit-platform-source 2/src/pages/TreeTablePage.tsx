import { useMemo, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { App, Button, Input, Space, Switch, Table, Tag, Tooltip, Tree, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import type { DataNode } from 'antd/es/tree';

type Scope = '组织级' | '个人级';

type ResourceNode = {
  key: string;
  title: string;
  count?: number;
  scope?: Scope;
  children?: ResourceNode[];
};

type ResourceRow = {
  key: string;
  name: string;
  level: Scope;
  organization: string;
  sharedOrganization: string;
  creator: string;
};

const resourceTree: ResourceNode[] = [
  {
    key: 'container',
    title: '容器',
    children: [
      {
        key: 'container-compute',
        title: '计算资源',
        children: [
          { key: 'container-cluster', title: '容器集群', count: 3, scope: '组织级' },
          { key: 'physical-resource', title: '物理机资源', count: 3, scope: '组织级' },
        ],
      },
      {
        key: 'container-network',
        title: '网络与版本',
        children: [
          { key: 'ip-pool', title: 'IP池', count: 5, scope: '组织级' },
          { key: 'kubernetes-version', title: 'Kubernetes版本', count: 1, scope: '组织级' },
        ],
      },
    ],
  },
  {
    key: 'model-management',
    title: '模型管理',
    children: [
      {
        key: 'model-assets',
        title: '模型资产',
        children: [{ key: 'model-list', title: '模型列表', count: 72, scope: '组织级' }],
      },
    ],
  },
  {
    key: 'inference-service',
    title: '推理服务',
    children: [
      {
        key: 'inference-runtime',
        title: '服务运行',
        children: [{ key: 'online-service', title: '在线服务', count: 3, scope: '个人级' }],
      },
    ],
  },
  {
    key: 'model-training',
    title: '模型训练',
    children: [
      {
        key: 'training-workload',
        title: '训练作业',
        children: [{ key: 'training-task', title: '训练任务', count: 3, scope: '个人级' }],
      },
    ],
  },
  {
    key: 'algorithm-development',
    title: '算法开发',
    children: [
      {
        key: 'algorithm-workspace',
        title: '开发工作区',
        children: [
          { key: 'development-environment', title: '开发环境', count: 5, scope: '个人级' },
          { key: 'algorithm-management', title: '算法管理', count: 3, scope: '组织级' },
        ],
      },
    ],
  },
  {
    key: 'data-management',
    title: '数据管理',
    children: [
      {
        key: 'data-assets',
        title: '数据资产',
        children: [
          { key: 'dataset-management', title: '数据集管理', count: 13, scope: '组织级' },
          { key: 'tag-group', title: '标签组', count: 1, scope: '组织级' },
        ],
      },
      {
        key: 'data-process',
        title: '数据处理',
        children: [{ key: 'data-cleaning', title: '数据清洗', count: 1, scope: '个人级' }],
      },
    ],
  },
  {
    key: 'image-management',
    title: '镜像管理',
    children: [
      {
        key: 'image-assets',
        title: '镜像资产',
        children: [{ key: 'image-list', title: '镜像列表', count: 25, scope: '组织级' }],
      },
    ],
  },
  {
    key: 'api-key',
    title: 'API Key',
    children: [
      {
        key: 'api-key-security',
        title: '访问凭证',
        children: [{ key: 'api-key-management', title: 'API Key管理', count: 2, scope: '个人级' }],
      },
    ],
  },
];

const defaultRows: ResourceRow[] = [
  { key: 'base-cluster', name: 'base_cluster', level: '组织级', organization: 'data1', sharedOrganization: '-', creator: '-' },
  { key: 'lll-cluster', name: 'lll-cluster', level: '组织级', organization: 'test_org', sharedOrganization: '-', creator: '-' },
  { key: 'local', name: 'local', level: '组织级', organization: 'test_org', sharedOrganization: '-', creator: '-' },
];

const rowsByType: Record<string, ResourceRow[]> = {
  'container-cluster': defaultRows,
  'physical-resource': [
    { key: 'host-216', name: 'master216', level: '组织级', organization: 'production', sharedOrganization: '-', creator: 'Administrator' },
    { key: 'host-217', name: 'master217', level: '组织级', organization: 'production', sharedOrganization: '-', creator: 'Administrator' },
    { key: 'host-218', name: 'worker218', level: '组织级', organization: 'data1', sharedOrganization: 'test_org', creator: 'OpsAdmin' },
  ],
  'ip-pool': [
    { key: 'ip-pool-1', name: 'management-network', level: '组织级', organization: 'data1', sharedOrganization: '-', creator: 'Administrator' },
    { key: 'ip-pool-2', name: 'service-network', level: '组织级', organization: 'test_org', sharedOrganization: 'production', creator: 'NetworkAdmin' },
  ],
  'online-service': [
    { key: 'service-1', name: 'qwen3-online-service', level: '个人级', organization: 'AI平台部', sharedOrganization: '-', creator: 'ModelAdmin' },
    { key: 'service-2', name: 'deepseek-online-service', level: '个人级', organization: '研发一部', sharedOrganization: '-', creator: 'ModelAdmin' },
  ],
  'training-task': [
    { key: 'training-1', name: 'llm-finetune-001', level: '个人级', organization: '算法团队', sharedOrganization: '-', creator: 'AlgorithmAdmin' },
  ],
  'dataset-management': [
    { key: 'dataset-1', name: 'instruction-dataset-v2', level: '组织级', organization: '数据中心', sharedOrganization: '算法团队', creator: 'DataAdmin' },
    { key: 'dataset-2', name: 'evaluation-dataset', level: '组织级', organization: '数据中心', sharedOrganization: '-', creator: 'DataAdmin' },
  ],
  'image-list': [
    { key: 'image-1', name: 'pytorch-2.6-cuda12.4', level: '组织级', organization: 'AI平台部', sharedOrganization: '研发一部', creator: 'ImageAdmin' },
  ],
  'api-key-management': [
    { key: 'api-key-1', name: 'production-api-key', level: '个人级', organization: '应用开发部', sharedOrganization: '-', creator: 'AppAdmin' },
  ],
};

function getExpandedKeys(nodes: ResourceNode[]): string[] {
  return nodes.flatMap((node) => (node.children ? [node.key, ...getExpandedKeys(node.children)] : []));
}

const expandedKeys = getExpandedKeys(resourceTree);

function filterTree(nodes: ResourceNode[], keyword: string, onlyWithResources: boolean): ResourceNode[] {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return nodes.reduce<ResourceNode[]>((result, node) => {
    const children = node.children ? filterTree(node.children, keyword, onlyWithResources) : undefined;
    const matchesKeyword = !normalizedKeyword || node.title.toLowerCase().includes(normalizedKeyword);
    const hasResources = node.count === undefined || node.count > 0;

    if ((matchesKeyword && (!onlyWithResources || hasResources)) || children?.length) {
      result.push({ ...node, children });
    }
    return result;
  }, []);
}

function toTreeData(nodes: ResourceNode[]): DataNode[] {
  return nodes.map((node) => ({
    key: node.key,
    title: (
      <span className="resource-tree-node">
        <span className="resource-tree-node-label">
          {node.title}
          {node.count !== undefined && <Typography.Text type="secondary">（{node.count}）</Typography.Text>}
        </span>
        {node.scope && <Tag bordered={false}>{node.scope}</Tag>}
      </span>
    ),
    children: node.children ? toTreeData(node.children) : undefined,
    selectable: !node.children,
  }));
}

export function TreeTablePage() {
  const { message } = App.useApp();
  const [treeSearch, setTreeSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [onlyWithResources, setOnlyWithResources] = useState(true);
  const [selectedType, setSelectedType] = useState('container-cluster');

  const treeData = useMemo(
    () => toTreeData(filterTree(resourceTree, treeSearch, onlyWithResources)),
    [onlyWithResources, treeSearch],
  );

  const tableData = useMemo(() => {
    const keyword = tableSearch.trim().toLowerCase();
    const source = rowsByType[selectedType] ?? defaultRows;
    if (!keyword) return source;
    return source.filter((item) => Object.values(item).join(' ').toLowerCase().includes(keyword));
  }, [selectedType, tableSearch]);

  const columns: TableColumnsType<ResourceRow> = [
    { title: '资源名称', dataIndex: 'name', key: 'name', width: 210, ellipsis: true },
    {
      title: '资源层级',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: Scope) => <Tag color={level === '组织级' ? 'blue' : 'default'}>{level}</Tag>,
    },
    { title: '所属组织', dataIndex: 'organization', key: 'organization', width: 180, ellipsis: true },
    { title: '共享组织', dataIndex: 'sharedOrganization', key: 'sharedOrganization', width: 180, ellipsis: true },
    { title: '创建者', dataIndex: 'creator', key: 'creator', width: 160, ellipsis: true },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, row) => (
        <Space size={12}>
          <Typography.Link onClick={() => message.info(`正在配置 ${row.name}`)}>资源调配</Typography.Link>
          <Typography.Link onClick={() => message.info(`正在设置 ${row.name} 的共享范围`)}>资源共享</Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="tree-table-page page-stack">
      <div className="page-heading">
        <Typography.Title level={3}>左树右表</Typography.Title>
      </div>

      <div className="tree-table-layout">
        <section className="surface resource-tree-panel" aria-label="资源类型">
          <div className="resource-tree-filter">
            <Typography.Text strong>资源类型</Typography.Text>
            <div className="resource-tree-switch">
              <Typography.Text type="secondary">仅显示有资源</Typography.Text>
              <Switch size="small" checked={onlyWithResources} onChange={setOnlyWithResources} />
            </div>
          </div>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="请输入资源类型搜索"
            value={treeSearch}
            onChange={(event) => setTreeSearch(event.target.value)}
          />
          <div className="resource-tree-scroll">
            <Tree
              blockNode
              showLine={{ showLeafIcon: false }}
              defaultExpandedKeys={expandedKeys}
              selectedKeys={[selectedType]}
              treeData={treeData}
              onSelect={(keys) => keys[0] && setSelectedType(String(keys[0]))}
            />
          </div>
        </section>

        <section className="surface resource-table-panel" aria-label="资源调配列表">
          <div className="resource-table-toolbar">
            <Typography.Text strong>资源调配</Typography.Text>
            <Space size={8}>
              <Input.Search
                allowClear
                className="table-toolbar-search"
                placeholder="请输入资源名称搜索"
                value={tableSearch}
                onChange={(event) => setTableSearch(event.target.value)}
                onSearch={setTableSearch}
              />
              <Tooltip title="刷新数据">
                <Button icon={<ReloadOutlined />} aria-label="刷新数据" onClick={() => message.success('资源列表已刷新')} />
              </Tooltip>
            </Space>
          </div>
          <div className="resource-table-content">
            <Table<ResourceRow>
              rowKey="key"
              size="middle"
              columns={columns}
              dataSource={tableData}
              rowSelection={{}}
              scroll={{ x: 1050 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 条`,
                position: ['bottomRight'],
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
