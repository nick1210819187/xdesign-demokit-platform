import {
  ApiOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  CloudServerOutlined,
  CodeOutlined,
  ControlOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  HddOutlined,
  KeyOutlined,
  LayoutOutlined,
  MonitorOutlined,
  ProfileOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

export type PrimaryKey = 'home' | 'resource' | 'model' | 'app' | 'monitor' | 'ops' | 'system' | 'kit';

export type NavItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children?: NavItem[];
};

export const primaryModules: Array<{ key: PrimaryKey; label: string; iconKey: string }> = [
  { key: 'home', label: '首页', iconKey: 'home' },
  { key: 'resource', label: '资源', iconKey: 'resource' },
  { key: 'model', label: '模型', iconKey: 'model' },
  { key: 'app', label: '应用', iconKey: 'app' },
  { key: 'monitor', label: '监控', iconKey: 'monitor' },
  { key: 'ops', label: '运维', iconKey: 'ops' },
  { key: 'system', label: '系统', iconKey: 'system' },
  { key: 'kit', label: '示例', iconKey: 'app' },
];

export const navigation: Record<PrimaryKey, NavItem[]> = {
  home: [],
  resource: [
    { key: 'os', label: '操作系统', icon: <DatabaseOutlined /> },
    {
      key: 'device',
      label: '设备列表',
      icon: <CloudServerOutlined />,
      children: [
        { key: 'server', label: '服务器' },
        { key: 'network', label: '网络' },
      ],
    },
  ],
  model: [
    { key: 'model-overview', label: '概览', icon: <DashboardOutlined /> },
    { key: 'model-gallery', label: '模型广场', icon: <AppstoreOutlined /> },
    {
      key: 'experience-center',
      label: '体验中心',
      icon: <ExperimentOutlined />,
      children: [
        { key: 'experience-chat', label: '对话体验' },
        { key: 'experience-prompt', label: 'Prompt 体验' },
        { key: 'experience-compare', label: '模型对比' },
      ],
    },
    {
      key: 'model-management',
      label: '模型管理',
      icon: <DatabaseOutlined />,
      children: [
        { key: 'model-list', label: '模型列表' },
        { key: 'model-repo', label: '模型仓库' },
        { key: 'model-version', label: '模型版本' },
      ],
    },
    {
      key: 'inference-service',
      label: '推理服务',
      icon: <DeploymentUnitOutlined />,
      children: [
        { key: 'online-service', label: '在线服务' },
        { key: 'prompt-template', label: 'Prompt 模板' },
      ],
    },
    {
      key: 'model-evaluation',
      label: '模型评估',
      icon: <BarChartOutlined />,
      children: [
        { key: 'eval-task', label: '评估任务' },
        { key: 'eval-report', label: '评估报告' },
      ],
    },
    {
      key: 'model-training',
      label: '模型训练',
      icon: <RocketOutlined />,
      children: [
        { key: 'train-task', label: '训练任务' },
        { key: 'train-config', label: '训练配置' },
        { key: 'train-resource', label: '训练资源' },
      ],
    },
    {
      key: 'algorithm-development',
      label: '算法开发',
      icon: <CodeOutlined />,
      children: [
        { key: 'notebook', label: 'Notebook' },
        { key: 'algorithm-manage', label: '算法管理' },
        { key: 'code-repo', label: '代码仓库' },
      ],
    },
    {
      key: 'data-management',
      label: '数据管理',
      icon: <FolderOpenOutlined />,
      children: [
        { key: 'dataset', label: '数据集' },
        { key: 'data-label', label: '数据标注' },
        { key: 'data-version', label: '数据版本' },
      ],
    },
    { key: 'image-management', label: '镜像管理', icon: <FileImageOutlined /> },
    {
      key: 'api-key',
      label: 'API Key',
      icon: <KeyOutlined />,
      children: [
        { key: 'api-key-list', label: 'Key 管理' },
        { key: 'api-access-log', label: '访问记录' },
      ],
    },
    {
      key: 'resource-monitoring',
      label: '资源监控',
      icon: <MonitorOutlined />,
      defaultOpen: true,
      children: [
        { key: 'user-resource', label: '用户资源' },
        { key: 'hardware-resource', label: '硬件资源' },
      ],
    },
    {
      key: 'console',
      label: '控制台',
      icon: <ControlOutlined />,
      children: [
        { key: 'console-overview', label: '控制台总览' },
        { key: 'console-billing', label: '费用账单' },
      ],
    },
  ],
  app: [
    { key: 'knowledge-base', label: '知识库', icon: <FolderOpenOutlined /> },
    { key: 'agent', label: '智能体', icon: <AppstoreOutlined /> },
    { key: 'workflow', label: '工作流', icon: <DeploymentUnitOutlined /> },
    { key: 'model-store', label: '模型仓', icon: <DatabaseOutlined /> },
    { key: 'mcp', label: 'MCP', icon: <CodeOutlined /> },
    { key: 'app-management', label: '管理', icon: <SettingOutlined /> },
    { key: 'app-market', label: '应用广场', icon: <AppstoreOutlined /> },
    { key: 'api', label: 'API', icon: <ApiOutlined /> },
    { key: 'approval', label: '审批', icon: <FileSearchOutlined /> },
  ],
  monitor: [
    {
      key: 'alarm-event',
      label: '告警和事件',
      icon: <BellOutlined />,
      children: [
        { key: 'current-alarm', label: '当前告警' },
        { key: 'history-alarm', label: '历史告警' },
        { key: 'event', label: '事件' },
        { key: 'muted-alarm-event', label: '屏蔽的告警和事件' },
      ],
    },
    {
      key: 'alarm-config',
      label: '告警配置',
      icon: <SettingOutlined />,
      children: [
        { key: 'mute-rule', label: '屏蔽规则' },
        { key: 'event-to-alarm', label: '事件转告警' },
        { key: 'notify-rule', label: '通知规则' },
      ],
    },
    {
      key: 'metric-management',
      label: '指标管理',
      icon: <MonitorOutlined />,
      children: [
        { key: 'metric-setting', label: '指标设置' },
        { key: 'alarm-rule', label: '告警规则' },
      ],
    },
    {
      key: 'failure-prediction',
      label: '故障预测',
      icon: <HddOutlined />,
      children: [
        { key: 'disk', label: '硬盘' },
        { key: 'memory', label: '内存' },
      ],
    },
    { key: 'failure-diagnosis', label: '故障诊断', icon: <ToolOutlined /> },
    { key: 'monitor-view', label: '监控视图', icon: <MonitorOutlined /> },
  ],
  ops: [
    {
      key: 'log',
      label: '日志',
      icon: <FileSearchOutlined />,
      defaultOpen: true,
      children: [
        { key: 'audit-log', label: '审计日志' },
        { key: 'syslog-config', label: 'Syslog配置' },
        { key: 'log-collection', label: '日志收集' },
      ],
    },
    {
      key: 'config-deploy',
      label: '配置部署',
      icon: <DeploymentUnitOutlined />,
      defaultOpen: true,
      children: [{ key: 'os-deploy', label: 'OS部署' }],
    },
  ],
  system: [
    {
      key: 'user',
      label: '用户',
      icon: <UserOutlined />,
      defaultOpen: true,
      children: [
        { key: 'user-info', label: '用户信息' },
        { key: 'user-management', label: '用户管理' },
        { key: 'role-management', label: '角色管理' },
      ],
    },
    {
      key: 'security',
      label: '安全',
      icon: <SafetyCertificateOutlined />,
      defaultOpen: true,
      children: [
        { key: 'security-policy', label: '安全策略' },
        { key: 'certificate-management', label: '证书管理' },
        { key: 'two-factor-auth', label: '双因素认证' },
        { key: 'config-item-management', label: '配置项管理' },
      ],
    },
    {
      key: 'system-config',
      label: '系统配置',
      icon: <SettingOutlined />,
      defaultOpen: true,
      children: [
        { key: 'ntp-config', label: 'NTP配置' },
        { key: 'proxy-config', label: '代理配置' },
        { key: 'ldap-config', label: 'LDAP配置' },
        { key: 'dns-config', label: 'DNS配置' },
      ],
    },
    { key: 'license', label: '许可证', icon: <KeyOutlined /> },
    { key: 'task-center', label: '任务中心', icon: <TeamOutlined /> },
  ],
  kit: [
    { key: 'secondary-page', label: '二级页面', icon: <DeploymentUnitOutlined /> },
    {
      key: 'card-choice-group',
      label: '卡片选择',
      icon: <AppstoreOutlined />,
      defaultOpen: true,
      children: [
        { key: 'card-choice', label: '卡片选择' },
        { key: 'card-choice-plain', label: '卡片选择（无切图）' },
        { key: 'card-choice-two', label: '卡片选择（两卡）' },
      ],
    },
    { key: 'normal-table', label: '普通表格', icon: <TableOutlined /> },
    { key: 'complex-table', label: '复杂表格', icon: <TableOutlined /> },
    { key: 'filter-card', label: '左筛右卡', icon: <AppstoreOutlined /> },
    { key: 'data-visualization', label: '数据可视化（更新中）', icon: <BarChartOutlined /> },
    { key: 'custom-home', label: '自定义首页（更新中）', icon: <LayoutOutlined /> },
    { key: 'detail-page', label: '详情页（更新中）', icon: <ProfileOutlined /> },
    { key: 'modal-drawer', label: '弹窗与抽屉（更新中）', icon: <LayoutOutlined /> },
    { key: 'tree-table', label: '左树右表（更新中）', icon: <ApartmentOutlined /> },
    { key: 'graphic-table', label: '图形化表格（更新中）', icon: <BarChartOutlined /> },
    { key: 'fke-complex-page', label: 'FKE复杂页面', icon: <DeploymentUnitOutlined /> },
    { key: 'hardware-resource', label: '硬件资源', icon: <HddOutlined /> },
    { key: 'component-library', label: '组件 DemoKit', icon: <AppstoreOutlined /> },
  ],
};

export function firstSelectable(items: NavItem[]): string {
  for (const item of items) {
    if (item.children?.length) return item.children[0].key;
    return item.key;
  }
  return '';
}
