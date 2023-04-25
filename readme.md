<div align='center'>

# VueModules

</div>

### 封装了一些业务系统中常用的页面，例如用户管理、登录页面、字典管理

## 📦 Install
### 初始化时，全局安装
```bash
pnpm install
```

### 安装全局依赖
```bash
pnpm install third_module -w
```
### 安装项目依赖
```bash
pnpm install third_module -r --filter @monorepo/module_name
```

## 🤹‍♀️ Usage
ps: module为文件夹名

### 开发模式
```bash
npm run dev:module
```
### 编译指令
```bash
npm run build:module
```