# 生日小站部署清单

## 目标
把网站部署到公网，让你和你女朋友都能直接访问同一个链接。

## 准备工作
- 安装 Node.js
- 安装 Git
- 注册 GitHub 账号
- 注册 Vercel 账号
- 注册 Supabase 账号

## 第一步：上传到 GitHub
在项目目录执行：
```bash
git init
git add .
git commit -m "build birthday site"
```
然后在 GitHub 新建一个仓库，把本地项目推上去。

## 第二步：创建 Supabase
1. 打开 Supabase 并创建新项目
2. 复制项目 URL 和 anon key
3. 在 SQL Editor 执行 `SUPABASE.md` 里的建表 SQL

## 第三步：部署到 Vercel
1. 打开 https://vercel.com
2. 点击 New Project
3. 导入 GitHub 仓库
4. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 点击 Deploy

## 第四步：验证
- 打开 Vercel 生成的网址
- 检查首页、动态、打卡、课程表是否正常
- 在另一台电脑直接打开同一个网址测试
- 在动态和打卡页新增内容，刷新后仍然存在

## 第五步：以后更新网站
- 本地改代码
- `git add . && git commit -m "update site"`
- `git push`
- Vercel 会自动重新部署
