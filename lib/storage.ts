"use client";

import type { Post, StudyLog } from '@/lib/data';

const postKey = 'birthday-site-posts';
const studyKey = 'birthday-site-study-logs';

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
