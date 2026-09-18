/**
 * Supabase 配置体检脚本
 *
 * 用法：在项目根目录执行
 *   node scripts/verify-supabase.mjs
 *
 * 它会逐项检查 .env.local 里的配置能否真正跑通，并在失败时直接告诉你是哪一步、
 * 缺了什么东西，省得去浏览器控制台里猜。
 *
 * 注意：脚本不会打印你的 anon key，只打印格式和长度。
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const TEST_ROW_ID = '__connection_test__';

const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const dim = (text) => `\x1b[2m${text}\x1b[0m`;

let failures = 0;
let warnings = 0;

function pass(label, detail = '') {
  console.log(`${green('  ✓')} ${label}${detail ? dim(`  ${detail}`) : ''}`);
}

function fail(label, hint) {
  failures += 1;
  console.log(`${red('  ✗')} ${label}`);
  if (hint) console.log(`${dim('      → ' + hint)}`);
}

function warn(label, hint) {
  warnings += 1;
  console.log(`${yellow('  !')} ${label}`);
  if (hint) console.log(`${dim('      → ' + hint)}`);
}

console.log('\nSupabase 配置体检\n' + '='.repeat(50));

// ---------- 1. 读取 .env.local ----------
console.log('\n[1/6] 读取 .env.local');

if (!existsSync('.env.local')) {
  fail('.env.local 不存在', '在项目根目录新建这个文件，写入 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 两行');
  process.exit(1);
}

const raw = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  // 去掉可能存在的引号
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  fail('缺少 NEXT_PUBLIC_SUPABASE_URL', 'Supabase 控制台 → Project Settings → API → Project URL');
  process.exit(1);
}
if (!key) {
  fail('缺少 NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Supabase 控制台 → Project Settings → API Keys');
  process.exit(1);
}
pass('两个变量都存在');

// ---------- 2. 检查格式 ----------
console.log('\n[2/6] 检查格式');

try {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/+$/, '');

  if (parsed.protocol !== 'https:') {
    fail('Project URL 必须以 https:// 开头', `当前是 ${parsed.protocol}//，Supabase 只走 https`);
  } else if (path.includes('rest/v1')) {
    fail(
      'Project URL 多了 "/rest/v1/" 的尾巴',
      `你填的是控制台里的 "API URL" 那一栏。去掉路径，只填：${parsed.protocol}//${parsed.hostname}\n` +
        '        带上 /rest/v1 之后，SDK 拼出来的请求会变成 .../rest/v1/rest/v1/posts，全部 404'
    );
  } else if (path !== '') {
    fail(
      'Project URL 不该带路径',
      `去掉 "${path}"，只填：${parsed.protocol}//${parsed.hostname}`
    );
  } else if (!parsed.hostname.endsWith('.supabase.co')) {
    warn('Project URL 域名看起来不像 Supabase', `当前是 ${parsed.hostname}，请确认没填成别的地址`);
  } else {
    pass('Project URL 格式正确', parsed.hostname);
  }
} catch {
  fail('Project URL 不是合法网址', `当前值开头是 "${url.slice(0, 30)}..."，应该形如 https://xxxx.supabase.co`);
  process.exit(1);
}

// URL 有问题的话后面全是误导性的报错，直接停在这里
if (failures > 0) process.exit(1);

if (key.startsWith('sb_publishable_')) {
  pass('密钥是新版 publishable key', `长度 ${key.length}`);
} else if (key.split('.').length === 3) {
  pass('密钥是 JWT 格式，三段完整', `长度 ${key.length}`);
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString('utf8'));
    if (payload.role && payload.role !== 'anon') {
      warn(`这个密钥的 role 是 "${payload.role}"，不是 anon`, '不要用 service_role 密钥，它会绕过所有安全策略并且会被打进前端代码');
    }
    if (payload.ref) pass('密钥属于项目', payload.ref);
  } catch {
    warn('JWT 内容无法解析', '密钥可能是坏的，建议回 Supabase 后台重新复制一份');
  }
} else {
  fail(
    `密钥格式不对：被 "." 分成了 ${key.split('.').length} 段，JWT 必须是 3 段`,
    '这是我之前在你文档里发现过的那个问题——复制时漏了点号。请回 Supabase 后台重新完整复制一次'
  );
  process.exit(1);
}

// ---------- 3. 建立连接 ----------
console.log('\n[3/6] 建立连接');
const supabase = createClient(url, key);

// ---------- 4. 检查两张表 ----------
console.log('\n[4/6] 检查数据表');

for (const table of ['posts', 'study_logs']) {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (!error) {
    pass(`表 ${table} 可读`);
    continue;
  }
  if (error.code === '42P01' || /does not exist/i.test(error.message)) {
    fail(`表 ${table} 不存在`, '去 SQL Editor 执行 SUPABASE.md 里的建表 SQL');
  } else if (error.code === '42501' || /policy/i.test(error.message)) {
    fail(`表 ${table} 存在但没有读取权限`, 'RLS 开了但没建 select 策略，检查建表 SQL 是否完整执行');
  } else {
    fail(`读取表 ${table} 失败`, `${error.code ?? ''} ${error.message}`);
  }
}

// ---------- 5. 检查写入 ----------
console.log('\n[5/6] 检查写入权限');

const testRow = {
  id: TEST_ROW_ID,
  author: '体检脚本',
  time: '刚刚',
  text: '这是一条连接测试数据，可以删除。',
  image: 'https://placehold.co/1x1.png',
  likes: 0
};

const { error: insertError } = await supabase.from('posts').insert(testRow);

if (!insertError) {
  pass('写入成功');
  console.log(dim('      测试数据 id 是 __connection_test__，可以在 Table Editor 里手动删掉'));
} else if (insertError.code === '23505') {
  pass('写入成功（这条测试数据之前已经写过了）');
} else if (insertError.code === '42501' || /policy/i.test(insertError.message)) {
  fail('没有写入权限', 'RLS 已开启但没有 insert 策略，检查建表 SQL 是否完整执行');
} else if (insertError.code === 'PGRST204' || /column/i.test(insertError.message)) {
  fail('表结构和代码对不上', `${insertError.message} —— 建表 SQL 可能和代码里的字段不一致`);
} else {
  fail('写入失败', `${insertError.code ?? ''} ${insertError.message}`);
}

// ---------- 6. 检查 Storage ----------
console.log('\n[6/6] 检查图片存储');

// 两个坑，都踩过：
//  1. 不要用 listBuckets() 判断 bucket 在不在——anon key 没这个权限，权限不足时
//     它不报错、直接返回空数组，会把"建好了"误判成"没建"。
//  2. 不要用 upsert: true 测试。覆盖写入需要 UPDATE 策略，而我们只建了 INSERT 策略，
//     会误报成"没有上传权限"。应用代码用的是 upsert: false + 唯一文件名，不会踩到。
const testPath = `__connection_test__-${Date.now()}.txt`;

const { error: uploadError } = await supabase.storage
  .from('uploads')
  .upload(testPath, new Blob(['ok'], { type: 'text/plain' }), {
    contentType: 'text/plain',
    upsert: false
  });

if (!uploadError) {
  pass('bucket uploads 可用，上传成功');

  // 传上去还得读得回来，否则页面上的图片是裂的
  const publicUrl = supabase.storage.from('uploads').getPublicUrl(testPath).data.publicUrl;
  const res = await fetch(publicUrl);
  if (res.ok) {
    pass('上传的文件可以公开访问');
  } else {
    fail(
      `文件传上去了但公开读不到（HTTP ${res.status}）`,
      'bucket 的 Public 开关没打开。Storage 里选中 uploads → 设置里打开 Public bucket'
    );
  }

  // remove() 在没权限时会静默返回空数组、不报错，所以删完得再探一次才算数
  await supabase.storage.from('uploads').remove([testPath]);
  const gone = await fetch(publicUrl);
  if (!gone.ok) {
    pass('测试文件已清理');
  } else {
    console.log(dim('      测试文件没删掉（没有 delete 策略，属于正常）'));
    console.log(dim('      去 Storage → uploads 里手动删掉它以 __connection_test__ 开头的文件即可'));
  }
} else if (/bucket not found/i.test(uploadError.message)) {
  fail(
    '没有名为 uploads 的 bucket',
    '去 Supabase 左侧 Storage → New bucket，名字必须精确填 uploads（全小写）、并打开 Public bucket'
  );
} else if (/row-level security|policy|AccessDenied|Unauthorized/i.test(uploadError.message)) {
  fail(
    'bucket 存在，但缺少上传策略',
    '还差最后一步：给 storage.objects 加 insert 策略。\n' +
      "        SQL Editor：create policy \"public upload uploads\" on storage.objects for insert with check (bucket_id = 'uploads');\n" +
      '        界面：Storage → 选中 uploads → Policies → New policy → INSERT'
  );
} else {
  fail('上传失败', uploadError.message);
}

// ---------- 总结 ----------
console.log('\n' + '='.repeat(50));
if (failures === 0) {
  console.log(green(`\n体检通过${warnings ? `（有 ${warnings} 条提醒，看一下上面）` : ''}\n`));
  console.log('接下来：npm run dev，打开 http://localhost:3000');
  console.log('首页倒计时的秒数应该在跳；发一条带图的动态，刷新后还在。\n');
  process.exit(0);
} else {
  console.log(red(`\n有 ${failures} 项没通过，先按上面的提示修完再继续。\n`));
  process.exit(1);
}
