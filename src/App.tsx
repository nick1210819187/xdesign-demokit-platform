import { useMemo, useState } from 'react';
import { App as AntApp } from 'antd';
import { AppShell } from './components/AppShell';
import { firstSelectable, navigation, type PrimaryKey } from './data/navigation';
import { AuditLogPage } from './pages/AuditLogPage';
import { CardChoicePage } from './pages/CardChoicePage';
import { ComponentLibraryPage } from './pages/ComponentLibraryPage';
import { HomePage } from './pages/HomePage';
import { ModelGalleryPage } from './pages/ModelGalleryPage';
import { OnlineServicePage } from './pages/OnlineServicePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { DataVisualizationPage } from './pages/DataVisualizationPage';
import { CustomHomePage } from './pages/CustomHomePage';

const pageTitles: Record<string, string> = {
  os: '操作系统',
  server: '服务器',
  network: '网络',
  'model-overview': '模型概览',
  'model-management': '模型管理',
  'online-service': '在线服务',
  'prompt-template': 'Prompt模板',
  'component-library': '组件 DemoKit',
  'secondary-page': '二级页面',
  'custom-home': '自定义首页',
  'card-choice': '卡片选择',
  'normal-table': '普通表格',
  'complex-table': '复杂表格',
  'filter-card': '左筛右卡',
  'data-visualization': '数据可视化',
};

const resolveRoute = () => {
  const [rawPrimary, rawSecondary] = window.location.hash.replace(/^#\/?/, '').split('/');
  const primary = Object.prototype.hasOwnProperty.call(navigation, rawPrimary) ? rawPrimary as PrimaryKey : 'ops';
  const secondary = rawSecondary || firstSelectable(navigation[primary]) || 'audit-log';
  return { primary, secondary };
};

export default function App() {
  const initialRoute = resolveRoute();
  const [activePrimary, setActivePrimary] = useState<PrimaryKey>(initialRoute.primary);
  const [activeSecondary, setActiveSecondary] = useState(initialRoute.secondary);

  const page = useMemo(() => {
    if (activePrimary === 'home') {
      return <HomePage />;
    }
    if (activePrimary === 'ops' && activeSecondary === 'audit-log') return <AuditLogPage />;
    if (activePrimary === 'kit' && activeSecondary === 'component-library') return <ComponentLibraryPage />;
    if (activePrimary === 'kit' && activeSecondary === 'secondary-page') return <OnlineServicePage />;
    if (activePrimary === 'kit' && activeSecondary === 'custom-home') return <CustomHomePage />;
    if (activePrimary === 'kit' && activeSecondary === 'card-choice') return <CardChoicePage />;
    if (activePrimary === 'kit' && activeSecondary === 'normal-table') {
      return <AuditLogPage title="普通表格" showRetention={false} queryMode="simple" />;
    }
    if (activePrimary === 'kit' && activeSecondary === 'complex-table') {
      return <AuditLogPage title="复杂表格" showRetention={false} tableMode="complex" />;
    }
    if (activePrimary === 'kit' && activeSecondary === 'filter-card') return <ModelGalleryPage />;
    if (activePrimary === 'kit' && activeSecondary === 'data-visualization') return <DataVisualizationPage />;
    return <PlaceholderPage title={pageTitles[activeSecondary] || activeSecondary || '模块'} />;
  }, [activePrimary, activeSecondary]);

  const handleNavigate = (primary: PrimaryKey, secondary: string) => {
    const nextSecondary = secondary || firstSelectable(navigation[primary]);
    setActivePrimary(primary);
    setActiveSecondary(nextSecondary);
    window.history.replaceState(null, '', `#${primary}/${nextSecondary}`);
  };

  return (
    <AntApp>
      <AppShell activePrimary={activePrimary} activeSecondary={activeSecondary} onNavigate={handleNavigate}>
        {page}
      </AppShell>
    </AntApp>
  );
}
