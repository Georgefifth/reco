# ReCo 改进计划 (PLAN.md)

> 给接手的 AI：这是 ReCo 项目的完整改进计划。项目已有一个可运行的 MVP
> （Next.js 16 + IndexedDB + Ollama 本地 AI），位于 `/home/yap/Hack/Humanity/reco`。
> 截止时间：**2026-09-04 23:45 EDT**。按优先级从上到下执行。

---

## 当前状态

已完成的功能：
- 3 步 onboarding 引导
- SCAT-5 22 项每日症状打卡 + 趋势图
- Berlin 共识 6 阶段 Return-to-Play 协议追踪
- Ollama 本地 AI 日记陪伴（流式输出）
- 红旗症状检测 + 急诊警告
- 隐私中心（导出/删除/隐私政策）
- 响应式设计 + 明暗模式 + 无障碍

目标赛道：脑震荡恢复、Responsible AI（$8,676 大奖）、AI/ML、心理健康、设计、创新、Render

第二轮状态（2026-09-03）：Daily Check-in 已重构为 4 组渐进流程；已加入恢复背景、模式洞察和可打印恢复报告。鉴于正式 SCAT6 数字化重排需要授权，产品文案不再声称复刻官方 SCAT，仅描述为 22 个常见脑震荡症状领域的自我观察工具。

第三轮状态（2026-09-03）：已重构首次访问页面，并加入一键本地 Sample Recovery。评委无需手动 onboarding 即可看到 9 天症状趋势、认知评估、恢复阶段、日记和模式洞察。已新增 `FLOW_VIDEO_PLAN.md`，采用 Google Flow 短片段 + 真实产品录屏的混合制作方案。

---

## 竞品调研发现

### 同类脑震荡恢复项目（Devpost 上）
- **NeuroPace AI**：AI 认知节奏追踪 + 眼动康复训练（HTML Canvas）+ 暗色低蓝光 UI + Google Gemini API + LocalStorage
- **NeuroGuard AI**：认知+物理测试追踪恢复，AI 对比个人基线检测异常变化，摄像头分析平衡评估
- **Concussion Tracker**：症状图表 + 医生/家长/教练共享 + Return to Exercise 功能
- **WHOOP Brain**：WHOOP 生物指标 + ML 推荐最佳活动水平（基于"主动恢复优于完全休息"研究）

### 隐私优先健康 AI（获奖项目）
- **HealthGuard**（Akash 黑客松第一名）：Venice AI 零数据留存 + AES-256 加密 + 60 秒 TTL 删除原始数据 + 不可变审计日志
- **Asclepius**（HackPrinceton 最佳整体）：本地隐私层拦截 PHI，三阶段管道（Safe Harbor 去标识→神经路由分类→本地回答），差分隐私
- **Gemma Health Edge**：8 阶段安全管道，100+ 正则紧急检测器，多语言问候过滤，PubMed 研究注入

### 认知评估工具（真实产品）
- **SCAT6 Web**：官方 SCAT-6 网页版，本地存储，Google Drive 同步
- **ConcussionCare Plus**：反应时间测试 + Trail Making Test A + 1-Back 工作记忆，全部浏览器端
- **OCTAL（牛津）**：经验证的认知电池，2 个任务 5 分钟即可检测认知障碍（AUC=0.92）
- **VOR Eye Rehab**：前庭眼动康复，自适应难度，症状驱动调整，语音指导，节拍器

### Return-to-Learn 研究
- 17%-73% 学生在返校时获得学业调整但很多没有
- 有脑震荡政策的学校更容易提供调整
- 需要医疗信件 + 定期随访
- RTL 应在受伤后 48 小时内开始
- 症状驱动的个性化调整是关键

---

## 评审标准（从评审指南 PDF 摘要）

### 脑震荡恢复赛道
1. **临床与领域有效性** — 是否基于循证指南？（Berlin 共识、Living Guidelines、PedsConcussion）
2. **安全与负责任设计** — 是否安全传达建议、避免伤害、承认局限性、不替代专业医疗？
3. **神经科学理解** — 是否体现对脑震荡病理的理解？
4. **研究基础** — 是否引用具体研究/共识声明？
5. **技术复杂度**
6. **UX 与可访问性**

