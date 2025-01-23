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
    read: boolean;
}

type TMessageHistory = {
    total: number;
    messages: IMessage[];
};

interface ISuggestionProfile {
    id: number;
    username: string;
    avatar: string | null;
    biography: string | null;
    city: string | null;
    country: string;
    distance: string;
    fameRating: number;
    tags: string[];
    age: number;
    firstName: string;
    lastName: string;
}
