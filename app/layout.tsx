import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我们的生日小站',
  description: '一起记录日常、学习和课程安排的小站。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
