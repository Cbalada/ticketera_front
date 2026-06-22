export function parseApiError(err: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;

  const e = err as Record<string, unknown>;

  if (e.statusCode === 404) return 'Recurso no encontrado.';

  const nested = e.error;
  if (typeof nested === 'string') return nested;
  if (nested && typeof nested === 'object') {
    const nestedObj = nested as Record<string, unknown>;
    if (typeof nestedObj.message === 'string') return nestedObj.message;
    if (Array.isArray(nestedObj.message)) return nestedObj.message.join(', ');
  }

  if (typeof e.message === 'string') return e.message;
  if (Array.isArray(e.message)) return e.message.join(', ');

  return fallback;
}
