import {FastifyInstance} from 'fastify';
import {ORM} from '../types/orm';
import {userProfile, userProfileLike, userProfileSettings, userProfileView} from "../types/member";
import {NotificationType, SocketEvent} from "../types/socket";

export class UserService {
    private orm: ORM;
    private app: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.app = fastify;
    }

    async notifyUser(id: number, meId: number, type: string): Promise<void> {
        await this.orm.query(
            `INSERT INTO notifications (user_id, notifier_id, type) VALUES ($1, $2, $3)`,
            [id, meId, type]
        );

        this.app.sendSocket(id.toString(), {
            event: SocketEvent.notificationCreate,
            data: {
                type: type,
                sender: await this.getUserById(meId),
            },
        });
    }

    async blockUser(id: number, blockerId: number): Promise<void> {
        if (id === blockerId)
            throw new Error("Cannot block yourself");


        const existingBlock = await this.orm.query(
            `SELECT id FROM blocks WHERE user_id = $1 AND blocker_id = $2`,
            [id, blockerId]
        );

        if (existingBlock.length > 0)
            throw new Error("User is already blocked");

        await this.orm.query(
            `INSERT INTO blocks (user_id, blocker_id) VALUES ($1, $2)`,
            [id, blockerId]
        );
    }

    async unblockUser(id: number, blockerId: number): Promise<void> {
        if (id === blockerId)
            throw new Error("Cannot unblock yourself");

        const result = await this.orm.query(
            `DELETE FROM blocks WHERE user_id = $1 AND blocker_id = $2 RETURNING id`,
            [id, blockerId]
        );

        if (result.length === 0)
            throw new Error("User is not blocked");

        await this.orm.query(
            `DELETE FROM blocks WHERE user_id = $1 AND blocker_id = $2`,
            [id, blockerId]
        );
    }

    async isBlocked(id: number, blockerId: number): Promise<boolean> {
        const block = await this.orm.query(
            `SELECT id FROM blocks WHERE user_id = $1 AND blocker_id = $2`,
            [id, blockerId]
        );

        return block.length > 0;
    }

    async getBlockedUsers(id: number): Promise<any> {
        const blocks = await this.orm.query(
            `SELECT blocker_id FROM blocks WHERE user_id = $1`,
            [id]
        );

        return {
            total: blocks.length,
            users: await Promise.all(
                blocks.map(async (block: { blocker_id: number }) => await this.getUserById(block.blocker_id))
            ),
        };
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

        if (await this.userConnectedTo(id, likedId))
            await this.notifyUser(id, likedId, NotificationType.connected);
        else
            await this.notifyUser(id, likedId, NotificationType.like);

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

        if (await this.userConnectedTo(id, likedId))
            await this.notifyUser(id, likedId, NotificationType.unConnected);
        else
            await this.notifyUser(id, likedId, NotificationType.unLike);

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

        await this.notifyUser(userId, viewerId, NotificationType.view);
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
