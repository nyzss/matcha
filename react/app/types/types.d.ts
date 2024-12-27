type FetchResult<T, E> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          data: E;
      };

interface IConversation {
    id: number;
    users: IProfile[];
    lastMessage: string | null;
}