### Responsible AI 赛道
- 技术复杂度
- **数据安全与责任** — 严格的隐私和数据安全措施

### 所有提交
- **创新与新颖性**
- **UI/UX 与可访问性**

---

## 改进任务（按优先级排序）

### P0 — 必须做（直接影响评审得分）

> 状态（2026-09-03）：P0 四项均已实现并通过 lint、生产构建和浏览器验证。

#### 1. 添加认知评估测试 [DONE]（打脑震荡赛道的"技术复杂度"和"神经科学理解"）
**为什么**：当前只有主观症状自评。竞品 NeuroGuard AI 和 ConcussionCare Plus 都有客观认知测试。这是区分"日记 app"和"恢复工具"的关键。

**做什么**：在 `/assess` 新页面添加 3 个浏览器端认知测试：
- **反应时间测试**：屏幕变绿时尽快点击，测 5 次取平均。用 `performance.now()` 精确计时。参考 ConcussionCare Plus。
- **数字倒背（Digits Backward）**：SCAT-6 标准组件。显示 3-6 位数字序列，用户倒序输入。
- **1-Back 工作记忆**：连续显示字母，用户判断当前字母是否与前一个相同。30 次试验。

**数据**：存 IndexedDB 新 store `assessments`，含测试类型、分数、反应时间、日期。
**趋势**：在评估页面显示各测试的历史趋势图。
**文件**：
- `src/lib/types.ts` — 加 `CognitiveAssessment` 类型
- `src/lib/db.ts` — 加 assessments store + CRUD
- `src/app/assess/page.tsx` — 测试选择 + 执行 + 结果
- `src/components/cognitive/ReactionTimeTest.tsx`
- `src/components/cognitive/DigitsBackwardTest.tsx`
- `src/components/cognitive/OneBackTest.tsx`

#### 2. 添加 Return-to-Learn 协议（打"临床有效性"和"创新"）[DONE]
**为什么**：当前只有 Return-to-Play（运动员场景）。但大量脑震荡患者是学生。RTL 是研究热点且比赛合作方有多个大学 Synapse 分会。

**做什么**：在 protocol 页面添加 RTL 标签页（与 RTP 并列）：
- 4 阶段 RTL 协议（基于 Bevilacqua & McPherson 模型）：
  1. 日常活动（在家）— 短时间阅读/屏幕，症状驱动
  2. 学校活动（在家）— 轻量学习，增加认知负荷
  3. 半天到校 — 50% 课程，调整安排
  4. 全天到校 — 正常课程，持续调整
- 症状驱动的学业调整建议生成器：
  - 头痛→减少屏幕时间、延长考试时间
  - 脑雾→分拆任务、减少多任务
  - 光敏→降低亮度、戴帽子、调座位
  - 注意力差→安静环境、频繁休息
- 可导出给学校的调整信（PDF 或可打印 HTML）

**文件**：
- `src/lib/symptoms.ts` — 加 `RTL_STAGES` 数组 + `ACCOMMODATIONS` 映射
- `src/app/protocol/page.tsx` — 加 tab 切换 RTP/RTL
- `src/components/AccommodationLetter.tsx` — 可打印的调整信

#### 3. 强化 AI 安全管道（打 Responsible AI 的"数据安全与责任"）[DONE]
**为什么**：当前 AI 只有一个 system prompt。获奖项目（Gemma Health Edge 的 8 阶段管道、HealthGuard 的 100+ 正则紧急检测）都有多层安全。

**做什么**：在 `src/lib/ollama.ts` 添加预推理安全层：
- **紧急检测器**：正则匹配自杀意念、严重红旗症状关键词→不调用 LLM，直接返回紧急资源（911、988 危机热线）
- **PHI 脱敏**（可选）：发送给 LLM 前移除明显个人信息模式（邮箱、电话、地址）
- **回复后安全检查**：检测 LLM 回复中的危险建议（"停止服药"、"不需要看医生"等）→替换为安全提示
- **审计日志**：记录每次 AI 交互的安全检查结果（不含原文），存 IndexedDB

