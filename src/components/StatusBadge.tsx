import type { ReactNode } from 'react';
import { Badge } from 'antd';

type StatusTone = 'success' | 'processing' | 'default' | 'error' | 'warning';

export function StatusBadge({
  status,
  text,
  className,
}: {
  status: StatusTone;
  text: ReactNode;
  className?: string;
}) {
  return (
    <Badge
      className={['x-status-badge', className].filter(Boolean).join(' ')}
      status={status}
      text={text}
    />
  );
}
