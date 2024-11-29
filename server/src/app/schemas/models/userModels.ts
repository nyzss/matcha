import {TableSchema} from "../../types/orm";



export const userModels: TableSchema = {
    id: {
        type: 'number',
        primary: true
    },
    username: {
        type: 'string',
        nullable: true
    },
    email: {
        type: 'string',
        unique: true,
        nullable: false
    },
    firstName: {
        type: 'string',
        nullable: true
    },
    lastName: {
        type: 'string',
        nullable: true
    },
    password: {
        type: 'string',
        nullable: false
    },
    created_at: {
        type: 'date',
        defaultValue: new Date()
    }
}