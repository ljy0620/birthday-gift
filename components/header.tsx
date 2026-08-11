import Link from 'next/link';

const nav = [
  { href: '/', label: '首页' },
  { href: '/feed', label: '日常广场' },
  { href: '/study', label: '学习打卡' },
  { href: '/schedule', label: '课程表' },
  { href: '/message', label: '留言板' },
  { href: '/about', label: '关于' }
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/70 px-5 py-4 shadow-soft backdrop-blur">
        <div>
          <p className="text-sm font-medium tracking-[0.35em] text-blush-500">OUR SPACE</p>
          <h1 className="mt-1 text-xl font-semibold text-blush-900">生日小站</h1>
        </div>
        <span className="rounded-full bg-blush-50 px-4 py-2 text-sm text-blush-700">一起收藏日常</span>
      </div>
      <nav className="flex flex-wrap gap-2 text-sm">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-white/70 bg-white/75 px-4 py-2 text-blush-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
