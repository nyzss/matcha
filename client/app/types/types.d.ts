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
    lastMessage: IMessage | null;
}

interface IMessage {
    id: number;
    conversationId: string;
    sender: IProfile;
    content: string;
    sentAt: Date;
}

type TMessageHistory = {
    total: number;
    messages: IMessage[];
};
