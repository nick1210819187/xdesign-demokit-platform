import { Empty, Typography } from 'antd';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="surface empty-page">
      <Empty description={false} />
      <Typography.Title level={4}>{title} 页面预留</Typography.Title>
    </section>
  );
}
