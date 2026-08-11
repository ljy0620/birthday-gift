"use client";

import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '@/components/header';
import { StudyCard } from '@/components/cards';
import { studyLogs as initialLogs, type StudyLog } from '@/lib/data';
import { loadStudyLogs, saveStudyLogs } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function StudyPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setLogs(loadStudyLogs(initialLogs));
        return;
      }

      const { data } = await supabase.from('study_logs').select('*').order('created_at', { ascending: false });
      if (data?.length) {
        setLogs(data as StudyLog[]);
      }
    }

    void load();
  }, []);

  useEffect(() => {
    if (!supabase) {
      saveStudyLogs(logs);
    }
  }, [logs]);

  const canSubmit = useMemo(() => title.trim().length > 0 && summary.trim().length > 0, [title, summary]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const today = new Date();
    const date = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const nextLog: StudyLog = {
      id: String(Date.now()),
      date,
      title: title.trim(),
      duration: duration.trim() || '未记录',
      summary: summary.trim()
    };

    if (supabase) {
      const { error } = await supabase.from('study_logs').insert(nextLog);
      if (error) return;
    }

    setLogs((current) => [nextLog, ...current]);
    setTitle('');
    setDuration('');
    setSummary('');
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-blush-900">学习打卡</h1>
        <p className="mt-3 text-blush-700">记录每天的学习时长、成果和当日总结。</p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-blush-100">
          <div className="grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
              placeholder="今天学了什么"
            />
            <input
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="rounded-2xl border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
              placeholder="学习时长，例如 2h 30m"
            />
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="min-h-32 rounded-2xl border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
              placeholder="总结今天的收获"
            />
            <button type="submit" disabled={!canSubmit} className="rounded-2xl bg-blush-600 px-5 py-3 font-medium text-white transition hover:bg-blush-700 disabled:cursor-not-allowed disabled:bg-blush-300">
              保存打卡
            </button>
          </div>
        </form>

        <div className="mt-8 grid gap-4">
          {logs.map((log) => (
            <StudyCard key={log.id} {...log} />
          ))}
        </div>
      </main>
    </>
  );
}
