"use client";

const postKey = 'birthday-site-posts';
const studyKey = 'birthday-site-study-logs';

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

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

function writeStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadPosts(fallback: Post[]) {
  return readStorage(postKey, fallback);
}

export function savePosts(posts: Post[]) {
  writeStorage(postKey, posts);
}

export function loadStudyLogs(fallback: StudyLog[]) {
  return readStorage(studyKey, fallback);
}

export function saveStudyLogs(logs: StudyLog[]) {
  writeStorage(studyKey, logs);
}
