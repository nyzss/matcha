import {FastifyInstance} from 'fastify';
import {ORM, TableSchema} from '../types/orm';
import {FilterOptions, MatchStatus, ResearchOptions} from "../types/research";
import {LocalisationService} from "./localisationService";
import {UserService} from "./userService";
import {NotificationType} from "../types/socket";
import { userProfile } from '../types/member';


export class ResearchService {
    private orm: ORM;
    private localisationService: LocalisationService;
    private userService: UserService;
    private app: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.app = fastify;
        this.localisationService = new LocalisationService(fastify);
        this.userService = new UserService(fastify);
    }

    async getUserResearch(userId: number): Promise<ResearchOptions> {
        const [research] = await this.orm.query(
            `SELECT * FROM research 
            WHERE user_id = $1`,
            [userId]
        );

        if (!research)
            return {
                ageMax: null,
                ageMin: 18,
                fameRatingMax: null,
                fameRatingMin: 0,
                location: 10,
                tags: []
            }

        return {
            ageMax: research.age_max,
            ageMin: research.age_min,
            fameRatingMax: research.fame_rating_max,
            fameRatingMin: research.fame_rating_min,
            location: research.location,
            tags: research.tags
        };
    }

    async updateUserResearch(userId: number, options: ResearchOptions) {
        const {ageMax, ageMin, fameRatingMax, fameRatingMin, location, tags} = options;

        //update or create

        let [research] = await this.orm.query(
            `SELECT * FROM research 
            WHERE user_id = $1`,
            [userId]
        );

        if (!research) {
            await this.orm.query(
                `INSERT INTO research (user_id, age_min, age_max, fame_rating_min, fame_rating_max, location, tags)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [userId, ageMin, ageMax, fameRatingMin, fameRatingMax, location, JSON.stringify(tags)]
            );
        } else {
            if (research.age_max === ageMax && research.age_min === ageMin && research.fame_rating_max === fameRatingMax && research.fame_rating_min === fameRatingMin && research.location === location && JSON.stringify(research.tags) === JSON.stringify(tags))
                throw new Error("No changes detected");

            await this.orm.query(
                `UPDATE research
                SET age_min = $1, age_max = $2, fame_rating_min = $3, fame_rating_max = $4, location = $5, tags = $6
                WHERE user_id = $7`,
                [ageMin, ageMax, fameRatingMin, fameRatingMax, location, JSON.stringify(tags), userId]
            );
        }

        return {
            ageMax,
            ageMin,
            fameRatingMax,
            fameRatingMin,
            location,
            tags
        }
    }

    async getAlreadyMatchedUsersId(userId: number) {
        const researchMatches = await this.orm.query(
            `SELECT * FROM research_matches
            WHERE author_id = $1`,
            [userId]
        )  || [];

            const mutualLikes = await this.orm.query(
            `SELECT DISTINCT l1.user_id as connected_user_id
            FROM likes l1 
            JOIN likes l2 ON l1.user_id = l2.liker_id AND l1.liker_id = l2.user_id
            WHERE l1.liker_id = $1`,
            [userId]
            ) || [];


        const matchedIds = [
            ...researchMatches.map((match: { target_id: number }) => match.target_id),
            ...mutualLikes.map((like: { connected_user_id: number }) => like.connected_user_id)
        ];

        return [...new Set(matchedIds)];
    }

    async getUsersNotWantingToBeMatched(userId: number) {
        const users = await this.orm.query(
            `SELECT * FROM research_matches
            WHERE author_id = $1 AND type = $2`,
            [userId, MatchStatus.DECLINED]
        ) || [];

        return users.map((user: any) => user.target_id);
    }

    async getSuggestions(userId: number, filter: FilterOptions | null = null): Promise<{ users: any[], total: number }> {
        const profile = await this.userService.getUserById(userId);
        
        if (!profile) {
            throw new Error("User not found");
        }
    
        const research: ResearchOptions = await this.getUserResearch(userId);
        const userLocation: locate | null = await this.localisationService.getUserLocation(userId);
    
        if (!userLocation) {
            return { users: [], total: 0 };
        }
    
        const nearbyUsers = await this.localisationService.getNearbyLatAndLon(userLocation.lat, userLocation.lon, research.location);
        
        if (!nearbyUsers) {
            return { users: [], total: 0 };
        }
    
        const blockedUsers = await this.userService.getBlockedUsersId(userId);
        const reportedUsers = await this.userService.getBlockedByUsersId(userId);
        const matchedUsers = await this.getAlreadyMatchedUsersId(userId);
        const declinedUsers = await this.getUsersNotWantingToBeMatched(userId);


        const isMatch = (user: userProfile, profile: userProfile) => {
            const { gender: userGender, sexualOrientation: userOrientation } = user;
            const { gender: profileGender, sexualOrientation: profileOrientation } = profile;

            if (userOrientation === "Neither" || profileOrientation === "Neither") {
                return userOrientation === "Neither" && profileOrientation === "Neither";
            }

            if (userOrientation === "Both") {
                if (profileOrientation === "Both") {
                    return true;
                }
                if (profileOrientation === "Man") {
                    return userGender === "Man";
                }
                if (profileOrientation === "Woman") {
                    return userGender === "Woman";
                }
            }

            if (userGender === "Man") {
                if (userOrientation === "Woman") {
                    return profileGender === "Woman" && 
                            (profileOrientation === "Man" || profileOrientation === "Both");
                }
                if (userOrientation === "Man") {
                    return profileGender === "Man" && 
                            (profileOrientation === "Man" || profileOrientation === "Both");
                }
            }

            if (userGender === "Woman") {
                if (userOrientation === "Man") {
                    return profileGender === "Man" && 
                            (profileOrientation === "Woman" || profileOrientation === "Both");
                }
                if (userOrientation === "Woman") {
                    return profileGender === "Woman" && 
                            (profileOrientation === "Woman" || profileOrientation === "Both");
                }
            }

            if (userGender === "Beyond Binary") {
                if (userOrientation === "Man") {
                    return profileGender === "Man" && 
                            (profileOrientation === "Both" || profileOrientation === "Other");
                }
                if (userOrientation === "Woman") {
                    return profileGender === "Woman" && 
                            (profileOrientation === "Both" || profileOrientation === "Other");
                }
                if (userOrientation === "Both") {
                    return profileOrientation === "Both" || profileOrientation === "Other";
                }
            }

            if (userOrientation === "Other" || profileOrientation === "Other") {
                return true;
            }

            return false;
        };


        const users = nearbyUsers
        .filter((user: userProfile) => user.id !== userId)
        .filter((user: any) => {
    
            const isAgeMatch = user.age >= research.ageMin && user.age <= (research.ageMax || research.ageMin);
            const isFameMatch = user.fameRating >= research.fameRatingMin && user.fameRating <= (research.fameRatingMax || research.fameRatingMin);
            const areTagsMatch = !research.tags.length || research.tags.some(tag => user.tags && user.tags.includes(tag));
    
            return isAgeMatch && isFameMatch && areTagsMatch && isMatch(user, profile);
        }).filter((user: any) => !blockedUsers.includes(user.id) && !reportedUsers.includes(user.id) && !matchedUsers.includes(user.id) && !declinedUsers.includes(user.id));
        
        const filteredUsers = users.filter((user: any) => {
            const matchesAge = filter?.age ? user.age === filter.age : true;
            const matchesFameRating = filter?.fameRating ? user.fameRating === filter.fameRating : true;
            const matchesLocation = filter?.location ? user.distance <= filter.location : true;
            const matchesTags = filter?.tags ? filter.tags.every(tag => user.tags?.includes(tag)) : true;
            return matchesAge && matchesFameRating && matchesLocation && matchesTags;
        });
    
        const sortedUsers = filter?.sort
            ? [...filteredUsers].sort((a, b) => {
                const field = filter.sort?.field;
                const order = filter.sort?.order === "desc" ? -1 : 1;
    
                if (field === "age") {
                    return (a.age - b.age) * order;
                } else if (field === "location") {
                    return (a.distance - b.distance) * order;
                } else if (field === "fame_rating") {
                    return (a.fameRating - b.fameRating) * order;
                } else if (field === "common_tags") {
                    const aTags = a.tags?.length || 0;
                    const bTags = b.tags?.length || 0;
                    return (aTags - bTags) * order;
                }
                return 0;
            })
            : filteredUsers;
    
        return {
            users: sortedUsers.map((user: any) => ({
                id: user.id,
                avatar: user.avatar,
                username: user.username,
                age: user.age,
                fameRating: user.fameRating,
                distance: user.distance,
                city: user.location.city,
                country: user.location.country,
                tags: user.tags || [],
                biography: user.biography,
                firstName: user.firstName,
                lastName: user.lastName
            })),
            total: sortedUsers.length
        };
    }
    
    
    

    async acceptSuggestion(userId: number, targetId: number) {
        const suggestion = (await this.getSuggestions(userId))
            .users.find(user => user.id === targetId);

        if (!suggestion)
            throw new Error("User not found in suggestions");

        const alreadyMatched = await this.orm.query(
            `SELECT * FROM research_matches 
            WHERE author_id = $1 AND target_id = $2`,
            [userId, targetId]
        );

        if (alreadyMatched.length)
            throw new Error("User already matched");

        await this.orm.query(
            `INSERT INTO research_matches (author_id, target_id, type, matched_at)
            VALUES ($1, $2, $3, NOW())`,
            [userId, targetId, MatchStatus.ACCEPTED]
        );

        await this.userService.setLike(targetId, userId);
        await this.userService.notifyUser(targetId, userId, NotificationType.requestMatch)

        return suggestion;
    }

    async declineSuggestion(userId: number, targetId: number) {
        const suggestion = (await this.getSuggestions(userId))
            .users.find(user => user.id === targetId);

        if (!suggestion)
            throw new Error("User not found in suggestions");

        await this.orm.query(
            `INSERT INTO research_matches (author_id, target_id, type, matched_at)
            VALUES ($1, $2, $3, NOW())`,
            [userId, targetId, MatchStatus.DECLINED]
        );

        return suggestion;
    }

}


