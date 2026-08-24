import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Modal,
  Radio,
  Tooltip,
  Typography,
} from 'antd';
import {
  BellOutlined,
  BgColorsOutlined,
  CustomerServiceOutlined,
  DownOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { contentTheme } from '../theme';
import { firstSelectable, navigation, primaryModules, type NavItem, type PrimaryKey } from '../data/navigation';

const primaryIconVersion = 'v23';
type NavTheme = 'dark' | 'light';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

type AppShellProps = {
  activePrimary: PrimaryKey;
  activeSecondary: string;
  children: ReactNode;
  onNavigate: (primary: PrimaryKey, secondary: string) => void;
};

function SecondaryNav({
  activePrimary,
  activeSecondary,
  collapsed,
  floating = false,
  style,
  panelRef,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  activePrimary: PrimaryKey;
  activeSecondary: string;
  collapsed: boolean;
  floating?: boolean;
  style?: CSSProperties;
  panelRef?: Ref<HTMLElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate: (secondary: string) => void;
}) {
  const groups = navigation[activePrimary];
  const getDefaultOpenKeys = () => groups
    .filter((item) => item.children?.length && (item.defaultOpen || item.children.some((child) => child.key === activeSecondary)))
    .map((item) => item.key);
  const [openKeys, setOpenKeys] = useState<string[]>(getDefaultOpenKeys);
  const [hoverOpen, setHoverOpen] = useState<string | null>(null);

  useEffect(() => {
    setOpenKeys(getDefaultOpenKeys());
    setHoverOpen(null);
  }, [activePrimary, activeSecondary]);

  if (!groups.length || (collapsed && !floating)) return null;

  const renderItem = (item: NavItem) => {
    const selected = item.key === activeSecondary;
    const childSelected = item.children?.some((child) => child.key === activeSecondary);
    const hasChildren = !!item.children?.length;
    const expanded = !!(hasChildren && (openKeys.includes(item.key) || hoverOpen === item.key || childSelected));
    return (
      <div
        className="subnav-group"
        key={item.key}
        onMouseEnter={() => {
          if (hasChildren && !openKeys.includes(item.key)) setHoverOpen(item.key);
        }}
        onMouseLeave={() => setHoverOpen(null)}
      >
        <button
          className={`subnav-row ${selected ? 'selected' : ''} ${childSelected ? 'parent-active' : ''}`}
          type="button"
          onClick={() => {
            if (!hasChildren) {
              onNavigate(item.key);
              return;
            }
            setOpenKeys((current) => (
              current.includes(item.key) ? current.filter((key) => key !== item.key) : [...current, item.key]
            ));
          }}
        >
          <span className="subnav-row-main">
            {item.icon}
            <span>{item.label}</span>
          </span>
          {hasChildren ? <DownOutlined className={`subnav-chevron ${expanded ? 'open' : ''}`} /> : null}
        </button>
        {expanded ? (
          <div className="subnav-children">
            {item.children?.map((child) => (
              <button
                className={`subnav-child ${child.key === activeSecondary ? 'selected' : ''}`}
                key={child.key}
                type="button"
                onClick={() => onNavigate(child.key)}
              >
                {child.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <aside
      ref={panelRef}
      className={floating ? 'floating-nav' : 'secondary-nav'}
      style={style}
      aria-label={floating ? '悬浮导航预览' : '二级导航'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {groups.map(renderItem)}
    </aside>
  );
}

export function AppShell({ activePrimary, activeSecondary, children, onNavigate }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>(() => window.localStorage.getItem('xdesign-nav-theme') === 'dark' ? 'dark' : 'light');
  const [themeDraft, setThemeDraft] = useState<NavTheme>(navTheme);
  const [themeOpen, setThemeOpen] = useState(false);
  const [flyoutPrimary, setFlyoutPrimary] = useState<PrimaryKey>(activePrimary);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutStyle, setFlyoutStyle] = useState<CSSProperties>({});
  const [flyoutAnchor, setFlyoutAnchor] = useState<{ top: number } | null>(null);
  const flyoutCloseTimer = useRef<number | null>(null);
  const flyoutRef = useRef<HTMLElement | null>(null);

  const handlePrimary = (key: PrimaryKey) => {
    setFlyoutOpen(false);
    onNavigate(key, firstSelectable(navigation[key]));
  };

  const cancelFlyoutClose = () => {
    if (flyoutCloseTimer.current) window.clearTimeout(flyoutCloseTimer.current);
    flyoutCloseTimer.current = null;
  };

  const scheduleFlyoutClose = () => {
    cancelFlyoutClose();
    flyoutCloseTimer.current = window.setTimeout(() => setFlyoutOpen(false), 140);
  };

  const previewPrimary = (key: PrimaryKey, target: HTMLButtonElement) => {
    if (!collapsed || !navigation[key]?.length) return;
    cancelFlyoutClose();
    const bodyRect = target.closest('.shell-body')?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = bodyRect ? targetRect.top - bodyRect.top : target.offsetTop;
    setFlyoutPrimary(key);
    setFlyoutAnchor({ top });
    setFlyoutStyle({ top: Math.max(8, top) });
    setFlyoutOpen(true);
  };

  useEffect(() => () => cancelFlyoutClose(), []);

  useLayoutEffect(() => {
    if (!flyoutOpen || !flyoutAnchor || !flyoutRef.current) return;
    const body = flyoutRef.current.closest('.shell-body');
    const bodyHeight = body?.getBoundingClientRect().height ?? window.innerHeight - 56;
    const panelHeight = flyoutRef.current.getBoundingClientRect().height;
    const safeGap = 8;
    const maxTop = Math.max(safeGap, bodyHeight - panelHeight - safeGap);
    const nextTop = Math.max(safeGap, Math.min(flyoutAnchor.top, maxTop));
    setFlyoutStyle({ top: nextTop });
  }, [flyoutOpen, flyoutAnchor, flyoutPrimary]);

  return (
    <div className={`app-shell nav-theme-${navTheme}${collapsed ? ' nav-collapsed' : ''}`}>
      <header className="topbar">
        <div className="brand-lockup" aria-label="FusionOne Center">
          <img className="brand-mark" src={assetPath('/assets/topbar/fusionone-mark.png')} alt="" draggable={false} />
          <img className="brand-wordmark" src={assetPath('/assets/topbar/fusionone-wordmark.svg')} alt="FusionOne Center" draggable={false} />
        </div>
        <div className="top-actions">
          <Tooltip title="界面主题">
            <Button
              type="text"
              icon={<BgColorsOutlined />}
              aria-label="切换导航主题"
              onClick={() => {
                setThemeDraft(navTheme);
                setThemeOpen(true);
              }}
            />
          </Tooltip>
          <button className="language-switch" type="button">
            中文(简体) <DownOutlined />
          </button>
          <Tooltip title="客户服务"><Button type="text" icon={<CustomerServiceOutlined />} /></Tooltip>
          <Tooltip title="快速链接"><Button type="text" icon={<LinkOutlined />} /></Tooltip>
          <Tooltip title="文档"><Button type="text" icon={<ProfileOutlined />} /></Tooltip>
          <Tooltip title="帮助"><Button type="text" icon={<QuestionCircleOutlined />} /></Tooltip>
          <Tooltip title="通知"><Button type="text" icon={<BellOutlined />} /></Tooltip>
          <Tooltip title="关于"><Button type="text" icon={<InfoCircleOutlined />} /></Tooltip>
          <Dropdown menu={{ items: [{ key: 'profile', label: '个人信息' }, { key: 'logout', label: '退出登录' }] }}>
            <button className="user-account" type="button">
              <Avatar size={32} src={assetPath('/assets/avatar/admin.svg')} />
              <span className="user-meta">
                <span className="user-name">Admin</span>
                <span className="user-role">系统管理员</span>
              </span>
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
      </header>

      <div className="shell-body">
        <aside
          className="primary-rail"
          aria-label="一级导航"
          onMouseEnter={cancelFlyoutClose}
          onMouseLeave={() => {
            if (collapsed && flyoutOpen) scheduleFlyoutClose();
          }}
        >
          <div className="rail-list">
            {primaryModules.map((item) => (
              <button
                className={`rail-item ${item.key === activePrimary ? 'active' : ''}`}
                key={item.key}
                type="button"
                onClick={() => handlePrimary(item.key)}
                onMouseEnter={(event) => previewPrimary(item.key, event.currentTarget)}
              >
                <img
                  className="rail-icon"
                  src={`/assets/primary-nav/${item.iconKey}-${item.key === activePrimary ? 'active' : navTheme === 'light' ? 'light' : 'default'}.svg?${primaryIconVersion}`}
                  alt=""
                  draggable={false}
                />
                <span className="rail-label">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="rail-collapse">
            <button
              type="button"
              onClick={() => {
                setFlyoutOpen(false);
                setCollapsed((value) => !value);
              }}
              aria-label="折叠二级导航"
            >
              <MenuFoldOutlined />
            </button>
          </div>
        </aside>

        <SecondaryNav
          activePrimary={activePrimary}
          activeSecondary={activeSecondary}
          collapsed={collapsed}
          onNavigate={(secondary) => onNavigate(activePrimary, secondary)}
        />

        {collapsed && flyoutOpen ? (
          <SecondaryNav
            activePrimary={flyoutPrimary}
            activeSecondary={flyoutPrimary === activePrimary ? activeSecondary : ''}
            collapsed={false}
            floating
            style={flyoutStyle}
            panelRef={flyoutRef}
            onMouseEnter={cancelFlyoutClose}
            onMouseLeave={scheduleFlyoutClose}
            onNavigate={(secondary) => {
              setFlyoutOpen(false);
              onNavigate(flyoutPrimary, secondary);
            }}
          />
        ) : null}

        <ConfigProvider theme={contentTheme}>
          <main className="workspace">
            <div className="workspace-inner">
              {children}
            </div>
          </main>
        </ConfigProvider>
      </div>
      <Modal
        className="theme-switch-modal"
        title="界面主题"
        open={themeOpen}
        width={520}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setThemeDraft(navTheme);
          setThemeOpen(false);
        }}
        onOk={() => {
          setNavTheme(themeDraft);
          window.localStorage.setItem('xdesign-nav-theme', themeDraft);
          setThemeOpen(false);
        }}
      >
        <Typography.Text className="theme-modal-subtitle" type="secondary">设置界面主题</Typography.Text>
        <Radio.Group className="theme-card-grid" value={themeDraft} onChange={(event) => setThemeDraft(event.target.value)}>
          {[
            { value: 'light', title: '浅色导航（默认）', description: '一级与二级导航均为浅色', preview: assetPath('/assets/theme/light-navigation.png') },
            { value: 'dark', title: '深色导航', description: '顶部与侧边导航均为深色', preview: assetPath('/assets/theme/dark-navigation.png') },
          ].map((item) => (
            <Radio key={item.value} value={item.value} className={`theme-card-option ${themeDraft === item.value ? 'selected' : ''}`}>
              <img className="theme-card-preview" src={item.preview} alt="" draggable={false} />
              <span className="theme-card-copy">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
}
