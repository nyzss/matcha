import fastify, { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import {RegisterForm, AuthResult, LoginForm} from "../types/auth";
import fastifyJwt, {VerifyPayloadType} from "@fastify/jwt";
import {userProfile, userProfileSettings} from "../types/member";

export class UserService {
    private orm: ORM;
    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
    }

    async getUserById(id: number): Promise<userProfile> {
        const [user] = await this.orm.query(
            `
                SELECT
                    u.id,
                    u.password,
                    p.username,
                    p.avatar,
                    p.birth_date as "birthDate",
                    p.first_name as "firstName",
                    p.last_name as "lastName",
                    p.gender,
                    p.biography,
                    p.sexual_orientation as "sexualOrientation",
                    p.pictures,
                    p.tags
                FROM profiles p
                         JOIN users u ON p.user_id = u.id
                WHERE u.id = $1
            `,
            [id]
        );

        if (!user)
            throw new Error('User not found');

        return {
            id: user.id,
            username: user.username,
            avatar: user.avatar || process.env.DEFAULT_AVATAR_URL as string,
            firstName: user.firstName,
            lastName: user.lastName,
            age: new Date().getFullYear() - new Date(user.birthDate).getFullYear(),
            gender: user.gender,
            biography: user.biography,
            sexualOrientation: user.sexualOrientation,
            pictures: user.pictures || [],
            tags: user.tags || [],
        };
    }

    async getUserByUsername(username: string): Promise<userProfile> {
        const [user] = await this.orm.query(
            `
                SELECT
                    u.id,
                    u.password,
                    p.username,
                    p.avatar,
                    p.birth_date as "birthDate",
                    p.first_name as "firstName",
                    p.last_name as "lastName",
                    p.gender,
                    p.biography,
                    p.sexual_orientation as "sexualOrientation",
                    p.pictures,
                    p.tags
                FROM profiles p
                         JOIN users u ON p.user_id = u.id
                WHERE p.username = $1
            `,
            [username]
        );

        if (!user)
            throw new Error('User not found');

        return {
            id: user.id,
            username: user.username,
            avatar: user.avatar || process.env.DEFAULT_AVATAR_URL as string,
            firstName: user.firstName,
            lastName: user.lastName,
            age: new Date().getFullYear() - new Date(user.birthDate).getFullYear(),
            gender: user.gender,
            biography: user.biography,
            sexualOrientation: user.sexualOrientation,
            pictures: user.pictures || [],
            tags: user.tags || [],
        };
    }

    async updateProfile(id: number, form: userProfileSettings): Promise<userProfile> {
        const updates: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const [key, value] of Object.entries(form)) {
            if (value !== undefined) {
                const dbKey = key === "sexualOrientation"
                    ? "sexual_orientation"
                    : key;

                if (key === "username") {
                    const [existingUser] = await this.orm.query(
                        `
                            SELECT id
                            FROM profiles
                            WHERE username = $1
                        `,
                        [value]
                    );

                    if (existingUser)
                        throw new Error("Username is already taken");
                }


                updates.push(`${dbKey} = $${index++}`);
                values.push(
                    typeof value === "object" ? JSON.stringify(value) : value
                );
            }
        }

        if (updates.length === 0) {
            throw new Error("No fields provided for update");
        }

        values.push(id);

        const query = `
        UPDATE profiles
        SET ${updates.join(", ")}
        WHERE user_id = $${index}
        RETURNING 
            username,
            avatar,
            birth_date AS "birthDate",
            first_name AS "firstName",
            last_name AS "lastName",
            gender,
            biography,
            sexual_orientation AS "sexualOrientation",
            pictures,
            tags
    `;

        const result = await this.orm.query(query, values);

        const [updatedProfile] = result;
        if (!updatedProfile) {
            throw new Error("Failed to update profile or user not found");
        }

        console.log(updatedProfile)
        return {
            id,
            username: updatedProfile.username,
            avatar: updatedProfile.avatar || process.env.DEFAULT_AVATAR_URL as string,
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            age: new Date().getFullYear() - new Date(updatedProfile.birthDate).getFullYear(),
            gender: updatedProfile.gender,
            biography: updatedProfile.biography,
            sexualOrientation: updatedProfile.sexualOrientation,
            pictures: updatedProfile.pictures || [],
            tags: updatedProfile.tags || [],
        };
    }



}
