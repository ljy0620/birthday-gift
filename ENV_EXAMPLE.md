# Vercel 环境变量填写示例

在 Vercel 项目里打开 Settings -> Environment Variables，然后添加：

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | https://your-project.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | 你在 Supabase 里复制的 anon key |

添加后重新部署即可。

# 本地 `.env.local` 示例

如果你想先在本地测试，项目根目录新建 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
```

保存后重启 `npm run dev`。

> 上面是占位符，真实值只在 Supabase 控制台的 Project Settings -> API 里看，
> 填进 Vercel 环境变量或本地 `.env.local`（已在 `.gitignore` 里）即可。
