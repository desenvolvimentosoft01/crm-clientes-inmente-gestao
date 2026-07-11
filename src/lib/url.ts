export function normalizarUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function extrairHostname(url: string): string | null {
  try {
    return new URL(normalizarUrl(url)).hostname.toLowerCase();
  } catch {
    return null;
  }
}
