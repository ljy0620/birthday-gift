import type { Post } from '@/lib/data';

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
