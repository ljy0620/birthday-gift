import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * 给 Supabase 请求套一个超时。
 *
 * 为什么需要：走梯子访问时连接经常是"半死不活"的——不报错，也不返回，就那么挂着。
 * 表现出来就是按钮一直卡在"发布中…"，看着像网站坏了。套上超时之后会明确报
 * "超时"，至少能看出是网络问题，而不是以为数据丢了、或者反复点按钮。
 *
 * 注意用的是 Promise.race 而不是 abortSignal：supabase-js 各个版本的
 * abortSignal 支持程度不一致，race 对所有调用方式都成立，不会因为 SDK
 * 版本差异在构建时才炸。
 */
export const REQUEST_TIMEOUT_MS = 15000;

export function withTimeout<T>(request: PromiseLike<T>, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label}超时（${REQUEST_TIMEOUT_MS / 1000} 秒没有响应）`));
    }, REQUEST_TIMEOUT_MS);

    Promise.resolve(request).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    );
  });
}

export async function uploadImage(file: File) {
  if (!supabase) return null;

  const extension = file.name.split('.').pop() || 'jpg';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from('uploads').upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) return null;

  const { data } = supabase.storage.from('uploads').getPublicUrl(path);
  return data.publicUrl;
}
