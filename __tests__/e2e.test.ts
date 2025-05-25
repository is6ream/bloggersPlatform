import { app } from '../src/app'
import request from "supertest";
import { db } from '../src/db';



describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data/')
    })

    it('should return 200 and emty array', async () => {
        const res = await request(app)
            .get('/hometask_01/api/videos')
            .expect(200, [])
    })

    it('should return 404 for not existing course', async () => {
        const res = await request(app)
            .get('/videos/12321')
            .expect(404)
    })

    it('should create course with correct input data', async () => {

        const res = await request(app)
            .post('/hometask_01/api/videos')
            .send({
                title: 'string',
                author: 'string',
                availableResolutions: [
                    "P144"
                ]
            })

        const createdCourse = res.body

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'string',
            author: 'string',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ["P144"]
        })
    })

    it('should not create course with incorrect input data', async () => {

        const res = await request(app)
            .post('/hometask_01/api/videos')
            .send({
                title: '',
                author: 'str',
                availableResolutions: [
                    "P1080"
                ]
            })
            .expect(400)
    })


})