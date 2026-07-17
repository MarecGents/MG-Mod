# MG-Mod

**麻瓜编辑器** — 单机版逃离塔科夫（SPTarkov）多功能 Mod

[![SPT Version](https://img.shields.io/badge/SPT-4.0.13%2B-blue)](https://dev.sp-tarkov.com/)
[![MG-Mod Version](https://img.shields.io/badge/MGMod-v0.8.5.040013-green)]()
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey)](LICENSE)

---

## 📥 下载渠道

本仓库为 **MG-Mod** 在 GitHub 的官方发布与下载渠道。

所有 Release 版本均整合了以下子项目的编译产出：

| 子项目 | 技术栈 | 职能 |
|--------|--------|------|
| [MG-Mod-CSharp](https://github.com/MarecGents/MG-Mod-CSharp) | C# (.NET 9.0) | 服务端 Mod 核心逻辑 |
| [MG-FleaMarket](https://github.com/MarecGents/MG-FleaMarket) | Python 3 | 实时跳蚤价格同步 |
| [MGModEditor](https://github.com/MarecGents/MGModEditor) | C# WPF (.NET 9.0) | 可视化配置编辑器 |

> **注意**：本仓库不包含源代码，仅为整合后 Mod 的二进制发布渠道。源码请访问上方子项目仓库。

---

## 🎮 功能概览

MG-Mod 是一款面向 **SPTarkov**（Single Player Tarkov）的图形化配置 Mod，提供五大功能分类：

### 🔫 战局系统
- AI 行为与参数配置
- 战局默认选项设置
- 资源倍率调节
- 容器随机生成

### 💰 经济系统
- 跳蚤市场优化（快速出售、100%出售、禁用黑名单等）
- 商人交易设置（回保速度/概率、购买带钩等）

### 📈 养成系统
- Scav 战局优化
- 人物基础属性（压弹速度等）
- 装备优化（武器耐久、头盔/护甲兼容、附魔）
- 堆叠优化、任务优化、藏身处设置

### 📦 容器扩容
- 自定义容器容积
- 容器兼容性设置
- 负重调节

### ✨ 特色功能
- **MG 独立商人** — 专属自定义商人
- **独立物品** — 独家装备物品
- **独立预设** — 专属装备预设
- **实时跳蚤** — 基于社区价格的动态跳蚤市场
- **钥匙分类** — 钥匙管理功能
- **子弹数据** — 弹药参数展示

---

## 🔧 使用方式

1. 前往 [Releases](../../releases) 下载最新版本
2. 将解压后的文件夹放入 `user/mods/` 目录
3. 启动游戏服务器，Mod 将自动加载
4. 使用 **MGEditor** 图形化工具进行配置

### 系统要求
- SPTarkov **4.0.11 ~ 4.0.13**
- Windows x64

---

## 📸 界面预览

MG-Mod 配备了基于 **WPF-UI** 框架的全新图形化配置界面，支持 **36 种主题配色**（18 色 × 亮/暗模式）。

详情请参阅 [ODDBA 发布帖](https://sns.oddba.cn/183236.html)。

---

## ❤️ 支持作者

如果您喜欢 MG-Mod，欢迎通过以下方式支持作者：

- [爱发电](https://ifdian.net/a/MarecGents)
- [ODDBA 社区](https://sns.oddba.cn/author/92586)

---

## 📄 许可证

本项目采用 **CC BY-NC-ND 4.0** 协议。

**这意味着：**
- ✅ 可以免费下载、使用本 Mod
- ✅ 可以分享和转载（需署名原作者）
- ❌ **禁止任何形式的商业用途**
- ❌ **禁止修改后重新发布**

保留所有版权。详见 [LICENSE](LICENSE) 文件。

---

## 🔗 相关链接

- [ODDBA 发布页](https://sns.oddba.cn/183236.html)
- [MG-Mod-CSharp（核心逻辑库）](https://github.com/MarecGents/MG-Mod-CSharp)
- [MGModEditor（配置编辑器）](https://github.com/MarecGents/MGModEditor)
- [MG-FleaMarket（实时跳蚤同步）](https://github.com/MarecGents/MG-FleaMarket)
- [MGGTMod-CSharp（独立商人 Mod）](https://github.com/MarecGents/MGGTMod-CSharp)
