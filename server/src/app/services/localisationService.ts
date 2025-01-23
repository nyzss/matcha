import fastify, { FastifyInstance } from 'fastify';
import { ORM } from '../types/orm';
import {UserService} from "./userService";
export class LocalisationService {
    private orm: ORM;
    private app: FastifyInstance;
    private userService: UserService;
    private ipCache: Map<string, locate> = new Map();
    private latLonCache: Map<string, locate> = new Map();

    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.app = fastify;
        this.userService = new UserService(fastify);
    }

    async locateIP(ip: string): Promise<locate> {
        return new Promise(async (resolve, reject) => {
            if (this.ipCache.has(ip)) {
                return resolve(this.ipCache.get(ip) as locate);
            }

            const url = process.env.IP_API_LOCATION_URL + ip;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === "success") {
                    this.ipCache.set(ip, {
                        city: data.city,
                        country: data.country,
                        zipCode: data.zip,
                        lat: data.lat,
                        lon: data.lon,
                    });

                    return resolve({
                        city: data.city,
                        country: data.country,
                        zipCode: data.zip,
                        lat: data.lat,
                        lon: data.lon,
                    });
                }

                reject("Localisation error");
            } catch (error) {
                reject(error);
            }
        });
    }

    async locateLatAndLon(lat: number, lon: number): Promise<locate> {
        return new Promise(async (resolve, reject) => {
            if (this.latLonCache.has(`[${lat},${lon}]`)) {
                return resolve(this.latLonCache.get(`[${lat},${lon}]`) as locate);
            }
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data && data.address) {
                    this.latLonCache.set(`[${lat},${lon}]`, {
                        city: data.address.town || data.address.village,
                        country: data.address.country,
                        zipCode: data.address.postcode,
                        lat: lat,
                        lon: lon,
                    });

                    return resolve({
                        city: data.address.town || data.address.village,
                        country: data.address.country,
                        zipCode: data.address.postcode,
                        lat: lat,
                        lon: lon,
                    });
                }

                reject("Localisation error");
            } catch (error) {
                reject(error);
            }
        });
    }

    async getNearbyLatAndLon(lat: number, lon: number, radius: number) {
        const users = await this.app.orm.query(`
            SELECT
                user_id as "id",
                username,
                avatar,
                first_name as "firstName",
                last_name as "lastName",
                fame_rating as "fameRating",
                birth_date as "birthDate",
                gender,
                sexual_orientation as "sexualOrientation",
                tags,
                location,
                biography,
                ST_Distance(
                        ST_Transform(
                                ST_SetSRID(ST_MakePoint(
                                                   (location->>'lon')::float,
                                                   (location->>'lat')::float
                                               ), 4326),
                                3857
                            ),
                        ST_Transform(
                                ST_SetSRID(ST_MakePoint($1, $2), 4326),
                                3857
                            )
                    ) / 1000 AS distance
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE location IS NOT NULL
              AND (location->>'lon') IS NOT NULL
              AND (location->>'lat') IS NOT NULL
              AND ST_DWithin(
                    ST_Transform(
                            ST_SetSRID(ST_MakePoint(
                                               (location->>'lon')::float,
                                               (location->>'lat')::float
                                           ), 4326),
                            3857
                        ),
                    ST_Transform(
                            ST_SetSRID(ST_MakePoint($1, $2), 4326),
                            3857
                        ),
                    $3 * 1000
                )
            ORDER BY distance ASC;
        `, [lon, lat, radius]);

        if (!users)
            return [];

        return users.map((user: any) => ({
            ...user,
            age: new Date().getFullYear() - new Date(user.birthDate).getFullYear(),
            distance: user.distance.toFixed(2),
        }));
    }

    async fetchUserLocation(ip: string, lat: number | null = null, lon: number | null = null) {
        let location: locate;

        try {
            if (!lat || !lon) {
                location = await this.locateIP(ip);
            } else {
                location = await this.locateLatAndLon(lat, lon);
                if (!location) {
                    location = await this.locateIP(ip);
                }
            }

            return location;
        } catch (error) {
            this.app.log.error(`Can't fetch location for user ${ip}`);
            return;
        }
    }

    async getUserLocation(userId: number) {
        const [user] = await this.orm.query("SELECT location FROM profiles WHERE user_id = $1", [userId]);

        if (!user || !user.location)
            return;

        return user.location;
    }

    async updateUserLocation(userId: number, ip: string, lat: number | null = null, lon: number | null = null) {
        const location = await this.fetchUserLocation(ip, lat, lon);

        if (!location)
            return;

        await this.orm.query("UPDATE profiles SET location = $1 WHERE user_id = $2", [JSON.stringify(location), userId]);
        // console.log(await this.getNearbyLatAndLon(location.lat, location.lon, 14));
    }
}

