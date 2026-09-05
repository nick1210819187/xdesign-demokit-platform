import { useCallback, useMemo, useState } from 'react';
import { App as AntApp } from 'antd';
import { AppShell } from './components/AppShell';
import { firstSelectable, navigation, type PrimaryKey } from './data/navigation';
import { AuditLogPage } from './pages/AuditLogPage';
import { CardChoicePage } from './pages/CardChoicePage';
import { CardChoicePlainPage } from './pages/CardChoicePlainPage';
import { CardChoiceTwoPage } from './pages/CardChoiceTwoPage';
import { ComponentLibraryPage } from './pages/ComponentLibraryPage';
import { ContainerGroupCreatePage } from './pages/ContainerGroupCreatePage';
import { HomePage } from './pages/HomePage';
import { ModelGalleryPage } from './pages/ModelGalleryPage';
import { OnlineServicePage } from './pages/OnlineServicePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { DataVisualizationPage } from './pages/DataVisualizationPage';
import { CustomHomePage } from './pages/CustomHomePage';
import { DetailPage } from './pages/DetailPage';
import { GraphicTablePage } from './pages/GraphicTablePage';
import { HardwareResourcePage } from './pages/HardwareResourcePage';
import { ModalDrawerPage } from './pages/ModalDrawerPage';
import { TreeTablePage } from './pages/TreeTablePage';

const pageTitles: Record<string, string> = {
  os: '操作系统',
  server: '服务器',
  network: '网络',
  'model-overview': '模型概览',
  'model-gallery': '模型广场',
  'experience-chat': '对话体验',
  'experience-prompt': 'Prompt 体验',
  'experience-compare': '模型对比',
  'model-list': '模型列表',
  'model-repo': '模型仓库',
  'model-version': '模型版本',
  'online-service': '在线服务',
  'prompt-template': 'Prompt 模板',
  'eval-task': '评估任务',
  'eval-report': '评估报告',
  'train-task': '训练任务',
  'train-config': '训练配置',
  'train-resource': '训练资源',
  notebook: 'Notebook',
  'algorithm-manage': '算法管理',
  'code-repo': '代码仓库',
  dataset: '数据集',
  'data-label': '数据标注',
  'data-version': '数据版本',
  'image-management': '镜像管理',
  'api-key-list': 'Key 管理',
  'api-access-log': '访问记录',
  'user-resource': '用户资源',
  'hardware-resource': '硬件资源',
  'console-overview': '控制台总览',
  'console-billing': '费用账单',
  'component-library': '组件 DemoKit',
  'container-group-create': '容器组创建',
  'fke-complex-page': 'FKE复杂页面',
  'secondary-page': '二级页面',
  'custom-home': '自定义首页',
  'detail-page': '详情页',
  'modal-drawer': '弹窗与抽屉',
  'tree-table': '左树右表',
  'graphic-table': '图形化表格',
  'card-choice': '卡片选择',
  'card-choice-plain': '卡片选择（无切图）',
  'card-choice-two': '卡片选择（两卡）',
  'normal-table': '普通表格',
  'complex-table': '复杂表格',
  'filter-card': '左筛右卡',
  'data-visualization': '数据可视化',
};

