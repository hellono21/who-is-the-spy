
# 我是卧底 (Who is the Spy) - Offline PWA Party Game

一个现代化的、完全离线的“我是卧底”聚会游戏应用。基于 React 和 Tailwind CSS 构建，专为移动端体验设计，支持作为 PWA（渐进式 Web 应用）安装到手机，无需网络即可畅玩。

![App Screenshot](icon-192.png)

## ✨ 主要特性 (Features)

*   **📱 极致移动端体验**
    *   **PWA 支持**：可安装到 iOS 和 Android 主屏幕，体验接近原生应用。
    *   **全面屏适配**：完美适配 iPhone 刘海屏及 Android 全面屏（Safe Area Support）。
    *   **离线运行**：内置 Service Worker，无网络环境也能秒开秒玩。

*   **🧠 智能辅助**
    *   **自动推荐**：根据总人数自动计算推荐的卧底和白板人数，保证游戏平衡性。
    *   **身份提示**：为“白板”玩家提供专属的醒目提示与玩法建议。

*   **📚 丰富词库**
    *   **多分类内置词库**：包含日常、美食、科技、娱乐、儿童等多个分类，海量词汇。
    *   **自定义扩展**：支持手动输入词语，或通过 JSON URL 导入远程自定义词库。

*   **🎨 沉浸式 UI**
    *   深色模式（Dark Mode）设计，省电且护眼。
    *   流畅的卡片翻转与过场动画。
    *   直观的投票与出局结算界面。

*   **⚙️ 完整游戏流程**
    *   **配置** -> **传阅词卡** -> **发言/投票** -> **胜负判定**。
    *   支持“白板逆袭”机制（当卧底出局后，白板若猜出平民词则获胜）。

## 🛠 技术栈 (Tech Stack)

*   **Core**: React 19, TypeScript
*   **Styling**: Tailwind CSS (CDN/Configuration)
*   **PWA**: Web App Manifest, Service Worker
*   **Font**: Google Fonts (Plus Jakarta Sans, Noto Sans SC), Material Symbols
*   **No Backend**: 纯前端实现，所有逻辑运行在浏览器本地。

## 📂 项目结构 (Project Structure)

```text
/
├── index.html            # 入口文件，包含 importmap 和 Tailwind 配置
├── index.tsx             # React 挂载点
├── App.tsx               # 主应用逻辑与屏幕路由
├── types.ts              # TypeScript 类型定义
├── constants.ts          # 全局常量配置
├── manifest.json         # PWA 安装配置文件
├── sw.js                 # Service Worker 缓存逻辑
├── metadata.json         # 项目元数据
├── screens/              # 游戏各个阶段的屏幕组件
│   ├── SetupScreen.tsx     # 游戏设置与人数配置
│   ├── CategoryScreen.tsx  # 词库选择
│   ├── PassPlayScreen.tsx  # 传阅词卡
│   ├── ReadyScreen.tsx     # 发牌结束准备界面
│   ├── VotingScreen.tsx    # 投票与处决
│   └── ResultScreen.tsx    # 游戏结算
├── components/           # 通用 UI 组件 (如 Counter)
├── services/             # 业务逻辑服务 (词语生成)
├── utils/                # 工具函数 (游戏初始化、胜负判断)
└── data/                 # 本地静态词库数据
```

## 🚀 如何安装与运行

### ⚠️ 重要：PWA 图标设置
为了在 iOS 和 Chrome 上获得最佳体验，**必须**将 `icon.svg` 转换为以下两个 PNG 文件并放入根目录：

1.  `icon-192.png` (192x192 像素)
2.  `icon-512.png` (512x512 像素)

*如果没有这两个文件，应用可能无法正常安装或离线使用。*

### 在线/本地开发
该项目采用 ES Modules 和 CDN 依赖方式，无需复杂的构建步骤（如 Webpack/Vite），通过支持 HTTP 的静态服务器即可运行。

1.  将所有文件放入同一目录。
2.  确保已生成上述 PNG 图标。
3.  使用 Live Server (VS Code 插件) 或 `python3 -m http.server` 启动。
4.  在浏览器访问 `http://localhost:8000`。

### 安装到手机 (PWA)

**iOS (Safari):**
1.  在 Safari 中打开应用链接。
2.  点击底部中间的“分享”按钮。
3.  向下滚动并选择“添加到主屏幕”。

**Android (Chrome):**
1.  在 Chrome 中打开应用链接。
2.  点击右上角菜单（三个点）。
3.  选择“安装应用”或“添加到主屏幕”。

## 🎮 游戏规则说明

1.  **角色分配**：
    *   **平民**：拿到同一个词语（如“饺子”）。
    *   **卧底**：拿到与之相关的另一个词语（如“包子”）。
    *   **白板**：没有词语，只显示“你是白板”。
2.  **流程**：
    *   玩家轮流描述自己的词语（不可直接说出词语）。
    *   每轮描述后进行投票，票数最多者出局。
3.  **胜利条件**：
    *   **卧底胜利**：卧底（+白板）人数大于等于平民人数。
    *   **平民胜利**：找出所有卧底。
    *   **白板胜利**：如果在所有卧底出局时白板存活，进入“猜测阶段”。白板若猜对平民词语，则白板独赢；否则平民赢。

## 📝 自定义词库格式

如果想导入远程 JSON 词库，请确保格式如下：

```json
[
  { "civilian": "咖啡", "spy": "茶" },
  { "civilian": "猫", "spy": "狗" }
]
```

---
Made with ❤️ by Gemini
