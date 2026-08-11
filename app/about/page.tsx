import { SiteHeader } from '@/components/header';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-blush-900">关于这个小站</h1>
        <p className="mt-4 leading-8 text-blush-800">
          这是一个给两个人一起使用的生日礼物网站原型，可以记录日常、学习和课程安排，也可以继续扩展成真正的私密空间。
        </p>
      </main>
    </>
  );
}
