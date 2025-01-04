import {TableSchema} from "../../types/orm";

export const userSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true
    },
    email: {
        type: 'string',
        unique: true,
        nullable: false
    },
    password: {
        type: 'string',
        nullable: false
    },
    verified: {
        type: 'boolean',
        defaultValue: false,
        nullable: false
    },
    profile_id: {
        type: 'number',
        nullable: true,
        relation: {
            type: 'one-to-one',
            table: 'profiles',
            field: 'id',
            onDelete: 'SET NULL'
        }
    }
}

export const publicUserSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false
    },
    username: {
        type: 'string',
        unique: true,
        nullable: false
    },
    avatar: {
        type: 'string',
        nullable: true
    },
    first_name: {
        type: 'string',
        nullable: true
    },
    last_name: {
        type: 'string',
        nullable: true
    },
    birth_date: {
        type: 'date',
        nullable: true
    },
    gender: {
        type: "string",
        nullable: true,
    },
    biography: {
        type: 'string',
        nullable: true,
    },
    sexual_orientation: {
        type: "string",
        nullable: true,
    },
    pictures: {
        type: 'json',
        nullable: true
    },
    tags: {
        type: 'json',
        nullable: true
    },
    likes: {
        type: 'json',
        nullable: true
    },
    last_connection: {
        type: 'date',
        nullable: true
    },
    fame_rating: {
        type: 'number',
        nullable: true
    },
    user_id: {
        type: 'number',
        nullable: true,
        relation: {
            type: 'one-to-one',
            table: 'users',
            field: 'id',
            onDelete: 'SET NULL'
        }
    }
}

export const viewSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    user_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    viewer_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    viewed_at: {
        type: 'date',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
    },
};

export const likeSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    user_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    liker_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    liked_at: {
        type: 'date',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
    },
};

export const blockSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    user_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    blocker_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    blocked_at: {
        type: 'date',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
    },
}

export const notificationSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true,
    },
    user_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    sender_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'userSchema',
            field: 'id',
            onDelete: 'CASCADE',
        },
    },
    type: {
        type: 'string',
        nullable: false,
    },
    read: {
        type: 'boolean',
        nullable: false,
        defaultValue: false,
    },
    created_at: {
        type: 'date',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
    },
}