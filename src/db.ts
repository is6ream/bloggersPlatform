import { availableResolutions } from "./core/resolutions"

export interface VideoType {
    id: string,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string
}


export interface DBType {
    videos: VideoType[]
}

export const db: DBType = {
    videos: [
        {
            id: new Date().toISOString(),
            title: 't1',
            author: 'a1',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: availableResolutions.P1440,
        }
    ]
}
