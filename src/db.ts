export interface VideoDBType {
    id: string,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}

export const newVideo: VideoDBType = {
    id: new Date().toISOString() + Math.random(),
    title: 'new title',
    author: 'new author',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString() + Math.random(),
    availableResolutions: [
        "P144"
    ]
}