**文件**：
- `src/lib/safety.ts`（新）— 紧急检测正则 + 回复安全检查
- `src/lib/ollama.ts` — 集成安全管道
- `src/lib/types.ts` — 加 `SafetyLog` 类型
- `src/lib/db.ts` — 加 safetylogs store
- `src/app/privacy/page.tsx` — 展示安全管道流程图 + 审计日志

#### 4. 添加研究引用与证据基础页面（打"研究基础"和"神经科学理解"）[DONE]
**为什么**：评审明确看是否引用具体研究。当前只在 README 提了 Berlin 共识，app 内没有。

**做什么**：新建 `/evidence` 页面：
- 列出所有引用的循证指南（带链接）：
  - Berlin 共识声明（2016/2022）— 第 6 届国际脑震荡会议
  - CDC HEADS UP
  - Living Concussion Guidelines
  - PedsConcussion Living Guideline（儿童）
  - Leddy 2019 研究（亚阈值有氧运动加速恢复）
  - RTL 系统综述（BJSM 2019）
- 每个功能标注其证据来源（"SCAT-5 症状清单→Berlin 共识""RTP 6 阶段→CDC HEADS UP"）
- 神经科学简明解释：脑震荡的病理、为什么需要认知休息、为什么亚阈值运动有帮助、恢复的非线性特征
- 明确的局限性声明

**文件**：
- `src/app/evidence/page.tsx`（新）
- `src/lib/research.ts`（新）— 研究引用数据
- `src/components/Nav.tsx` — 加 Evidence 导航项

### P1 — 应该做（显著提升竞争力）

#### 5. 症状触发器追踪与模式识别
**为什么**：VOR Eye Rehab 和 WHOOP Brain 都做模式识别。帮助用户发现"每次看屏幕 30 分钟后头痛加重"这类关联。

**做什么**：
- check-in 添加可选字段：屏幕时间（小时）、睡眠时长、水摄入量、活动类型
- 在首页/趋势页面显示症状与触发因子的相关性分析（简单统计，不用 ML）
- AI 日记自动注入最近的触发因子数据

**文件**：
- `src/lib/types.ts` — `SymptomCheckIn` 加 `triggers` 字段
- `src/app/checkin/page.tsx` — 加触发因子输入
- `src/lib/patterns.ts`（新）— 简单相关性计算
- `src/app/page.tsx` — 首页加"模式洞察"卡片

#### 6. 可导出的临床报告
**为什么**：Concussion Tracker 的核心功能是"给医生看"。VOR Eye Rehab 也有"导出给治疗师"。

**做什么**：
- 在隐私中心或新建 `/report` 页面
- 生成可打印的 PDF/HTML 报告：症状趋势图 + 认知测试结果 + 当前协议阶段 + 红旗事件历史
- 包含受伤日期、恢复天数、症状评分趋势
- 可给临床医生参考（明确标注"非诊断工具"）

**文件**：
- `src/app/report/page.tsx`（新）
- `src/lib/report.ts`（新）— 报告数据聚合
- 用浏览器 `window.print()` + 打印样式 CSS

#### 7. 眼动/前庭康复练习（打"技术复杂度"和"创新"）
**为什么**：NeuroPace AI 和 VOR Eye Rehab 都有这个。是脑震荡恢复的主动干预，不只是被动追踪。

**做什么**：在 `/rehab` 新页面添加 2-3 个简单的 Canvas 眼动练习：
- **平滑追踪**：一个圆点在屏幕上缓慢移动，用户用眼睛跟随
- **扫视（Saccades）**：两个目标交替闪烁，用户快速切换注视
- **VOR x1**：盯着中心点，缓慢左右转头（用设备陀螺仪或手动触发）

每个练习前后做症状评分，记录是否症状加重。自适应难度（症状加重→降低速度/减少时长）。

**文件**：
- `src/app/rehab/page.tsx`（新）
- `src/components/rehab/SmoothPursuit.tsx`
- `src/components/rehab/SaccadeExercise.tsx`
- `src/lib/types.ts` — 加 `RehabSession` 类型

#### 8. 多语言紧急号码检测
**为什么**：Gemma Health Edge 做了多语言紧急号码。当前只硬编码 911。

**做什么**：
- 根据 `navigator.language` 或用户选择的国家，显示对应的紧急号码
- 美国 911、英国 999、欧盟 112、澳洲 000、日本 119
- 在红旗警告和 AI 安全回复中使用

