"use client";

import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '@/components/header';
import { PostCard } from '@/components/cards';
import { posts as initialPosts, type Post } from '@/lib/data';
import { loadPosts, savePosts } from '@/lib/storage';
import { supabase, uploadImage, withTimeout } from '@/lib/supabase';

export default function FeedPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [author, setAuthor] = useState('你');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setPosts(loadPosts(initialPosts));
        return;
      }

      try {
        const { data, error: readError } = await withTimeout(
          supabase.from('posts').select('*').order('created_at', { ascending: false }),
          '加载动态'
        );

        if (readError) {
          setLoadError(`动态没加载出来：${readError.message}`);
          return;
        }
        if (data?.length) {
          setPosts(data as Post[]);
        }
        setLoadError('');
      } catch (caught) {
        // 必须报错，不能悄悄留着一开始那几条示例数据。
        // 否则网络一断，页面看起来就像"我发的东西全没了"，但其实只是没读到。
        setLoadError(`${caught instanceof Error ? caught.message : '加载失败'}，请刷新重试`);
      }
    }

    void load();
  }, []);

  useEffect(() => {
    if (!supabase) {
      savePosts(posts);
    }
  }, [posts]);

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setError('');
    setSubmitting(true);

    try {
      let finalImage = image.trim();

      if (!finalImage && file) {
        const uploaded = await withTimeout(uploadImage(file), '图片上传');
        if (supabase && !uploaded) {
          setError('图片上传失败，请重试，或改成填写图片链接。');
          return;
        }
        finalImage = uploaded ?? preview;
      }

      if (!finalImage) {
        finalImage = 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80';
      }

      const nextPost: Post = {
        id: String(Date.now()),
        author: author.trim() || '匿名',
        time: '刚刚',
        text: text.trim(),
        image: finalImage,
        likes: 0
      };

      if (supabase) {
        const { error: insertError } = await withTimeout(
          supabase.from('posts').insert(nextPost),
          '发布'
        );

        if (insertError) {
          setError(`发布失败：${insertError.message}`);
          return;
        }
      }

      setPosts((current) => [nextPost, ...current]);
      setText('');
      setImage('');
      setFile(null);
    } catch (caught) {
      setError(`发布失败：${caught instanceof Error ? caught.message : '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-blush-900">日常广场</h1>
        <p className="mt-3 text-blush-700">在这里发布照片、文字和小片段，让彼此都能看到。</p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-blush-100">
          <div className="grid gap-4">
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
              placeholder="昵称"
            />
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-32 rounded-2xl border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
              placeholder="写下今天想记录的内容"
            />
            <input
              value={image}
              onChange={(event) => setImage(event.target.value)}
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
              placeholder="图片链接（可选）"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blush-50 file:px-4 file:py-2 file:text-blush-800"
            />
            {preview ? <img src={preview} alt="图片预览" className="max-h-64 rounded-2xl object-cover" /> : null}
            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded-2xl bg-blush-600 px-5 py-3 font-medium text-white transition hover:bg-blush-700 disabled:cursor-not-allowed disabled:bg-blush-300"
            >
              {submitting ? '发布中…' : '发布动态'}
            </button>
          </div>
        </form>

        <div className="mt-8 grid gap-4">
          {loadError ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              {loadError}
            </p>
          ) : null}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
