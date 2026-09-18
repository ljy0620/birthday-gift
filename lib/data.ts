export type Post = {
  id: string;
  author: string;
  time: string;
  text: string;
  image: string;
  likes: number;
  created_at?: string;
};

export type StudyLog = {
  id: string;
  date: string;
  title: string;
  duration: string;
  summary: string;
  created_at?: string;
};

export type CourseItem = {
  id: string;
  day: string;
  time: string;
  title: string;
  place: string;
};

// 只存年月日，具体时刻由浏览器解析成访问者本地的零点
export const countdownTarget = '2026-12-24';

export const posts: Post[] = [
  {
    id: '1',
    author: '你',
    time: '今天 09:20',
    text: '早餐后散步时拍到了一片很亮的天空，想把这些小瞬间都留给你看。',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    likes: 128
  },
  {
    id: '2',
    author: '她',
    time: '昨天 21:10',
    text: '今天把课程复习完了，也把明天的计划写好了。',
    image: 'https://images.unsplash.com/photo-1518621736915-df7f1f5f2cc0?auto=format&fit=crop&w=1200&q=80',
    likes: 96
  }
];

export const studyLogs: StudyLog[] = [
  {
    id: '1',
    date: '08-11',
    title: '英语词汇 + 前端复习',
    duration: '2h 10m',
    summary: '完成 2 个章节的笔记整理和 50 个单词复习。'
  },
  {
    id: '2',
    date: '08-10',
    title: '数学题目整理',
    duration: '1h 40m',
    summary: '把错题本重新分类，并总结了高频题型。'
  }
];

export const courses: CourseItem[] = [
  { id: '1', day: '周一', time: '08:00 - 09:40', title: '高等数学', place: '教学楼 A-302' },
  { id: '2', day: '周三', time: '14:00 - 15:40', title: '英语听力', place: '语言中心 201' },
  { id: '3', day: '周五', time: '19:00 - 20:30', title: '前端实践', place: '线上教室' }
];
