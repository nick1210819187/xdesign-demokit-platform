export type AuditLog = {
  key: string;
  rowExample?: 'single' | 'double';
  logType: '安全日志' | '操作日志';
  operationName: string;
  operationType: 'Appliance' | 'Resource' | 'System';
  target: string;
  targetMore?: boolean;
  user: string;
  ip: string;
  result: '成功' | '失败' | '进行中';
  time: string;
  module: string;
  detail: string;
};

const auditLogSeeds: AuditLog[] = [
  {
    key: 'audit-01',
    logType: '安全日志',
    operationName: 'Login System',
    operationType: 'Appliance',
    target: 'testvm:172.16.10.3',
    targetMore: true,
    user: 'Administrator',
    ip: '192.168.19.47',
    result: '成功',
    time: '2021-01-26 10:57:09',
    module: 'Auth',
    detail: 'The Administrator user logs in to the system successfully.',
  },
  {
    key: 'audit-02',
    logType: '安全日志',
    operationName: 'Login System',
    operationType: 'Appliance',
    target: 'testvm:172.16.10.3',
    user: '-',
    ip: '192.168.21.172',
    result: '失败',
    time: '2021-01-26 10:56:41',
    module: 'Auth',
    detail: 'Authorization failed, token is invalid.',
  },
  {
    key: 'audit-03',
    logType: '安全日志',
    operationName: 'Login System',
    operationType: 'Appliance',
    target: 'testvm:172.16.10.3',
    user: '-',
    ip: '192.168.21.172',
    result: '失败',
    time: '2021-01-26 10:56:22',
    module: 'Auth',
    detail: 'Authorization failed, token is invalid.',
  },
  {
    key: 'audit-04',
    logType: '安全日志',
    operationName: 'Login System',
    operationType: 'Appliance',
    target: 'testvm:172.16.10.3',
    user: 'Administrator',
    ip: '192.168.21.172',
    result: '成功',
    time: '2021-01-26 10:56:03',
    module: 'Auth',
    detail: 'The Administrator user logs in to the system successfully.',
  },
  {
    key: 'audit-05',
    logType: '操作日志',
    operationName: 'GetConnectInfo',
    operationType: 'Appliance',
    target: 'testvm:172.16.10.3',
    user: 'CloudAdapterService',
    ip: '192.168.0.9',
    result: '进行中',
    time: '2021-01-26 10:55:46',
    module: 'Resource',
    detail: 'GetConnectInfo Start key = tokenValue',
  },
  {
    key: 'audit-06',
    logType: '操作日志',
    operationName: 'GetConnectInfo',
    operationType: 'Resource',
    target: 'gpu资源组-01',
    targetMore: true,
    user: 'CloudAdapterService',
    ip: '192.168.0.9',
    result: '成功',
    time: '2021-01-26 10:55:18',
    module: 'Resource',
    detail: 'GetConnectInfo Success key = tokenValue',
  },
  {
    key: 'audit-07',
    logType: '操作日志',
    operationName: 'GetConnectInfo',
    operationType: 'Appliance',
    target: '[object Object]',
    user: 'CloudAdapterService',
    ip: '192.168.0.9',
    result: '进行中',
    time: '2021-01-26 10:54:57',
    module: 'Resource',
    detail: 'GetConnectInfo Start key = tokenValue',
  },
  {
    key: 'audit-08',
    logType: '操作日志',
    operationName: 'GetConnectInfo',
    operationType: 'Appliance',
    target: 'testvm:172.16.10.3',
    targetMore: true,
    user: 'CloudAdapterService',
    ip: '192.168.0.9',
    result: '成功',
    time: '2021-01-26 10:54:32',
    module: 'Resource',
    detail: 'GetConnectInfo Success key = tokenValue',
  },
  {
    key: 'audit-09',
    logType: '操作日志',
    operationName: 'GetConnectInfo',
    operationType: 'System',
    target: 'testvm:172.16.10.3',
    user: 'CloudAdapterService',
    ip: '192.168.0.9',
    result: '进行中',
    time: '2021-01-26 10:54:08',
    module: 'Resource',
    detail: 'GetConnectInfo Start key = tokenValue',
  },
];

const users = ['Administrator', 'CloudAdapterService', 'OpsAdmin', 'SecurityAdmin', '-'];
const targets = ['testvm:172.16.10.3', 'gpu资源组-01', 'rack-22/node-08', 'model-service-prod', 'system-policy'];
const modules = ['Auth', 'Resource', 'System', 'Model', 'Network'];

export const auditLogs: AuditLog[] = Array.from({ length: 100 }, (_, index) => {
  const seed = auditLogSeeds[index % auditLogSeeds.length];
  const sequence = index + 1;
  const row: AuditLog = {
    ...seed,
    key: `audit-${String(sequence).padStart(3, '0')}`,
    target: targets[index % targets.length],
    targetMore: index % 4 === 0,
    user: users[index % users.length],
    ip: `192.168.${index % 32}.${(index * 7) % 250}`,
    time: dayOffsetTime(sequence),
    module: modules[index % modules.length],
    detail: `${seed.detail} Request trace ${String(sequence).padStart(4, '0')} completed with sampled metadata and audit context.`,
  };

  if (index === 0) {
    return {
      ...row,
      rowExample: 'single',
      operationName: '这里是单行表格',
      detail: '用于展示 Ant Design 默认单行表格。',
    };
  }

  if (index === 1) {
    return {
      ...row,
      rowExample: 'double',
      operationName: '这里是双行表格',
      detail: '用于展示 Ant Design 内容自然撑开的双行表格。',
    };
  }

  return row;
});

function dayOffsetTime(sequence: number) {
  const day = 26 - Math.floor((sequence - 1) / 24);
  const hour = 10 - (sequence % 5);
  const minute = 57 - (sequence % 50);
  return `2021-01-${String(Math.max(day, 1)).padStart(2, '0')} ${String(Math.max(hour, 0)).padStart(2, '0')}:${String(Math.max(minute, 0)).padStart(2, '0')}:09`;
}
