function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function getCountdownParts(target: Date) {
  const now = new Date();
  const diff = Math.max(target.getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds)
  };
}
