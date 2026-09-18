import { CourseCard } from '@/components/cards';
import { SiteHeader } from '@/components/header';
import { courses } from '@/lib/data';

export default function SchedulePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-blush-900">课程表</h1>
        <p className="mt-3 text-blush-700">按周查看课程安排，后续可以扩展成可编辑版本。</p>
        <div className="mt-8 grid gap-3">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </main>
    </>
  );
}
