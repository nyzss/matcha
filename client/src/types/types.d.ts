export type FetchResult<T, E> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          data: E;
      };
