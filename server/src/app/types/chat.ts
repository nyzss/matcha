import {userProfile} from "./member";

export interface messageSchema {
    id: number;
    conversationId: number;
    sender: userProfile;
    content: string;
    sentAt: Date;
}

export interface conversationSchema {
    id: number;
    users: userProfile[];
    messages?: messageSchema[];
    lastMessage?: messageSchema | null;

}