**文件**：
- `src/lib/emergency.ts`（新）
- onboarding 添加国家选择
- 各处红旗警告使用动态号码

### P2 — 锦上添花（时间允许的话）

#### 9. PWA 离线支持
**为什么**：Gemma Health Edge 和 MediLocal 都强调离线可用。隐私故事更强（不需要网络）。

**做什么**：
- 添加 `manifest.json`
- Service Worker 缓存所有静态资源
- 可安装到主屏幕

**文件**：
- `public/manifest.json`
- `src/app/layout.tsx` — 加 manifest link
- 用 `next-pwa` 或手写 SW

#### 10. 数据加密
**为什么**：HealthGuard 用 AES-256-GCM 加密本地数据。当前 IndexedDB 是明文。

**做什么**：
- 用 Web Crypto API 加密敏感字段（日记内容、症状备注）
- 密码派生自用户 PIN（不存储）
- 隐私中心展示加密状态

**注意**：这会增加复杂度，确保不破坏现有数据流。

#### 11. 可访问性深度优化（打"UI/UX 与可访问性"）
**做什么**：
- 所有交互元素添加 `aria-label` 和 `role`
- 确保键盘导航完整（Tab 顺序、焦点可见）
- 颜色对比度检查（WCAG AA）
- 屏幕阅读器测试
- 添加 `skip to content` 链接
- 表单错误提示用 `aria-live`

#### 12. 动画与微交互打磨（打"设计"）
**做什么**：
- 页面切换淡入动画
- 保存成功的 toast 通知
- 趋势图动画
- 协议阶段前进的庆祝动画
- 用 `framer-motion` 或 CSS transitions

### P3 — 如果还有时间

#### 13. 照顾者模式
- 多角色：患者/家长/教练/医生
- 共享视图（本地导出→分享）
- 医生视角的概览仪表盘

#### 14. 主动恢复运动建议
- 基于 Leddy 2019 研究
- 根据当前阶段和症状推荐亚阈值有氧运动
- 心率目标计算（基于年龄最大心率百分比）

#### 15. 睡眠追踪集成
- 简单的睡眠日记
- 睡眠质量与症状的关联分析

---

## 执行建议

### 时间分配（假设还有 ~8 小时）
1. **P0.1 认知测试** — 2 小时（最高 ROI）
2. **P0.2 Return-to-Learn** — 1.5 小时
3. **P0.4 证据页面** — 1 小时
4. **P0.3 AI 安全管道** — 1.5 小时
5. **P1.6 临床报告导出** — 1 小时
6. **P1.5 触发因子追踪** — 1 小时

### 关键提醒
- **不要破坏现有功能** — 改之前先读现有代码
- **保持隐私故事一致** — 所有新功能必须本地优先
- **Next.js 16 特殊性** — `params` 是 Promise、`output: 'export'` 已移除、Turbopack 是默认
- **构建验证** — 每次改完跑 `npm run build` 确认无错误
- **Ollama 在跑** — `ollama serve` + `qwen2.5:7b` 模型可用
- **dev server** — `npm run dev` 在 localhost:3000，`allowedDevOrigins` 已配置
- **提交要求** — GitHub repo + 4 分钟视频（脚本在 `VIDEO_SCRIPT.md`）

### 技术栈参考
- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4
- IndexedDB via `idb` 包
- Recharts 图表
- Ollama 本地 LLM
- lucide-react 图标
- 所有页面都是 Client Components（`"use client"`）

### 文件结构
```
src/
  app/
    layout.tsx, page.tsx (首页)
    onboarding/page.tsx
    checkin/page.tsx
    journal/page.tsx
    protocol/page.tsx
    privacy/page.tsx
    [新] assess/page.tsx
    [新] evidence/page.tsx
    [新] report/page.tsx
    [新] rehab/page.tsx
  components/
    Nav.tsx, AppShell.tsx
    [新] cognitive/ 目录
    [新] rehab/ 目录
    [新] AccommodationLetter.tsx
  lib/
    types.ts, db.ts, symptoms.ts, ollama.ts, utils.ts
    [新] safety.ts, research.ts, patterns.ts, report.ts, emergency.ts
```
