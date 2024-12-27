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
    lastMessage: IMessage | null;
}

export interface IMessage {
    id: number;
    conversationId: number;
    sender: IProfile;
    content: string;
    sentAt: Date;
}
