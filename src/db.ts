import { RESOLUTIONS } from "./core/resolutions"
import { DBType } from "./core/video-types"
export const db: DBType = {
    videos: [
        {
            id: 0,
            title: 't1',
            author: 'a1',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [
                RESOLUTIONS.P1440
            ]
        }
    ]
}
