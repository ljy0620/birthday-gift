import { CountdownCard, CourseCard, PostCard, StudyCard } from '@/components/cards';
import { SiteHeader } from '@/components/header';
import { countdownTarget, courses, posts, studyLogs } from '@/lib/data';
import { getCountdownParts } from '@/lib/time';

export default function HomePage() {
  const countdown = getCountdownParts(countdownTarget);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.5rem] border border-white/70 bg-white/70 p-8 shadow-[0_24px_60px_rgba(130,25,74,0.12)] backdrop-blur">
            <p className="text-sm font-medium tracking-[0.35em] text-blush-500">FOR US</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-blush-900 sm:text-5xl lg:text-6xl">
              把每天都变成值得收藏的礼物
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blush-800">
              这个小站记录我们的照片、文字、学习成果和课程安排，让每一天都能被温柔地保存下来。
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-blush-700">
              <span className="rounded-full bg-blush-50 px-4 py-2">日常分享</span>
              <span className="rounded-full bg-blush-50 px-4 py-2">学习打卡</span>
              <span className="rounded-full bg-blush-50 px-4 py-2">课程表</span>
              <span className="rounded-full bg-blush-50 px-4 py-2">生日倒计时</span>
            </div>
          </div>
          <CountdownCard {...countdown} />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium tracking-[0.3em] text-blush-500">FEED</p>
                <h2 className="mt-1 text-2xl font-semibold text-blush-900">最新动态</h2>
              </div>
              <span className="text-sm text-blush-600">日常分享</span>
            </div>
            <div className="grid gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-soft backdrop-blur">
              <p className="text-sm font-medium tracking-[0.3em] text-blush-500">STUDY</p>
              <h2 className="mt-1 text-2xl font-semibold text-blush-900">今日学习成果</h2>
              <div className="mt-4 grid gap-4">
                {studyLogs.map((log) => (
                  <StudyCard key={log.id} {...log} />
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-soft backdrop-blur">
              <p className="text-sm font-medium tracking-[0.3em] text-blush-500">SCHEDULE</p>
              <h2 className="mt-1 text-2xl font-semibold text-blush-900">课程表</h2>
              <div className="mt-4 grid gap-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
