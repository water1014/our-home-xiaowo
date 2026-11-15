# 我们的小窝 · our-home

一个以私人陪伴与共同生活为核心的单文件 PWA。手机优先，可安装到主屏；默认本地保存，不依赖自建后端。

## 项目结构

- `index.html`：应用主体，单文件承载原型中的聊天、首页、生活与个人设置模块。
- `manifest.webmanifest`：PWA 安装信息。
- `sw.js`：本站静态外壳离线缓存，不缓存 API 请求或聊天数据。
- `icon.svg`：应用图标。

## 使用

将仓库部署到 GitHub Pages（Settings → Pages → Deploy from a branch → main），通过 HTTPS 打开后，在 Android Chrome 菜单中选择「安装应用」或「添加到主屏幕」。

直接用本地文件打开也可预览主体界面，但 Service Worker、安装能力和部分浏览器权限需要 HTTPS。

## 数据与隐私

原型使用的本地数据键与格式保持兼容，升级不会主动清理 localStorage。请定期使用应用内已有的数据导出功能。Service Worker 只缓存本站静态文件，不缓存 AI API 请求。
