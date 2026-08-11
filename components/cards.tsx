import type { Post } from '@/lib/data';

export function CountdownCard({ days, hours, minutes, seconds }: { days: number; hours: string; minutes: string; seconds: string }) {
  return (
    <section className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_rgba(130,25,74,0.12)] backdrop-blur">
      <p className="text-sm font-medium tracking-[0.3em] text-blush-500">COUNTDOWN</p>
      <div className="mt-4 flex items-end gap-3">
        <span className="text-6xl font-semibold text-blush-900">{days}</span>
        <span className="pb-3 text-lg text-blush-600">天</span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-3xl bg-blush-50 p-4">
          <div className="text-2xl font-semibold text-blush-900">{hours}</div>
          <div className="mt-1 text-blush-700">小时</div>
        </div>
        <div className="rounded-3xl bg-blush-50 p-4">
          <div className="text-2xl font-semibold text-blush-900">{minutes}</div>
          <div className="mt-1 text-blush-700">分钟</div>
        </div>
        <div className="rounded-3xl bg-blush-50 p-4">
          <div className="text-2xl font-semibold text-blush-900">{seconds}</div>
          <div className="mt-1 text-blush-700">秒</div>
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft">
      <img src={post.image} alt={post.text} className="h-56 w-full object-cover" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between text-sm text-blush-700">
          <span className="font-semibold text-blush-900">{post.author}</span>
          <span>{post.time}</span>
        </div>
        <p className="leading-7 text-blush-900">{post.text}</p>
        <div className="text-sm text-blush-600">{post.likes} 人喜欢</div>
      </div>
    </article>
  );
}

export function StudyCard({ title, duration, summary, date }: { title: string; duration: string; summary: string; date: string }) {
  return (
    <article className="rounded-3xl border border-blush-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-sm text-blush-700">
        <span className="rounded-full bg-blush-50 px-3 py-1">{date}</span>
        <span>{duration}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-blush-900">{title}</h3>
      <p className="mt-2 leading-7 text-blush-800">{summary}</p>
    </article>
  );
}

export function CourseCard({ day, time, title, place }: { day: string; time: string; title: string; place: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-blush-100 bg-blush-50/70 px-4 py-3">
      <div>
        <div className="font-semibold text-blush-900">{title}</div>
        <div className="text-sm text-blush-700">{day} · {time}</div>
      </div>
      <div className="text-sm text-blush-600">{place}</div>
    </div>
  );
}
