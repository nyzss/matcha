export interface ResearchOptions {
    ageMax: number | null;
    ageMin: number;
    fameRatingMax: number | null;
    fameRatingMin: number;
    location: number;
    tags: string[];
}

interface SortOptions {
    field: "age" | "location" | "fame_rating" | "common_tags";
    order: "asc" | "desc";
}

export interface FilterOptions {
    sort?: SortOptions;
    age?: number;
    fameRating?: number;
    location?: number;
    tags?: string[];
}

export enum MatchStatus {
    ACCEPTED = "Accepted",
    DECLINED = "Declined"
}