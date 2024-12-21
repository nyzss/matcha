import fastify, { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import {RegisterForm, AuthResult, LoginForm} from "../types/auth";
import fastifyJwt, {VerifyPayloadType} from "@fastify/jwt";
import {userProfile, userProfileSettings, userProfileLike, userProfileView} from "../types/member";

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

    async getUserByUsername(username: string, meId: number | null = null): Promise<userProfile> {
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
            ...(meId ? { isConnected: await this.userConnectedTo(user.id, meId) } : {}),
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

    // async setLike(id: number, likedId: number): Promise<void> {
    //     await this.orm.query(
    //         `
    //             INSERT INTO likes (user_id, liked_id)
    //             VALUES ($1, $2)
    //         `,
    //         [id, likedId]
    //     );
    //
    //     return;
    // }

    async setLike(id: number, likedId: number): Promise<userProfileLike> {
        const [existingLike] = await this.orm.query(
            `SELECT id FROM likes WHERE user_id = $1 AND liker_id = $2`,
            [id, likedId]
        );

        if (existingLike)
            throw new Error("Like already exists");

        await this.orm.query(
            `INSERT INTO likes (user_id, liker_id) VALUES ($1, $2)`,
            [id, likedId]
        );

        const likesCount = await this.orm.query(
            `SELECT COUNT(id) FROM likes WHERE user_id = $1`,
            [id]
        );
        
        return {
            like: {
                me: true,
                count: likesCount.length,
            },
        };
    }

    async deleteLike(id: number, likedId: number): Promise<userProfileLike> {
        const result = await this.orm.query(
            `DELETE FROM likes WHERE user_id = $1 AND liker_id = $2 RETURNING id`,
            [id, likedId]
        );

        if (result.length === 0)
            throw new Error("Like not found");

        await this.orm.query(
            `DELETE FROM likes WHERE user_id = $1 AND liker_id = $2`,
            [id, likedId]
        );

        const likesCount = await this.orm.query(
            `SELECT COUNT(id) FROM likes WHERE user_id = $1`,
            [id]
        );

        return {
            like: {
                me: false,
                count: likesCount.length - 1,
            },
        }
    }

    async userConnectedTo(id: number, meId: number): Promise<boolean> {
        const likes = await Promise.all([
            this.getLike(id, meId),
            this.getLike(meId, id),
        ])

        return likes.every((like) => like.like.me);
    }


    async getLike(id: number, meId: number): Promise<userProfileLike> {
        const likes = await this.orm.query(
            `SELECT liker_id FROM likes WHERE user_id = $1`,
            [id]
        );

        const hasLiked = likes.some((like: { liker_id: number }) => like.liker_id === meId);

        return {
            like: {
                me: hasLiked,
                count: likes.length,
            },
        };
    }

    async addView(viewerId: number, userId: number): Promise<void> {
        const existingView = await this.orm.query(
            `SELECT id FROM views WHERE viewer_id = $1 AND user_id = $2`,
            [viewerId, userId]
        );

        if (existingView.length > 0) await this.orm.query(
            `UPDATE views SET viewed_at = CURRENT_TIMESTAMP WHERE viewer_id = $1 AND user_id = $2`,
            [viewerId, userId]
        );
        else await this.orm.query(
            `INSERT INTO views (user_id, viewer_id, viewed_at) VALUES ($1, $2, CURRENT_TIMESTAMP)`,
            [userId, viewerId]
        );
    }

    async getViews(userId: number): Promise<userProfileView> {
        const views = await this.orm.query(
            `SELECT v.viewer_id, p.username, p.avatar, p.first_name AS "firstName", p.last_name AS "lastName", p.birth_date AS "birthDate", p.gender, p.biography, p.sexual_orientation AS "sexualOrientation", p.pictures, p.tags
            FROM views v
            JOIN profiles p ON v.viewer_id = p.user_id
            WHERE v.user_id = $1 AND v.viewed_at > CURRENT_TIMESTAMP - INTERVAL '30 days'`,
            [userId]
        );

        return {
            users: views.map((view: any) => ({
                id: view.viewer_id,
                username: view.username,
                avatar: view.avatar,
                firstName: view.firstName,
                lastName: view.lastName,
                age: new Date().getFullYear() - new Date(view.birthDate).getFullYear(),
                gender: view.gender,
                biography: view.biography,
                sexualOrientation: view.sexualOrientation,
                pictures: view.pictures || [],
                tags: view.tags || [],
            })),
            view: {
                count: views.length,
            },
        };
    }
}
