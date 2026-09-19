"use client";

import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '@/components/header';
import { StudyCard } from '@/components/cards';
import { studyLogs as initialLogs, type StudyLog } from '@/lib/data';
import { loadStudyLogs, saveStudyLogs } from '@/lib/storage';
import { supabase, withTimeout } from '@/lib/supabase';

export default function StudyPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setLogs(loadStudyLogs(initialLogs));
        return;
      }

      try {
        const { data, error: readError } = await withTimeout(
          supabase.from('study_logs').select('*').order('created_at', { ascending: false }),
          '加载打卡记录'
        );

        if (readError) {
          setLoadError(`打卡记录没加载出来：${readError.message}`);
          return;
        }
        if (data?.length) {
          setLogs(data as StudyLog[]);
        }
        setLoadError('');
      } catch (caught) {
        // 同 feed 页：读失败必须说出来，不能让人以为记录丢了
        setLoadError(`${caught instanceof Error ? caught.message : '加载失败'}，请刷新重试`);
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
  const missingFields = useMemo(
    () => [title.trim() ? '' : '今天学了什么', summary.trim() ? '' : '总结今天的收获'].filter(Boolean),
    [title, summary]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setError('');
    setSubmitting(true);

    try {
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
        const { error: insertError } = await withTimeout(
          supabase.from('study_logs').insert(nextLog),
          '保存打卡'
        );

        if (insertError) {
          setError(`保存失败：${insertError.message}`);
          return;
        }
      }

      setLogs((current) => [nextLog, ...current]);
      setTitle('');
      setDuration('');
      setSummary('');
    } catch (caught) {
      setError(`保存失败：${caught instanceof Error ? caught.message : '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
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
            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded-2xl bg-blush-600 px-5 py-3 font-medium text-white transition hover:bg-blush-700 disabled:cursor-not-allowed disabled:bg-blush-300"
            >
              {submitting ? '保存中…' : '保存打卡'}
            </button>
            {/* 按钮灰着的时候说清楚还差什么。之前这里什么都不显示，
                填了标题没填总结就会以为"页面坏了"。 */}
            {!canSubmit && !submitting ? (
              <p className="text-sm text-blush-700">
                按钮变亮才能保存，还差：{missingFields.join('、')}
              </p>
            ) : null}
          </div>
        </form>

        <div className="mt-8 grid gap-4">
          {loadError ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              {loadError}
            </p>
          ) : null}
          {logs.map((log) => (
            <StudyCard key={log.id} {...log} />
          ))}
        </div>
      </main>
    </>
  );
}
