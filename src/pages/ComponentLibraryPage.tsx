import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Radio,
  Result,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
} from 'antd';
import type { TableProps, TimeRangePickerProps, TransferProps, UploadProps } from 'antd';
import { CloudUploadOutlined, MoreOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const onDateChange = (date: Dayjs | null) => {
  if (date) {
    console.log('Date: ', date);
  } else {
    console.log('Clear');
  }
};

const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  } else {
    console.log('Clear');
  }
};

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: '近 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '近 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '近 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '近 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
];

const tableRows = [
  { key: '1', type: '安全日志', name: 'Login System', result: '成功', user: 'Administrator', time: '2021-01-26 10:57' },
  { key: '2', type: '操作日志', name: 'GetConnectInfo', result: '进行中', user: 'CloudAdapterService', time: '2021-01-26 10:55' },
  { key: '3', type: '操作日志', name: 'DeployConfig', result: '失败', user: 'OpsAdmin', time: '2021-01-26 10:48' },
];

const tableColumns: TableProps<(typeof tableRows)[number]>['columns'] = [
  { title: '日志类型', dataIndex: 'type', render: (value) => <Tag>{value}</Tag> },
  { title: '操作名称', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  { title: '操作用户', dataIndex: 'user' },
  { title: '操作结果', dataIndex: 'result', render: (value) => <Badge status={value === '成功' ? 'success' : value === '失败' ? 'error' : 'processing'} text={value} /> },
  { title: '发生时间', dataIndex: 'time' },
  { title: '操作', render: () => <Button type="link" size="small">详情</Button> },
];

const transferData: TransferProps['dataSource'] = Array.from({ length: 6 }).map((_, index) => ({
  key: String(index),
  title: `权限项 ${index + 1}`,
  description: `系统权限 ${index + 1}`,
}));

const uploadProps: UploadProps = {
  beforeUpload: () => false,
  maxCount: 1,
};

function ComponentTile({ name, type, children }: { name: string; type: string; children: ReactNode }) {
  return (
    <Card className="component-tile" size="small" title={name} extra={<Tag>{type}</Tag>}>
      {children}
    </Card>
  );
}

export function ComponentLibraryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="component-library page-stack">
      <div className="page-heading">
        <div>
          <Typography.Title level={3}>组件 DemoKit</Typography.Title>
        </div>
      </div>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>查询筛选</Typography.Title>
          <Tag>Form / Input / Select / DatePicker.RangePicker / Segmented</Tag>
        </div>
        <Form layout="vertical" className="demo-query-layout">
          <div className="demo-filter-group demo-filter-group-wide">
            <Typography.Text className="demo-filter-title">分段控制器</Typography.Text>
            <Form.Item label="周期类型">
              <Segmented<string>
                className="period-segmented"
                size="large"
                defaultValue="Monthly"
                options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']}
                onChange={(value) => {
                  console.log(value);
                }}
              />
            </Form.Item>
          </div>
          <div className="demo-filter-group demo-filter-group-wide">
            <Typography.Text className="demo-filter-title">日期选择</Typography.Text>
            <div className="date-picker-demo-grid">
              <Form.Item label="单日期预设">
                <DatePicker
                  presets={[
                    { label: '昨天', value: dayjs().add(-1, 'd') },
                    { label: '上周', value: dayjs().add(-7, 'd') },
                    { label: '上月', value: dayjs().add(-1, 'month') },
                  ]}
                  onChange={onDateChange}
                />
              </Form.Item>
              <Form.Item label="日期范围预设">
                <RangePicker presets={rangePresets} onChange={onRangeChange} />
              </Form.Item>
              <Form.Item label="带时间范围预设">
                <RangePicker
                  presets={[
                    {
                      label: <span aria-label="当前时间至今日结束">现在至今日结束</span>,
                      value: () => [dayjs(), dayjs().endOf('day')],
                    },
                    ...rangePresets,
                  ]}
                  showTime
                  format="YYYY/MM/DD HH:mm:ss"
                  onChange={onRangeChange}
                />
              </Form.Item>
            </div>
          </div>
          <div className="demo-filter-group">
            <Typography.Text className="demo-filter-title">其他筛选</Typography.Text>
            <div className="demo-filter-grid">
              <Form.Item label="操作类型"><Select allowClear showSearch placeholder="请选择操作类型" options={[{ value: 'Appliance', label: 'Appliance' }, { value: 'Resource', label: 'Resource' }]} /></Form.Item>
              <Form.Item label="操作用户"><Input allowClear placeholder="请输入操作用户" /></Form.Item>
              <Form.Item className="query-actions"><Button type="primary">查询</Button></Form.Item>
            </div>
          </div>
        </Form>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>数据展示</Typography.Title>
          <Tag>Table / Descriptions / Card / Statistic / Tag / Badge / Timeline / Tree</Tag>
        </div>
        <div className="stack">
          <Table rowKey="key" size="middle" columns={tableColumns} dataSource={tableRows} rowSelection={{}} pagination={{ pageSize: 3 }} />
          <div className="tile-grid two">
            <ComponentTile name="Descriptions / Statistic" type="详情">
              <Descriptions column={2} size="small" items={[
                { key: '1', label: '保存周期', children: '30 天' },
                { key: '2', label: '日志总量', children: <Statistic value={1280} suffix="条" /> },
              ]} />
            </ComponentTile>
            <ComponentTile name="Timeline / Tree" type="结构展示">
              <Space orientation="vertical" className="full">
                <Timeline items={[{ content: '创建任务' }, { content: '执行中' }, { content: '完成' }]} />
                <Tree treeData={[{ title: '系统', key: 'system', children: [{ title: '安全策略', key: 'security' }] }]} />
              </Space>
            </ComponentTile>
          </div>
        </div>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>录入与浮层</Typography.Title>
          <Tag>InputNumber / Cascader / Transfer / Upload / Modal / Drawer</Tag>
        </div>
        <div className="tile-grid three">
          <ComponentTile name="基础录入" type="Input">
            <Space orientation="vertical">
              <Input placeholder="请输入名称" />
              <Space.Compact><InputNumber min={1} max={30} defaultValue={7} /><Button disabled>天</Button></Space.Compact>
              <TimePicker />
            </Space>
          </ComponentTile>
          <ComponentTile name="复杂录入" type="Select">
            <Space orientation="vertical" className="full">
              <Cascader placeholder="请选择资源路径" options={[{ value: 'dc-a', label: '机房 A', children: [{ value: 'rack-01', label: '机柜 01' }] }]} />
              <TreeSelect treeData={[{ title: '资源组', value: 'group', children: [{ title: 'GPU 资源组', value: 'gpu' }] }]} placeholder="请选择树节点" />
              <Transfer dataSource={transferData} render={(item) => item.title ?? ''} styles={{ section: { width: 150, height: 150 } }} />
              <Upload {...uploadProps}><Button icon={<CloudUploadOutlined />}>选择文件</Button></Upload>
            </Space>
          </ComponentTile>
          <ComponentTile name="反馈 / 浮层" type="Overlay">
            <Space wrap>
              <Button onClick={() => setModalOpen(true)}>打开 Modal</Button>
              <Button onClick={() => setDrawerOpen(true)}>打开 Drawer</Button>
              <Popconfirm title="确认删除？"><Button danger>删除</Button></Popconfirm>
              <Popover content="更多字段说明"><Button>说明</Button></Popover>
              <Tooltip title="刷新数据"><Button icon={<SettingOutlined />} /></Tooltip>
            </Space>
          </ComponentTile>
        </div>
      </section>

      <section className="surface kit-section">
        <div className="section-head">
          <Typography.Title level={4}>基础 / 导航 / 状态</Typography.Title>
          <Tag>Button / Tabs / Breadcrumb / Pagination / Steps / Result</Tag>
        </div>
        <div className="tile-grid three">
          <ComponentTile name="Button / Badge" type="基础">
            <Space wrap>
              <Button type="primary">主按钮</Button>
              <Button>默认按钮</Button>
              <Button danger>危险按钮</Button>
              <Badge count={3}><Avatar>AD</Avatar></Badge>
            </Space>
          </ComponentTile>
          <ComponentTile name="Tabs / Breadcrumb" type="导航">
            <Space orientation="vertical" className="full">
              <Breadcrumb items={[{ title: '运维' }, { title: '日志' }, { title: '审计日志' }]} />
              <Tabs items={[{ key: '1', label: '审计日志', children: '日志内容区' }, { key: '2', label: 'Syslog 配置', children: '配置内容区' }]} />
            </Space>
          </ComponentTile>
          <ComponentTile name="Dropdown / Pagination / Steps" type="导航辅助">
            <Space orientation="vertical">
              <Button icon={<MoreOutlined />}>更多操作</Button>
              <Pagination total={86} pageSize={10} size="small" />
              <Steps size="small" current={1} items={[{ title: '配置' }, { title: '校验' }, { title: '完成' }]} />
            </Space>
          </ComponentTile>
        </div>
        <Space orientation="vertical" className="full status-stack">
          <Alert type="info" title="信息提示" showIcon />
          <Space><Spin size="small" /><Skeleton active paragraph={{ rows: 1 }} /></Space>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          <Result status="success" title="任务执行成功" subTitle="Result 用于完整反馈页或流程结束态。" extra={<Button type="primary">返回列表</Button>} />
        </Space>
      </section>

      <Modal title="Modal 对话框" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => setModalOpen(false)}>
        <Form layout="vertical">
          <Form.Item label="保存周期"><Space.Compact><InputNumber min={1} max={365} defaultValue={30} /><Button disabled>天</Button></Space.Compact></Form.Item>
          <Form.Item label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
      <Drawer title="Drawer 抽屉" open={drawerOpen} onClose={() => setDrawerOpen(false)} size="default">
        <Descriptions column={1} items={[{ key: '1', label: '操作用户', children: 'Administrator' }, { key: '2', label: '操作结果', children: <Badge status="success" text="成功" /> }]} />
      </Drawer>
    </div>
  );
}
