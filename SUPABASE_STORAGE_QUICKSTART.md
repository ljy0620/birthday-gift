# Supabase Storage 最短操作步骤

## 1. 创建 bucket
在 Supabase 控制台里：
- 进入 Storage
- 点击 New bucket
- 名字填 `uploads`
- 勾选 Public bucket
- 创建

## 2. 确认权限
如果你创建的是 public bucket，一般读取就可以直接用。
如果你后续想更严格，再加登录限制。

## 3. 在代码里已经完成的事
- 选择图片文件后会先预览
- 如果配置了 Supabase，会自动尝试上传到 `uploads`
- 上传成功后会拿到公开链接
- 公开链接会保存到动态里

## 4. 你需要检查的环境变量
```bash
NEXT_PUBLIC_SUPABASE_URL=你的Supabase地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
```

## 5. 验证方式
- 在网页里上传一张图片
- 发布动态
- 打开另一台电脑访问同一个 Vercel 链接
- 确认图片和动态都能看到
