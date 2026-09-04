# XDesign 2.1 React Starter / DemoKit

这是一套源码版 React + Ant Design Starter，用来承载 XDesign 2.1 的外壳、主题 token、业务页面模式和组件 DemoKit。

默认首屏是“运维 / 日志 / 审计日志”业务页，左侧一级导航的“组件”入口保留了 DemoKit，方便设计和前端逐个核对组件效果。

## 为什么用 React 源码版

- 复杂组件使用官方 Ant Design 源码，而不是静态 HTML 手画。
- `DatePicker.RangePicker`、`Select`、`Table`、`Modal`、`Drawer` 等组件保留官方弹层、键盘交互、语义 DOM 和可访问性行为。
- XDesign 只负责外壳、主题 token、业务布局和密度，不替代 AntD 组件内部实现。

## 当前页面

- `AppShell`：XDesign 2.1 顶栏、一级线性 SVG 导航、二级深色导航、内容区主题隔离。
- `AuditLogPage`：真实 AntD 业务页，包含查询筛选、`DatePicker.RangePicker` 时间范围、可模糊搜索输入、操作类型下拉、`Table`、分页、详情 `Drawer`。
- `ComponentLibraryPage`：按业务场景分类的组件核对页，用来沉淀后续页面可复用的组件组合。

## 本版包含的组件分类

- 总览 / 基础：`ConfigProvider`、`Button`、`Typography`、`Avatar`、`Badge`
- 框架 / 导航：`Menu`、`Tabs`、`Breadcrumb`、`Dropdown`、`Pagination`、`Steps`
- 查询筛选：`Form`、`Input`、`Select`、`DatePicker.RangePicker`、`Segmented`
- 录入控件：`InputNumber`、`Radio`、`Checkbox`、`Switch`、`Slider`、`Cascader`、`TreeSelect`、`Upload`、`Transfer`
- 数据展示：`Table`、`Descriptions`、`Card`、`Statistic`、`Tag`、`Badge`、`Timeline`、`Tree`
- 反馈 / 浮层：`Modal`、`Drawer`、`Popconfirm`、`Popover`、`Tooltip`、`Alert`、`Result`、`Spin`、`Skeleton`、`Empty`

## 本版依赖

- React `19.2.7`
- Ant Design `6.5.0`
- `@ant-design/icons` `6.3.2`
- Vite `7.3.6`

## 运行

```bash
npm install
npm run dev
```

## 验收规则

```bash
npm run typecheck
npm run build
```

关键交互需要在浏览器里检查：`DatePicker.RangePicker` 面板、`Select` 下拉、`Modal`、`Drawer`、`Table` 排序/分页。

## 和静态 HTML 的关系

`02-FusionXplay-interactive-html` 目录里的 HTML 只作为视觉参考。真实组件还原和后续平台重构应优先使用这套 React DemoKit 或正式前端工程源码。
