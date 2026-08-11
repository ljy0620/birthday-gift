# GitHub + Vercel 上线步骤

下面按顺序做就可以。

## 1. 初始化 Git 仓库
在项目目录打开终端，执行：
```bash
git init
git add .
git commit -m "initial birthday site"
```

## 2. 在 GitHub 新建仓库
- 打开 GitHub
- 点 New repository
- 仓库名可以填 `birthday-site`
- 不要勾选 README、.gitignore、license

## 3. 关联远程仓库
GitHub 会给你一段命令，通常类似：
```bash
git remote add origin https://github.com/你的用户名/birthday-site.git
git branch -M main
git push -u origin main
```

## 4. 在 Vercel 导入项目
- 打开 https://vercel.com
- 登录
- 点 New Project
- 选择刚才的 GitHub 仓库
- 点击 Import
- 保持默认设置
- 点击 Deploy

## 5. 部署完成后
- Vercel 会给你一个网址
- 把这个网址发给你女朋友
- 她的电脑直接打开就能访问

## 6. 以后更新网站
- 本地改代码
- `git add . && git commit -m "update site"`
- `git push`
- Vercel 会自动重新部署
