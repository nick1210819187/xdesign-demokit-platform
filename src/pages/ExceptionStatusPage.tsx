import { Button, Result, Empty, Card, Row, Col, Space } from 'antd';
import { ReloadOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';

export function ExceptionStatusPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, color: 'var(--text-1)' }}>异常状态</h2>
        <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 14 }}>
          B 端产品常见异常场景汇总：错误码、网络异常、空状态、权限不足等
        </p>
      </div>

      <Row gutter={[24, 24]}>
        {/* 403 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <Result
              status="403"
              title="403"
              subTitle="抱歉，您没有权限访问该页面"
              extra={
                <Space>
                  <Button type="primary" icon={<HomeOutlined />}>返回首页</Button>
                  <Button>申请权限</Button>
                </Space>
              }
            />
          </Card>
        </Col>

        {/* 404 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <Result
              status="404"
              title="404"
              subTitle="抱歉，您访问的页面不存在"
              extra={
                <Space>
                  <Button type="primary" icon={<HomeOutlined />}>返回首页</Button>
                  <Button icon={<SearchOutlined />}>去搜索</Button>
                </Space>
              }
            />
          </Card>
        </Col>

        {/* 500 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <Result
              status="500"
              title="500"
              subTitle="抱歉，服务器出了点问题，请稍后再试"
              extra={
                <Button type="primary" icon={<ReloadOutlined />}>重新加载</Button>
              }
            />
          </Card>
        </Col>

        {/* 网络错误 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <Result
              status="error"
              title="网络异常"
              subTitle="网络连接失败，请检查您的网络设置后重试"
              extra={
                <Space>
                  <Button type="primary" icon={<ReloadOutlined />}>重新连接</Button>
                  <Button>检查网络</Button>
                </Space>
              }
            />
          </Card>
        </Col>

        {/* 加载失败 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <Result
              status="warning"
              title="加载失败"
              subTitle="数据加载超时，请检查网络后重试"
              extra={
                <Button type="primary" icon={<ReloadOutlined />}>重新加载</Button>
              }
            />
          </Card>
        </Col>

        {/* 浏览器不兼容 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <Result
              status="info"
              title="浏览器版本过低"
              subTitle="当前浏览器版本不支持部分功能，建议升级到最新版本"
              extra={
                <Space>
                  <Button type="primary">升级浏览器</Button>
                  <Button>继续访问</Button>
                </Space>
              }
            />
          </Card>
        </Col>

        {/* 空状态 - 暂无数据 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <div style={{ padding: '40px 0' }}>
              <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_DEFAULT}
              >
                <Button type="primary">立即创建</Button>
              </Empty>
            </div>
          </Card>
        </Col>

        {/* 空状态 - 搜索无结果 */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,11,35,0.06)' }}>
            <div style={{ padding: '40px 0' }}>
              <Empty
                description="没有找到匹配的内容，换个关键词试试"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button>清除筛选</Button>
              </Empty>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
