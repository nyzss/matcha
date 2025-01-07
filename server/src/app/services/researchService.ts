import {FastifyInstance} from 'fastify';
import {ORM, TableSchema} from '../types/orm';
import {ResearchOptions} from "../types/research";

export class ResearchService {
    private orm: ORM;
    private app: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.app = fastify;
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
                location: null,
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

}
