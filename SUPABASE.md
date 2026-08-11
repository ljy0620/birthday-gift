# Supabase 环境变量模板

把下面两项填到你的部署环境或本地 `.env.local` 里：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

# Supabase 建表 SQL

在 Supabase 的 SQL Editor 里执行：

```sql
create table if not exists public.posts (
  id text primary key,
  author text not null,
  time text not null,
  text text not null,
  image text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.study_logs (
  id text primary key,
  date text not null,
  title text not null,
  duration text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;
alter table public.study_logs enable row level security;

create policy "public read posts"
  on public.posts for select
  using (true);

create policy "public insert posts"
  on public.posts for insert
  with check (true);

create policy "public read study logs"
  on public.study_logs for select
  using (true);

create policy "public insert study logs"
  on public.study_logs for insert
  with check (true);
```

# 说明
- 这样会允许公开读取和新增，适合你们两个人一起使用的私密小站原型
- 如果你后面想加登录，可以再收紧权限
