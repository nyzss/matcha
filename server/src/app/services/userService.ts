import {FastifyInstance} from 'fastify';
import {ORM, TableSchema} from '../types/orm';
import {userProfile, userProfileLike, userProfileSettings, userProfileView} from "../types/member";
import {NotificationType, SocketEvent} from "../types/socket";
import {deleteFile} from "../utils/mediaUtils";

export class UserService {
    private orm: ORM;
    private app: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.app = fastify;
    }

    private calculateFameRating(
        likesReceived: number,
        profileVisits: number,
        reports: number,
        blocks: number
    ): number {
        const weightLikes = 0.4;
        const weightVisits = 0.3;
        const weightLikesToVisitsRatio = 0.2;
        const weightNegativeReports = 0.05;
        const weightNegativeBlocks = 0.05;

        const likesToVisitsRatio = likesReceived / (profileVisits + 1);

        const fameRating = 10 * (
            weightLikes * likesReceived +
            weightVisits * profileVisits +
            weightLikesToVisitsRatio * likesToVisitsRatio -
            weightNegativeReports * reports -
            weightNegativeBlocks * blocks
        );

        return Math.max(0, Math.min(100, fameRating));
    }

    private async getFameRating(id: number): Promise<number> {
        const likes = await this.orm.query(
            `SELECT COUNT(id) FROM likes WHERE user_id = $1`,
            [id]
        );

        const views = await this.orm.query(
            `SELECT COUNT(id) FROM views WHERE user_id = $1`,
            [id]
        );

        const reports = await this.orm.query(
            `SELECT COUNT(id) FROM reports WHERE user_id = $1`,
            [id]
        );

        const blocks = await this.orm.query(
            `SELECT COUNT(id) FROM blocks WHERE user_id = $1`,
            [id]
        );

        return Math.round(this.calculateFameRating(
            likes?.length || 0,
            views?.length || 0,
            reports?.length || 0,
            blocks?.length || 0
        ));
    }

    async updateUserFameRating(id: number): Promise<void> {
        const fameRating = await this.getFameRating(id);

        await this.orm.query(
            `UPDATE profiles SET fame_rating = $1 WHERE user_id = $2`,
            [fameRating, id]
        );
    }

    async notifyUser(id: number, meId: number, type: string): Promise<void> {
        await this.orm.query(
            `INSERT INTO notifications (user_id, sender_id, type, read) VALUES ($1, $2, $3, false)`,
            [id, meId, type]
        )

        this.app.sendSocket(id.toString(), {
            event: SocketEvent.notificationCreate,
            data: {
                type: type,
                sender: await this.getUserById(meId),
            },
        });
    }

    async getNotifications(id: number, read: boolean = false): Promise<any> {
        const notifications = await this.orm.query(
            `SELECT sender_id, type, read FROM notifications WHERE user_id = $1`,
            [id]
        );

        if (read) {
            await this.orm.query(
                `UPDATE notifications SET read = true WHERE user_id = $1`,
                [id]
            );
        }

        const senders = await Promise.all(
            [...new Set(notifications.map((notification: { sender_id: number }) => notification.sender_id))].map(async (senderId: number) => await this.getUserById(senderId))
        );

        return {
            total: notifications.length,
            notifications: notifications.map((notification: { type: string }, index: number) => ({
                type: notification.type,
                sender: senders.find((sender: userProfile) => sender.id === notifications[index].sender_id),
                read: notifications[index].read,
            })),
        }
    }

    async reportUser(id: number, reporterId: number): Promise<void> {
        if (id === reporterId)
            throw new Error("Cannot report yourself");

        const existingReport = await this.orm.query(
            `SELECT id FROM reports WHERE user_id = $1 AND reporter_id = $2`,
            [id, reporterId]
        );

        if (existingReport.length > 0)
            throw new Error("User is already reported");

        await this.orm.query(
            `INSERT INTO reports (user_id, reporter_id) VALUES ($1, $2)`,
            [id, reporterId]
        );
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

        await this.updateUserFameRating(id);

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

        await this.updateUserFameRating(id);

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

    async getBlockedUsersId(id: number): Promise<any> {
        const blocks = await this.orm.query(
            `SELECT blocker_id FROM blocks WHERE user_id = $1`,
            [id]
        ) as { blocker_id: number }[];

        return blocks.map((block: { blocker_id: number }) => block.blocker_id);
    }

    async getBlockedByUsersId(id: number): Promise<any> {
        const blocks = await this.orm.query(
            `SELECT user_id FROM blocks WHERE blocker_id = $1`,
            [id]
        ) as { user_id: number }[];

        return blocks.map((block: { user_id: number }) => block.user_id);
    }

    async getUserById(id: number): Promise<userProfile> {
        const [user] = await this.orm.query(
            `
                SELECT
                    u.id,
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
                    p.tags,
                    p.last_connection as "lastConnection",
                    p.fame_rating as "fameRating"
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
            isOnline: this.app.userOnline(user.id.toString()),
            ...(meId ? { isConnected: await this.userConnectedTo(user.id, meId) } : {}),
            fameRating: user.fameRating,
            firstName: user.firstName,
            lastName: user.lastName,
            age: new Date().getFullYear() - new Date(user.birthDate).getFullYear(),
            gender: user.gender,
            biography: user.biography,
            sexualOrientation: user.sexualOrientation,
            pictures: user.pictures || [],
            tags: user.tags || [],
            lastConnection: user.lastConnection,
        };
    }

    async updateProfile(id: number, form: userProfileSettings): Promise<userProfile> {
        const updates: string[] = [];
        const values: any[] = [];
        let index = 1;
        
        if (form?.pictures || form?.avatar) {
            const [existingPictures] = await this.orm.query(
                `SELECT avatar, pictures FROM profiles WHERE user_id = $1`,
                [id]
            );

            const pictures = existingPictures.pictures || [];
            if (form.avatar) {
                await deleteFile(existingPictures.avatar);
            }

            for (const picture of pictures) {
                await deleteFile(picture);
            }
        }

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

    async setLike(id: number, likerId: number): Promise<userProfileLike> {
        const [existingLike] = await this.orm.query(
            `SELECT id FROM likes WHERE user_id = $1 AND liker_id = $2`,
            [id, likerId]
        );

        if (existingLike)
            throw new Error("Like already exists");

        await this.orm.query(
            `INSERT INTO likes (user_id, liker_id) VALUES ($1, $2)`,
            [id, likerId]
        );

        const likesCount = await this.orm.query(
            `SELECT COUNT(id) FROM likes WHERE user_id = $1`,
            [id]
        );

        if (await this.userConnectedTo(id, likerId))
            await this.notifyUser(id, likerId, NotificationType.connected);
        else
            await this.notifyUser(id, likerId, NotificationType.like);

        await this.updateUserFameRating(id);

        return {
            like: {
                me: true,
                count: likesCount.length,
            },
        };
    }

    async deleteLike(id: number, likerId: number): Promise<userProfileLike> {

        const isConnected = await this.userConnectedTo(id, likerId);
        const result = await this.orm.query(
            `DELETE FROM likes WHERE user_id = $1 AND liker_id = $2 RETURNING id`,
            [id, likerId]
        );

        if (result.length === 0)
            throw new Error("Like not found");

        if (isConnected)
            await this.notifyUser(id, likerId, NotificationType.unConnected);
        else
            await this.notifyUser(id, likerId, NotificationType.unLike);

        await this.orm.query(
            `DELETE FROM likes WHERE user_id = $1 AND liker_id = $2`,
            [id, likerId]
        );

        const likesCount = await this.orm.query(
            `SELECT COUNT(id) FROM likes WHERE user_id = $1`,
            [id]
        );

        await this.updateUserFameRating(id);

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
            total: views.length,
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
        };
    }

    async deleteProfileMedia(id: number, picture: string): Promise<userProfile> {
        const profile = await this.getUserById(id);

        try {
            if (profile.avatar === picture) {
                if (!(await deleteFile(picture)))
                    throw new Error("Failed to delete avatar");
                await this.orm.query(
                    `UPDATE profiles SET avatar = $2 WHERE user_id = $1`,
                    [id, process.env.DEFAULT_AVATAR_URL as string]
                );
            } else if (profile.pictures.includes(picture)) {
                if (!(await deleteFile(picture)))
                    throw new Error("Failed to delete avatar");
                profile.pictures = profile.pictures.filter((p) => p !== picture);

                if (profile.pictures.length) {
                    await this.orm.query(
                        `UPDATE profiles SET pictures = $2 WHERE user_id = $1`,
                        [id, JSON.stringify(profile.pictures)]
                    );
                } else {
                    await this.orm.query(
                        `UPDATE profiles SET pictures = NULL WHERE user_id = $1`,
                        [id]
                    );
                }
            } else {
                throw new Error("Media not found or is not yours");
            }
        } catch (error) {
            throw new Error("Media not found or is not yours");
        }

        return await this.getUserById(id);
    }
}
