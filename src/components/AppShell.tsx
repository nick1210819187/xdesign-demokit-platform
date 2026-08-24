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

type NavTheme = 'dark' | 'light';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const primaryIconViewBoxes: Record<string, string> = {
  home: '0 0 24 24',
  resource: '0 76 24 24',
  model: '0 152 24 24',
  app: '0 228 24 24',
  monitor: '0 304 24 24',
  ops: '0 380 24 24',
  system: '0 456 24 24',
};

function PrimaryRailIcon({ iconKey }: { iconKey: string }) {
  return (
    <svg
      className="rail-icon"
      viewBox={primaryIconViewBoxes[iconKey] ?? primaryIconViewBoxes.app}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.0293 458.098C12.4701 458.098 12.9044 458.196 13.3008 458.386L13.4678 458.473L13.4902 458.486L19.4902 462.068C19.5439 462.1 19.5921 462.139 19.6367 462.18C19.9975 462.427 20.298 462.753 20.5156 463.135C20.769 463.579 20.9021 464.082 20.9004 464.594V471.149C20.9004 472.185 20.3487 473.14 19.4551 473.66L19.4561 473.661L13.4561 477.504C13.4403 477.514 13.4245 477.524 13.4082 477.533C12.9774 477.773 12.4928 477.898 12 477.898C11.5072 477.898 11.0226 477.773 10.5918 477.533C10.5755 477.524 10.5597 477.514 10.5439 477.504L4.54395 473.661V473.66C4.11372 473.41 3.75428 473.054 3.50195 472.624C3.24017 472.178 3.10131 471.67 3.09961 471.152V464.593C3.09973 463.548 3.66096 462.584 4.56836 462.068L10.5684 458.486L10.5908 458.473C11.0307 458.227 11.5256 458.098 12.0293 458.098ZM12.0293 459.898C11.8336 459.898 11.6403 459.949 11.4678 460.045L5.49023 463.613C5.48248 463.618 5.47469 463.623 5.4668 463.627C5.11724 463.822 4.90051 464.191 4.90039 464.593V471.146L4.91016 471.296C4.93023 471.443 4.9796 471.585 5.05469 471.713C5.12974 471.841 5.22869 471.951 5.34473 472.037L5.46582 472.116L5.51465 472.146L11.4746 475.963C11.6368 476.051 11.817 476.098 12 476.098C12.1827 476.098 12.3624 476.051 12.5244 475.963L18.4854 472.146L18.5332 472.116C18.8823 471.922 19.0996 471.552 19.0996 471.149V464.59C19.1006 464.391 19.0494 464.197 18.9521 464.026C18.8549 463.856 18.7159 463.716 18.5498 463.62C18.4989 463.591 18.4523 463.556 18.4092 463.519L12.5908 460.045L12.458 459.981C12.3216 459.927 12.1762 459.898 12.0293 459.898ZM12 464.098C13.0343 464.098 14.0264 464.509 14.7578 465.24C15.4892 465.972 15.9004 466.964 15.9004 467.998C15.9004 469.032 15.4892 470.024 14.7578 470.756C14.0264 471.487 13.0343 471.898 12 471.898C10.9657 471.898 9.97358 471.487 9.24219 470.756C8.5108 470.024 8.09961 469.032 8.09961 467.998C8.09961 466.964 8.5108 465.972 9.24219 465.24C9.97358 464.509 10.9657 464.098 12 464.098ZM12 465.898C11.443 465.898 10.9085 466.119 10.5146 466.513C10.1208 466.907 9.90039 467.441 9.90039 467.998C9.90039 468.555 10.1208 469.09 10.5146 469.483C10.9085 469.877 11.443 470.098 12 470.098C12.557 470.098 13.0915 469.877 13.4854 469.483C13.8792 469.09 14.0996 468.555 14.0996 467.998C14.0996 467.441 13.8792 466.907 13.4854 466.513C13.0915 466.119 12.557 465.898 12 465.898Z" fill="currentColor" />
      <path d="M15.2207 381.602C16.3408 381.602 17.4043 381.858 18.3516 382.314C18.6144 382.441 18.7992 382.688 18.8477 382.976C18.896 383.264 18.802 383.558 18.5947 383.764L16.9932 385.354C16.4246 385.918 16.4246 386.832 16.9932 387.396C17.5655 387.964 18.4961 387.965 19.0684 387.396L20.4941 385.98L20.5801 385.905C20.79 385.744 21.063 385.682 21.3252 385.74C21.6247 385.807 21.8697 386.023 21.9746 386.312C22.2502 387.07 22.4004 387.887 22.4004 388.736C22.4003 392.683 19.1795 395.87 15.2207 395.87C14.4869 395.87 13.7779 395.759 13.1094 395.555L7.16895 401.453C5.89495 402.718 3.83257 402.718 2.55859 401.453C1.28117 400.185 1.28121 398.126 2.55859 396.857L8.42383 391.032C8.17714 390.311 8.04201 389.539 8.04199 388.736C8.04199 384.79 11.262 381.602 15.2207 381.602ZM15.2207 383.402C12.2439 383.403 9.8418 385.796 9.8418 388.736C9.84181 389.505 10.0047 390.233 10.2979 390.891C10.4501 391.232 10.3756 391.632 10.1104 391.896L3.82617 398.135C3.25812 398.699 3.2581 399.611 3.82617 400.176C4.39823 400.744 5.32919 400.744 5.90137 400.176L12.2402 393.882L12.3408 393.795C12.5888 393.613 12.9174 393.568 13.209 393.685C13.8291 393.933 14.5076 394.07 15.2207 394.07C18.1976 394.07 20.5995 391.676 20.5996 388.736C20.5996 388.631 20.5949 388.526 20.5889 388.422L20.3359 388.674C19.0617 389.939 16.9987 389.939 15.7246 388.674C14.447 387.405 14.447 385.345 15.7246 384.076L16.2939 383.51C15.9475 383.44 15.5886 383.402 15.2207 383.402Z" fill="currentColor" />
      <path d="M19.6504 307C20.8927 307 21.9002 308.008 21.9004 309.25V320.051C21.9002 321.293 20.8927 322.301 19.6504 322.301H14.7002V323.2H16.5C16.9971 323.2 17.4004 323.604 17.4004 324.101C17.4003 324.598 16.997 325 16.5 325H7.5C7.00301 325 6.59971 324.598 6.59961 324.101C6.59961 323.604 7.00294 323.2 7.5 323.2H9.2998V322.301H4.34961C3.10728 322.301 2.09982 321.293 2.09961 320.051V309.25C2.09982 308.008 3.10728 307 4.34961 307H19.6504ZM11.0996 322.301V323.2H12.9004V322.301H11.0996ZM4.34961 308.801C4.10139 308.801 3.9006 309.002 3.90039 309.25V320.051C3.9006 320.299 4.10139 320.5 4.34961 320.5H19.6504C19.8986 320.5 20.0994 320.299 20.0996 320.051V316.018C20.09 316.506 19.6912 316.899 19.2002 316.899H17.4004C17.1617 316.899 16.9325 316.805 16.7637 316.636L15.9932 315.865L14.6543 319.884C14.5302 320.256 14.1785 320.505 13.7861 320.499C13.3941 320.493 13.0513 320.234 12.9385 319.858L10.9785 313.325L10.1357 315.434C9.99905 315.775 9.66779 316 9.2998 316H5.7002C5.20317 316 4.79985 315.597 4.7998 315.1C4.7998 314.603 5.20314 314.199 5.7002 314.199H8.69141L10.2646 310.266L10.3271 310.139C10.4948 309.857 10.806 309.685 11.1406 309.7C11.5227 309.717 11.8519 309.975 11.9619 310.341L13.8447 316.617L14.7461 313.915L14.79 313.808C14.9071 313.566 15.1279 313.386 15.3936 313.323C15.6971 313.252 16.0158 313.343 16.2363 313.563L17.7725 315.1H19.2002C19.6911 315.1 20.0898 315.493 20.0996 315.981V309.25C20.0994 309.002 19.8986 308.801 19.6504 308.801H4.34961Z" fill="currentColor" />
      <path d="M9.0752 240.898C10.1936 240.898 11.1006 241.805 11.1006 242.924V246.974C11.1006 248.092 10.1936 248.999 9.0752 248.999H5.02539C3.90701 248.999 3 248.092 3 246.974V242.924C3 241.805 3.90701 240.898 5.02539 240.898H9.0752ZM18.9746 240.898C20.093 240.898 21 241.805 21 242.924V246.974C21 248.092 20.093 248.999 18.9746 248.999H14.9248C13.8064 248.999 12.8994 248.092 12.8994 246.974V242.924C12.8994 241.805 13.8064 240.898 14.9248 240.898H18.9746ZM5.02539 242.699C4.90113 242.699 4.80078 242.8 4.80078 242.924V246.974C4.80078 247.098 4.90113 247.199 5.02539 247.199H9.0752C9.19946 247.199 9.30078 247.098 9.30078 246.974V242.924C9.30078 242.8 9.19946 242.699 9.0752 242.699H5.02539ZM14.9248 242.699C14.8005 242.699 14.7002 242.8 14.7002 242.924V246.974C14.7002 247.098 14.8005 247.199 14.9248 247.199H18.9746C19.0989 247.199 19.2002 247.098 19.2002 246.974V242.924C19.2002 242.8 19.0989 242.699 18.9746 242.699H14.9248ZM9.0752 231C10.1936 231 11.1006 231.907 11.1006 233.025V237.075C11.1006 238.194 10.1936 239.101 9.0752 239.101H5.02539C3.90701 239.101 3 238.194 3 237.075V233.025C3 231.907 3.90701 231 5.02539 231H9.0752ZM18.9746 231C20.093 231 21 231.907 21 233.025V237.075C21 238.194 20.093 239.101 18.9746 239.101H14.9248C13.8064 239.101 12.8994 238.194 12.8994 237.075V233.025C12.8994 231.907 13.8064 231 14.9248 231H18.9746ZM5.02539 232.801C4.90113 232.801 4.80078 232.901 4.80078 233.025V237.075C4.80078 237.199 4.90113 237.301 5.02539 237.301H9.0752C9.19946 237.301 9.30078 237.199 9.30078 237.075V233.025C9.30078 232.901 9.19946 232.801 9.0752 232.801H5.02539ZM14.9248 232.801C14.8005 232.801 14.7002 232.901 14.7002 233.025V237.075C14.7002 237.199 14.8005 237.301 14.9248 237.301H18.9746C19.0989 237.301 19.2002 237.199 19.2002 237.075V233.025C19.2002 232.901 19.0989 232.801 18.9746 232.801H14.9248Z" fill="currentColor" />
      <path d="M11.668 154.166C11.917 154.067 12.1997 154.083 12.4375 154.215L20.5371 158.715C20.5442 158.719 20.5507 158.723 20.5576 158.728C20.5791 158.74 20.5998 158.754 20.6201 158.769C20.6317 158.777 20.6431 158.785 20.6543 158.794C20.6718 158.808 20.6887 158.822 20.7051 158.837C20.7157 158.847 20.7262 158.856 20.7363 158.866C20.7587 158.889 20.7799 158.912 20.7998 158.937C20.8084 158.947 20.8161 158.959 20.8242 158.97C20.8373 158.987 20.8496 159.006 20.8613 159.024C20.8685 159.036 20.8762 159.047 20.8828 159.059C20.9181 159.121 20.9451 159.188 20.9648 159.258C20.9668 159.265 20.9689 159.271 20.9707 159.278C20.9769 159.302 20.9812 159.327 20.9854 159.352C20.988 159.367 20.9913 159.383 20.9932 159.398C20.9971 159.432 21 159.467 21 159.502V168.502C21 168.829 20.8227 169.13 20.5371 169.289L12.4375 173.789C12.4364 173.79 12.4347 173.789 12.4336 173.79C12.402 173.807 12.3696 173.823 12.3359 173.837C12.3314 173.839 12.3268 173.84 12.3223 173.842C12.2927 173.853 12.2624 173.863 12.2314 173.871C12.2266 173.872 12.2217 173.874 12.2168 173.875C12.1854 173.883 12.1536 173.889 12.1211 173.894C12.1172 173.894 12.1133 173.895 12.1094 173.896C12.0744 173.9 12.039 173.901 12.0029 173.901L12 173.902C11.9626 173.902 11.9258 173.9 11.8896 173.896C11.8874 173.895 11.8851 173.895 11.8828 173.895C11.8475 173.89 11.8132 173.883 11.7793 173.874C11.777 173.873 11.7748 173.873 11.7725 173.872C11.6973 173.852 11.6258 173.824 11.5596 173.787L3.46289 169.289C3.17737 169.13 3 168.829 3 168.502V159.502C3.00001 159.467 3.00195 159.432 3.00586 159.398C3.00768 159.383 3.01103 159.367 3.01367 159.352C3.01785 159.327 3.02217 159.302 3.02832 159.278C3.03009 159.271 3.03225 159.265 3.03418 159.258C3.05387 159.188 3.0812 159.121 3.11621 159.06C3.16472 158.974 3.22815 158.896 3.30273 158.83C3.31444 158.82 3.32565 158.809 3.33789 158.799C3.3533 158.786 3.36944 158.775 3.38574 158.764C3.39883 158.755 3.41219 158.746 3.42578 158.737C3.43803 158.73 3.45021 158.722 3.46289 158.715L11.5635 154.215L11.668 154.166ZM4.80078 167.972L11.0996 171.471V164.531L4.80078 161.032V167.972ZM12.9004 164.531V171.471L19.2002 167.972V161.031L12.9004 164.531ZM5.75391 159.502L12 162.972L18.2461 159.502L12 156.031L5.75391 159.502Z" fill="currentColor" />
      <path d="M3.1123 90.1631C3.35374 89.7287 3.90246 89.5721 4.33691 89.8135L11.999 94.0703L19.6621 89.8135C20.0964 89.5722 20.6442 89.729 20.8857 90.1631C21.1269 90.5975 20.9705 91.1464 20.5361 91.3877L12.4365 95.8877C12.1649 96.0384 11.8341 96.0384 11.5625 95.8877L3.46191 91.3877C3.02768 91.1463 2.8713 90.5975 3.1123 90.1631ZM3.1123 86.5615C3.35374 86.1271 3.90246 85.9706 4.33691 86.2119L11.999 90.4688L19.6621 86.2119C20.0964 85.9706 20.6442 86.1274 20.8857 86.5615C21.1269 86.996 20.9705 87.5448 20.5361 87.7861L12.4365 92.2861C12.1649 92.4368 11.8341 92.4369 11.5625 92.2861L3.46191 87.7861C3.02768 87.5448 2.8713 86.9959 3.1123 86.5615ZM11.668 78.0645C11.917 77.9654 12.1997 77.9812 12.4375 78.1133L20.5371 82.6133C20.8228 82.772 21 83.0735 21 83.4004C21 83.7272 20.8228 84.0288 20.5371 84.1875L12.4375 88.6875C12.1658 88.8383 11.8352 88.8383 11.5635 88.6875L3.46289 84.1875C3.17731 84.0288 3.00004 83.7271 3 83.4004C3 83.0736 3.17733 82.7721 3.46289 82.6133L11.5635 78.1133L11.668 78.0645ZM5.75391 83.4004L12 86.8701L18.2461 83.4004L12 79.9297L5.75391 83.4004Z" fill="currentColor" />
      <path d="M11.4492 2.23828C11.7958 1.96966 12.293 1.9889 12.6182 2.2959L18.8232 8.15625C18.8903 8.20424 18.9504 8.26103 19.002 8.3252L20.7188 9.94629C21.0795 10.2874 21.0954 10.8565 20.7549 11.2178C20.4137 11.5791 19.8438 11.596 19.4824 11.2549L19.2002 10.9883V20.0488C19.1999 20.5457 18.7967 20.9482 18.2998 20.9482H13.7998C13.3032 20.9479 12.9007 20.5454 12.9004 20.0488V15.5488H11.1006V20.0488C11.1003 20.5457 10.6971 20.9482 10.2002 20.9482H5.7002C5.20341 20.9481 4.80007 20.5456 4.7998 20.0488V10.9883L4.51855 11.2549C4.15718 11.5961 3.58736 11.5791 3.24609 11.2178C2.9051 10.8565 2.92123 10.2875 3.28223 9.94629L4.99805 8.3252C5.04956 8.26104 5.10979 8.20425 5.17676 8.15625L11.3828 2.2959L11.4492 2.23828ZM6.60059 9.28711V19.1484H9.2998V14.6484C9.29993 14.1516 9.70332 13.7491 10.2002 13.749H13.7998C14.2968 13.749 14.7001 14.1515 14.7002 14.6484V19.1484H17.4004V9.28809L12 4.1875L6.60059 9.28711Z" fill="currentColor" />
    </svg>
  );
}

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
                <PrimaryRailIcon iconKey={item.iconKey} />
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
