export type LoadStatus = 'loading' | 'error' | 'ready';

// Имитация запроса к серверу до подключения backend
export function simulateRequest<T>(data: T, delayMs = 600): Promise<T> {
  const shouldFail = new URLSearchParams(window.location.search).get('mock') === 'error';
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Не удалось загрузить данные. Проверьте соединение и повторите попытку.'));
      } else {
        resolve(structuredClone(data));
      }
    }, delayMs);
  });
}
