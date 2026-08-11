# Vercel 环境变量填写示例

在 Vercel 项目里打开 Settings -> Environment Variables，然后添加：

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | https://your-project.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | your-anon-key |

添加后重新部署即可。

# 本地 `.env.local` 示例

如果你想先在本地测试，项目根目录新建 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

保存后重启 `npm run dev`。
