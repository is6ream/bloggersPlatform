import { RESOLUTIONS, typeRESOLUTIONS } from "../../core/resolutions"
import { OutputErrorType, VideoCreateInputDto, VideoUpdateInputDto } from "./validation-types"

export const updateInputValidation = (video: VideoUpdateInputDto) => {
    const errors: OutputErrorType = {
        errorsMessages: []
    }
    if (!video.title || video.title.trim().length === 0 || typeof video.title !== 'string' || video.title.length > 40) {
        errors.errorsMessages.push({ message: "error!", field: 'title' }
        )
    }
    if (!video.author || video.author.trim().length === 0 || typeof video.author !== 'string' || video.author.length > 20) {
        errors.errorsMessages.push({ message: 'error!', field: 'author' })
    }
    if (!Array.isArray(video.availableResolutions) ||
        video.availableResolutions.find((p: typeRESOLUTIONS) => !RESOLUTIONS[p as keyof typeof RESOLUTIONS])) {
        errors.errorsMessages.push({ message: 'error', field: 'availableResolutions' })
    }
    if (!video.canBeDownloaded || typeof video.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({ message: 'error', field: 'canBeDownloaded' })
    }                            //тут м.б затык
    if (!video.minAgeRescriction || (typeof video.minAgeRescriction !== 'number' || video.minAgeRescriction < 1 || video.minAgeRescriction > 18)) {
        errors.errorsMessages.push({ message: 'error', field: 'minAgeRestriction' })
    }
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    if (!video.publicationDate ||
        typeof video.publicationDate !== 'string' || !video.publicationDate.match(iso8601Regex)
    )
        return errors;
}


export const CreateInputValidation = (video: VideoCreateInputDto) => {
    const errors: OutputErrorType = {
        errorsMessages: []
    }
    if (!video.title || video.title.trim().length === 0 || typeof video.title !== 'string' || video.title.length > 40) {
        errors.errorsMessages.push({ message: "error!", field: 'title' }
        )
    }
    if (!video.author || video.author.trim().length === 0 || typeof video.author !== 'string' || video.author.length > 20) {
        errors.errorsMessages.push({ message: 'error!', field: 'author' })
    }
    if (!Array.isArray(video.availableResolutions) ||
        video.availableResolutions.find((p: typeRESOLUTIONS) => !RESOLUTIONS[p as keyof typeof RESOLUTIONS])) {
        errors.errorsMessages.push({ message: 'error', field: 'availableResolutions' })
    }
    return errors;
}