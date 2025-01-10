import { TableSchema } from "../../types/orm";

export const reSearchSchema: TableSchema = {
    id: {
        type: 'number',
        primary: true,
        nullable: false,
        autoIncrement: true
    },
    age_min: {
        type: 'number',
        nullable: true
    },
    age_max: {
        type: 'number',
        nullable: true
    },
    fame_rating_min: {
        type: 'number',
        nullable: true
    },
    fame_rating_max: {
        type: 'number',
        nullable: true
    },
    location: {
        type: 'number',
        nullable: true
    },
    tags: {
        type: 'json',
        nullable: true
    },
    user_id: {
        type: 'number',
        nullable: false,
        relation: {
            type: 'one-to-one',
            table: 'users',
            field: 'id',
            onDelete: 'CASCADE'
        }
    },
};
