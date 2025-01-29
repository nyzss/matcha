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
    type: string;
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

interface IUsersInteraction {
    total: number;
    users: IProfile[];
}

interface IBaseNotification {
    type: string;
    sender: IProfile;
}

interface INotificationRead extends IBaseNotification {
    read: boolean;
}

interface INotificationReadList {
    total: number;
    notifications: INotificationRead[];
}

type CustomAuthEvent = CustomEvent<{ authenticated: boolean }>;
