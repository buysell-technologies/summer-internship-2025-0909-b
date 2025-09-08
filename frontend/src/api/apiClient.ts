import ky, { HTTPError, type Options } from 'ky';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1234/v1';

/**
 * APIクライアントのインスタンス
 * ベースURL、認証、エラーハンドリングを設定済み
 */
const client = ky.create({
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const envToken = import.meta.env.VITE_API_AUTH_TOKEN as
          | string
          | undefined;
        const localToken = localStorage.getItem('authToken');
        const token = envToken || localToken;

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      },
    ],
  },
});

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  params?: Record<string, string | number | boolean | undefined>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Orval互換のAPIクライアント関数
 * @param config リクエスト設定
 * @param options 追加のky options
 * @returns レスポンスデータのPromise
 */
export const apiClient = <T>(
  config: ApiRequestConfig,
  options?: Options,
): Promise<T> => {
  const controller = new AbortController();

  const requestOptions: Options = {
    method: config.method,
    signal: config.signal || controller.signal,
    ...options,
  };

  if (config.headers) {
    requestOptions.headers = { ...requestOptions.headers, ...config.headers };
  }

  if (config.params) {
    const searchParams: Record<string, string> = {};
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams[key] = String(value);
      }
    });
    requestOptions.searchParams = searchParams;
  }

  if (config.data !== undefined) {
    requestOptions.json = config.data;
  }

  const url = `${baseUrl}${config.url}`;

  const promise = client(url, requestOptions)
    .json<T>()
    .catch(async (error) => {
      // HTTPErrorの場合、レスポンスボディを取得しようとする
      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json();
          throw errorData;
        } catch {
          // JSONパースに失敗した場合は元のエラーをthrow
          throw error;
        }
      }

      throw error;
    });

  // @ts-expect-error cancel is not defined in the promise type
  promise.cancel = () => {
    controller.abort();
  };

  return promise;
};

export default apiClient;
