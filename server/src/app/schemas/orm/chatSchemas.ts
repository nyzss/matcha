import {TableSchema} from "../../types/orm";

export const conversationSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    created_at: {
        type: 'date',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
    },
};

export const conversationParticipantSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    conversation_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'many-to-one',
            table: 'conversationSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    user_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'many-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
};

export const messageSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    conversation_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'many-to-one',
            table: 'conversationSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    sender_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'many-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    content: {
        type: 'string',
        nullable: false,
    },
    sent_at: {
        type: 'date',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
    },
};
