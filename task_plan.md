# 任务计划 — 头版风格改造

## 目标
将个人站头版（Hero + Navigation）的设计风格与排版改造为与参考图（XYO Network）高度相似。

## Phase 1: 基础准备
- [x] 分析参考图设计特征，记录到 findings.md
- [x] 规划整体改造方案

## Phase 2: 配色与变量替换
- [x] 修改 :root CSS 变量：--accent 从紫色 #8B5CF6 改为橙色 #F59E0B
- [x] 更新所有 --accent-dim 和紫色引用为橙色对应值
- [x] 更新 hero-bg 渐变中的紫色为橙色
- [x] 更新 Canvas 节点连线动画颜色为橙色
- [x] 更新所有 hover 状态的紫色边框为橙色

## Phase 3: 导航栏改造
- [x] 简化 Logo 区域（几何图标 + 文字）
- [x] 导航链接居中排列（grid 三栏布局）
- [x] 右侧添加橙色 CTA 按钮
- [x] 调整导航栏样式匹配参考图

## Phase 4: Hero 排版重构（核心）
- [x] 移除三栏布局
- [x] 改为居中单列布局（hero-content）
- [x] 创建超大混合色标题（白色 + 橙色交替）
- [x] 添加手写装饰字体词（Dancing Script 粉红脚本体）
- [x] 添加描述段落（居中）
- [x] 添加双 CTA 按钮（橙色主按钮 + 深色次按钮）
- [x] 移除头像圆环、统计数字、标签、跑马灯

## Phase 5: 背景与视觉效果
- [x] 重写 Canvas 粒子系统为节点连线网格
- [x] 添加中央发光球体效果（CSS 渐变模拟）
- [x] 调整背景网格为参考图风格
- [x] 移除 hero-dots、hero-back-title、hero-glow（旧）

## Phase 6: 字体与细节
- [x] 引入 Google Fonts "Dancing Script"
- [x] 调整标题字重（800）、字间距（-2px）
- [x] 按钮斜纹质感（repeating-linear-gradient）

## Phase 7: 验证与收尾
- [x] DOM 结构验证（通过 Browser 工具确认页面渲染正确）
- [x] 响应式适配检查（已添加 @media 查询）
- [x] 更新 progress.md

## 依赖
- Google Fonts: Dancing Script（已引入）
- 现有结构：React + 纯 CSS

## 风险
- 手写装饰字体已调整位置和旋转角度
- Canvas 动画性能良好（50 节点）
- 响应式已适配（移动端隐藏手写装饰）
