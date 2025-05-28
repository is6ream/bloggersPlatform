export const getAllVideos = (req: Request, res: Response) => {
  const videos = db.videos
  res.status(200).json(videos)
}