const resolveRoute = () => {
  const [rawPrimary, rawSecondary] = window.location.hash.replace(/^#\/?/, '').split('/');
  const primary = Object.prototype.hasOwnProperty.call(navigation, rawPrimary) ? rawPrimary as PrimaryKey : 'ops';
  const [secondaryValue, rawQuery = ''] = (rawSecondary || '').split('?');
  const secondary = secondaryValue || firstSelectable(navigation[primary]) || 'audit-log';
  const params = new URLSearchParams(rawQuery);
  const hideSecondaryNav = primary === 'kit' && (
    (secondary === 'custom-home' && params.get('focus') === 'home-edit')
    || secondary === 'container-group-create'
    || secondary === 'fke-complex-page'
  );
  return { primary, secondary, hideSecondaryNav };
};

export default function App() {
  const initialRoute = resolveRoute();
  const [activePrimary, setActivePrimary] = useState<PrimaryKey>(initialRoute.primary);
  const [activeSecondary, setActiveSecondary] = useState(initialRoute.secondary);
  const [hideSecondaryNav, setHideSecondaryNav] = useState(initialRoute.hideSecondaryNav);

  const handleGoHome = useCallback(() => {
    setActivePrimary('home');
    setActiveSecondary('');
    setHideSecondaryNav(false);
    window.history.replaceState(null, '', '#home/');
  }, []);

  const handleGoSecondaryPage = useCallback(() => {
    setActivePrimary('kit');
    setActiveSecondary('secondary-page');
    setHideSecondaryNav(false);
    window.history.replaceState(null, '', '#kit/secondary-page');
  }, []);

  const handleOpenContainerCreate = useCallback(() => {
    setActivePrimary('kit');
    setActiveSecondary('fke-complex-page');
    setHideSecondaryNav(true);
    window.history.replaceState(null, '', '#kit/fke-complex-page');
  }, []);

  const page = useMemo(() => {
    if (activePrimary === 'home') {
      return <HomePage />;
    }
    if (activePrimary === 'ops' && activeSecondary === 'audit-log') return <AuditLogPage />;
    if (activePrimary === 'model' && activeSecondary === 'online-service') return <OnlineServicePage onOpenContainerCreate={handleOpenContainerCreate} />;
    if (activePrimary === 'model' && activeSecondary === 'hardware-resource') return <HardwareResourcePage />;
    if (activePrimary === 'kit' && activeSecondary === 'component-library') return <ComponentLibraryPage />;
    if (activePrimary === 'kit' && activeSecondary === 'secondary-page') return <OnlineServicePage onOpenContainerCreate={handleOpenContainerCreate} />;
    if (activePrimary === 'kit' && activeSecondary === 'container-group-create') return <ContainerGroupCreatePage onExit={handleGoSecondaryPage} />;
    if (activePrimary === 'kit' && activeSecondary === 'fke-complex-page') return <ContainerGroupCreatePage onExit={handleGoSecondaryPage} />;
    if (activePrimary === 'kit' && activeSecondary === 'custom-home') return <CustomHomePage onExit={handleGoHome} />;
    if (activePrimary === 'kit' && activeSecondary === 'detail-page') return <DetailPage />;
    if (activePrimary === 'kit' && activeSecondary === 'modal-drawer') return <ModalDrawerPage />;
    if (activePrimary === 'kit' && activeSecondary === 'tree-table') return <TreeTablePage />;
    if (activePrimary === 'kit' && activeSecondary === 'graphic-table') return <GraphicTablePage />;
    if (activePrimary === 'kit' && activeSecondary === 'hardware-resource') return <HardwareResourcePage />;
    if (activePrimary === 'kit' && activeSecondary === 'card-choice') return <CardChoicePage />;
    if (activePrimary === 'kit' && activeSecondary === 'card-choice-plain') return <CardChoicePlainPage />;
    if (activePrimary === 'kit' && activeSecondary === 'card-choice-two') return <CardChoiceTwoPage />;
    if (activePrimary === 'kit' && activeSecondary === 'normal-table') {
      return <AuditLogPage title="普通表格" showRetention={false} queryMode="simple" />;
    }
    if (activePrimary === 'kit' && activeSecondary === 'complex-table') {
      return <AuditLogPage title="复杂表格" showRetention={false} tableMode="complex" />;
    }
    if (activePrimary === 'kit' && activeSecondary === 'filter-card') return <ModelGalleryPage />;
    if (activePrimary === 'kit' && activeSecondary === 'data-visualization') return <DataVisualizationPage />;
    return <PlaceholderPage title={pageTitles[activeSecondary] || activeSecondary || '模块'} />;
  }, [activePrimary, activeSecondary, handleGoHome, handleGoSecondaryPage, handleOpenContainerCreate]);

  const handleNavigate = (primary: PrimaryKey, secondary: string) => {
    const nextSecondary = secondary || firstSelectable(navigation[primary]);
    const nextHideSecondaryNav = primary === 'kit' && nextSecondary === 'fke-complex-page';
    setActivePrimary(primary);
    setActiveSecondary(nextSecondary);
    setHideSecondaryNav(nextHideSecondaryNav);
    window.history.replaceState(null, '', `#${primary}/${nextSecondary}`);
  };

  // 当选择「模型 → 推理服务 → 在线服务」或「模型 → 资源监控 → 硬件资源」时，
  // 隐藏一级导航中的「示例」，用于截图模拟线上效果
  const hideKitModule = activePrimary === 'model' && (activeSecondary === 'hardware-resource' || activeSecondary === 'online-service');

  const handleEditHome = () => {
    setActivePrimary('kit');
    setActiveSecondary('custom-home');
    setHideSecondaryNav(true);
    window.history.replaceState(null, '', '#kit/custom-home?focus=home-edit');
  };

  return (
    <AntApp>
      <AppShell
        activePrimary={activePrimary}
        activeSecondary={activeSecondary}
        hideSecondaryNav={hideSecondaryNav}
        hideKitModule={hideKitModule}
        onEditHome={handleEditHome}
        onNavigate={handleNavigate}
      >
        {page}
      </AppShell>
    </AntApp>
  );
}
