"use client";

import { useEffect, useState } from 'react';
import { getCountdownParts } from '@/lib/time';

type Parts = ReturnType<typeof getCountdownParts>;

const placeholder: Parts = { days: 0, hours: '--', minutes: '--', seconds: '--' };

// 把 "2026-12-24" 解析成本地时间的当天零点。
// 必须在浏览器里做，服务器算出来的时间戳在别的时区会偏几个小时。
function toLocalMidnight(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0);
}

export function CountdownCard({ target }: { target: string }) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getCountdownParts(toLocalMidnight(target)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  // 首帧和服务器渲染保持一致，挂载后再由 effect 填真实数值，避免 hydration 不一致
  const { days, hours, minutes, seconds } = parts ?? placeholder;
  const reached = parts !== null && days === 0 && hours === '00' && minutes === '00' && seconds === '00';

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
      <p className="mt-5 text-sm text-blush-700">
        {reached ? '生日快乐，今天也要开开心心的' : `距离 ${target}`}
      </p>
    </section>
  );
}
