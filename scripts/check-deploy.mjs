/**
 * 线上部署体检
 *
 * 用法：
 *   node scripts/check-deploy.mjs https://你的站点.vercel.app
 *
 * 为什么需要它：Supabase 的环境变量是 NEXT_PUBLIC_ 前缀，会在**构建时**被烤进
 * JS 文件里。如果 Vercel 上忘了填，构建照样成功、页面照样打开，但线上版本会
 * 静默退回成本地存储——你以为同步了，其实对方的电脑上什么都看不到。
 * 这种失败在浏览器里看不出任何异常，所以只能从构建产物反查。
 */
const target = process.argv[2]?.replace(/\/+$/, '');

const green = (t) => `\x1b[32m${t}\x1b[0m`;
const red = (t) => `\x1b[31m${t}\x1b[0m`;
const dim = (t) => `\x1b[2m${t}\x1b[0m`;

let failures = 0;
const pass = (label, detail = '') => console.log(`${green('  ✓')} ${label}${detail ? dim(`  ${detail}`) : ''}`);
const fail = (label, hint) => {
  failures += 1;
  console.log(`${red('  ✗')} ${label}`);
  if (hint) console.log(dim(`      → ${hint}`));
};

if (!target) {
  console.log('用法：node scripts/check-deploy.mjs https://你的站点.vercel.app');
  process.exit(1);
}

console.log(`\n线上部署体检：${target}\n${'='.repeat(50)}`);

// ---------- 1. 站点能不能打开 ----------
console.log('\n[1/4] 站点可达性');

let html;
try {
  const res = await fetch(target, { redirect: 'follow' });
  if (!res.ok) {
    fail(`首页返回 HTTP ${res.status}`, '检查 Vercel 上的部署日志，看构建是否成功');
    process.exit(1);
  }
  html = await res.text();
  pass('首页可以打开', `HTTP ${res.status}`);
} catch (error) {
  fail(`连不上：${error.message}`);
  console.log(dim('\n      如果你在中国大陆，这大概率是 vercel.app 域名被墙，'));
  console.log(dim('      而不是部署失败。手机开热点再跑一次；还是不通就要换域名或换托管商。'));
  process.exit(1);
}

// ---------- 2. 倒计时是不是活的 ----------
console.log('\n[2/4] 首页倒计时');

// 静态预渲染的 HTML 里应该是占位符。如果这里出现了具体天数，
// 说明有人把倒计时又改成服务端计算了——那样数字会永远停在构建那一天。
// 注意窗口要够大：占位符的 "--" 出现在"小时"那一格，距 COUNTDOWN 约 320 字符。
const countdown = html.match(/COUNTDOWN[\s\S]{0,1500}?<\/section>/)?.[0] ?? '';

if (!countdown) {
  fail('首页 HTML 里找不到倒计时区块', '页面结构可能变了，检查 components/countdown.tsx 是否还在首页渲染');
} else if (countdown.includes('--')) {
  pass('倒计时是客户端渲染的，数字由浏览器实时计算');
} else {
  const days = countdown.match(/>(\d+)<\/span><span[^>]*>天/)?.[1];
  fail(
    '倒计时被烤死在 HTML 里了',
    `预渲染的 HTML 里直接写死了「${days ?? '?'} 天」，说明倒计时退回了服务端计算。\n` +
      '        数字会永远停在构建那一刻，明天打开还是今天的天数。'
  );
}

// ---------- 3. 环境变量有没有真的注进去 ----------
console.log('\n[3/4] Supabase 环境变量');

let feedHtml;
try {
  const res = await fetch(`${target}/feed`);
  feedHtml = await res.text();
} catch {
  fail('打不开 /feed 页面', '检查部署是否完整');
  process.exit(1);
}

const scripts = [...feedHtml.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);

if (scripts.length === 0) {
  fail('/feed 页面没有引用任何 JS', '部署可能不完整，重新部署一次');
} else {
  const bodies = await Promise.all(
    scripts.map(async (src) => {
      try {
        return await (await fetch(target + src)).text();
      } catch {
        return '';
      }
    })
  );

  // 必须匹配具体的项目子域名，不能只搜 "supabase.co"。
  // supabase-js 自己的代码里就写着 "*.supabase.co"（URL 白名单用的），
  // 搜泛化字符串会永远命中，环境变量没配也显示"通过"——这个假阳性我实测踩过。
  const projectUrl = /https:\/\/[a-z0-9]+\.supabase\.co/;
  const injected = bodies.some((body) => projectUrl.test(body));

  if (injected) {
    pass('Supabase 地址已注入前端代码', `${scripts.length} 个 JS 文件里找到`);
  } else {
    fail(
      '前端代码里没有 Supabase 地址',
      'Vercel 上没填环境变量，或者填了但没重新部署。\n' +
        '        现在这个线上版本写进帖子的数据只存在访问者自己的浏览器里，换台电脑看不到。\n' +
        '        修法：Vercel → Settings → Environment Variables 加上两个变量，然后 Redeploy。\n' +
        '        注意 NEXT_PUBLIC_ 变量是构建时注入的，填完必须重新部署才生效。'
    );
  }
}

// ---------- 4. 关键页面是否可访问 ----------
console.log('\n[4/4] 页面可访问性');

for (const path of ['/', '/feed', '/study', '/schedule', '/about', '/message']) {
  try {
    const res = await fetch(target + path);
    if (res.ok) pass(`${path}`, `HTTP ${res.status}`);
    else fail(`${path} 返回 HTTP ${res.status}`);
  } catch (error) {
    fail(`${path} 请求失败`, error.message);
  }
}

// ---------- 总结 ----------
console.log('\n' + '='.repeat(50));
if (failures === 0) {
  console.log(green('\n线上体检通过。\n'));
  console.log('最后一步：把网址发给你女朋友，让她用自己的网络打开，');
  console.log('在她那边发一条动态，回你这边刷新看看能不能看到。\n');
  process.exit(0);
} else {
  console.log(red(`\n有 ${failures} 项没通过，按上面的提示修完再继续。\n`));
  process.exit(1);
}
