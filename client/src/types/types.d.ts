import { IProfile } from "./auth";

export type FetchResult<T, E> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          data: E;
      };

export interface IConversation {
    id: number;
    users: IProfile[];
    lastMessage: string | null;
}
