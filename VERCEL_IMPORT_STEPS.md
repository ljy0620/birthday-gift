# Vercel 导入仓库一步一步操作

## 1. 打开 Vercel
访问：https://vercel.com

## 2. 登录
用你的 GitHub 账号登录。

## 3. 新建项目
点击 `New Project`。

## 4. 选择仓库
在列表里找到：
`birthday-gift`
然后点击 `Import`。

## 5. 配置环境变量
在部署页面找到 Environment Variables，添加：
- `NEXT_PUBLIC_SUPABASE_URL` = 你的 Project URL（Supabase → Project Settings → API）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 你在 Supabase 里复制的 anon key（注意要完整复制，JWT 是三段用 `.` 连接的）

## 6. 部署
点击 `Deploy`。

## 7. 验证
部署完成后，Vercel 会给你一个网址。
打开它，检查首页、动态、打卡是否正常。

## 8. 另一台电脑访问
把这个网址发给另一台电脑，直接打开即可。
