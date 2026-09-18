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

# Storage 上传策略 SQL

**这一步不能省。** 上面的建表 SQL 只覆盖了两张表，没有覆盖 Storage。
公开 bucket 只能让所有人**读取**，**上传仍然需要单独的策略**——不加这段，
代码里的图片上传会一直失败（而且以前是静默失败，现在会显示红字报错）。

**第 1 步，建 bucket：只能在 Storage 界面里建。**
Storage → New bucket → 名字精确填 `uploads`（全小写）→ 打开 Public bucket。

> 不要用 SQL 的 `insert into storage.buckets ...` 来建。实测会报
> `Backend error! Retry your query.`——Supabase 挡掉了从 SQL Editor 直接写
> `storage` schema 的操作。

**第 2 步，建上传策略：** SQL Editor 执行——

```sql
create policy "public upload uploads"
  on storage.objects for insert
  with check (bucket_id = 'uploads');
```

**第 3 步，验证：** 跑体检脚本，六项全绿才算通：

```bash
node scripts/verify-supabase.mjs
```

# 两个容易踩的坑

- **不要用 `upsert: true` 上传。** 覆盖写入走的是 `INSERT ... ON CONFLICT DO UPDATE`，
  需要额外的 UPDATE 策略，而我们只建了 INSERT 策略，会报
  `new row violates row-level security policy`。应用代码用的是
  `upsert: false` + 带时间戳的唯一文件名，不会踩到。
- **不要用 `listBuckets()` 判断 bucket 存不存在。** anon key 没有列 bucket 的权限，
  权限不足时它**不报错、直接返回空数组**，会把"建好了"误判成"没建"。
  唯一可靠的办法是真的传一个文件，从报错内容反推：报 `Bucket not found` 才是真的没建。

# 说明
- 这样会允许公开读取和新增，适合你们两个人一起使用的私密小站原型
- 如果你后面想加登录，可以再收紧权限
- **数据库密码（`database_password.md`）不要提交到仓库**，已在 `.gitignore` 里挡掉
