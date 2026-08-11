"use client";

import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '@/components/header';
import { PostCard } from '@/components/cards';
import { posts as initialPosts, type Post } from '@/lib/data';
import { loadPosts, savePosts } from '@/lib/storage';
import { supabase, uploadImage } from '@/lib/supabase';

export default function FeedPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [author, setAuthor] = useState('你');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setPosts(loadPosts(initialPosts));
        return;
      }

      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (data?.length) {
        setPosts(data as Post[]);
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
    if (!canSubmit) return;

    let finalImage = image.trim();
    if (!finalImage && file) {
      finalImage = (await uploadImage(file)) ?? preview;
    }
    if (!finalImage) {
      finalImage = preview || 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80';
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
      const { error } = await supabase.from('posts').insert(nextPost);
      if (error) return;
    }

    setPosts((current) => [nextPost, ...current]);
    setText('');
    setImage('');
    setFile(null);
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
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-2xl bg-blush-600 px-5 py-3 font-medium text-white transition hover:bg-blush-700 disabled:cursor-not-allowed disabled:bg-blush-300"
            >
              发布动态
            </button>
          </div>
        </form>

        <div className="mt-8 grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
