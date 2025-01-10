import {FastifyInstance} from 'fastify';
import {ORM, TableSchema} from '../types/orm';
import {ResearchOptions} from "../types/research";
import {LocalisationService} from "./localisationService";
import {UserService} from "./userService";

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

    async getSuggestions(userId: number) {
        const profile = await this.userService.getUserById(userId);

        if (!profile)
            throw new Error("User not found");

        const research: ResearchOptions = await this.getUserResearch(userId);
        const userLocation: locate | null = await this.localisationService.getUserLocation(userId);


        if (!userLocation)
            return [];

        const nearbyUsers = await this.localisationService.getNearbyLatAndLon(userLocation.lat, userLocation.lon, research.location);

        if (!nearbyUsers)
            return [];

        const users = nearbyUsers.filter((user: any) => {
            const isAgeMatch = user.age >= research.ageMin && user.age <= (research.ageMax || research.ageMin);
            const isFameMatch = user.fameRating >= research.fameRatingMin && user.fameRating <= (research.fameRatingMax || research.fameRatingMin);
            const areTagsMatch = !research.tags.length || research.tags.some(tag => user.tags && user.tags.includes(tag));

            const isSexualOrientationMatch = !profile.sexualOrientation || user.sexualOrientation === profile.sexualOrientation;
            const isGenderMatch = !profile.gender || user.gender === profile.gender;

            return isAgeMatch && isFameMatch && areTagsMatch && isSexualOrientationMatch && isGenderMatch;
        });


        return users.map((user: any) => ({
            id: user.id,
            avatar: user.avatar,
            username: user.username,
            age: user.age,
            fameRating: user.fameRating,
            distance: user.distance,
            city: user.location.city,
            country: user.location.country,
            tags: user.tags || [],
        }));
    }

}


