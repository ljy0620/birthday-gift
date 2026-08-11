import { SiteHeader } from '@/components/header';

export default function MessagePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-blush-900">留言板</h1>
        <p className="mt-4 leading-8 text-blush-800">
          后续可以把这里做成留言、评论或私信模块。
        </p>
      </main>
    </>
  );
}
