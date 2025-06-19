# Habitly
基于[Tauri](https://v2.tauri.app/) 和 [Next.js] 开发的简单习惯跟踪 App


## 参考图
![design-reference.png](docs/design-reference.png)

## 实现预览

![home](docs/home.jpg)

![home](docs/add.jpg)

![home](docs/detail.jpg)

## 开发调试

```shell
git clone https://github.com/hanzhichao/habitly.git 
cd habitly
pnpm install
pnpm tauri dev
```

## 构建方法

```shell
pnpm tauri android build --apk
```

## 参考
- 效果图来至： https://appalchemy.ai/
- 初始代码：v0:  https://v0.dev/chat/habitly-app-creation-oSxeXBXhPcA
- SQLite教程： https://www.runoob.com/sqlite/sqlite-date-time.html
- Calendar样式： https://daypicker.dev/docs/styling
- date-fns文档： https://date-fns.org/docs/I18n
- Tailwind颜色：  https://ui.shadcn.com/colors
- Motion文档： https://motion.dev/
