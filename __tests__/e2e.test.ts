import { app } from '../src/app'
import request from "supertest";
import { db } from '../src/db';
import { correctDataForUpdating, incorrectDataForUpdating, DataForUpdating } from './test-helper';
import { create } from 'domain';
import { response } from 'express';


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


    let createdCourse: any = null;
    let createdCourse2: any = null


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

        createdCourse = res.body

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

        await request(app)
            .get('/hometask_01/api/videos')
            .expect(200, [createdCourse])

    })

    it('should create one more course', async () => {
        const res = await request(app)
            .post('/hometask_01/api/videos')
            .send({
                title: 't1',
                author: 'a1',
                availableResolutions: [
                    "P144"
                ]
            })

        createdCourse2 = res.body

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 't1',
            author: 'a1',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ["P144"]
        })

        await request(app)
            .get('/hometask_01/api/videos')
            .expect(200, [createdCourse, createdCourse2])
    })

    it('should not update course with incorrect input data', async () => {
        await request(app)
            .put('/hometask_01/api/videos/' + createdCourse.id)
            .send(incorrectDataForUpdating) //выдает invalid URL
            .expect(400)

        await request(app)
            .get('/hometask_01/api/videos/' + createdCourse.id)
            .expect(200, createdCourse)
    })

    it('should not update course that not exist', async () => {
        await request(app)
            .put('/hometask_01/api/videos/12321')
            .send(correctDataForUpdating) //выдает invalid URL
            .expect(404)
    })

    it('should  update course with correct input data', async () => {
        await request(app)
            .put('/hometask_01/api/videos/' + createdCourse.id)
            .send(correctDataForUpdating)
            .expect(204)



        const response = await request(app).
            get('/hometask_01/api/videos/' + createdCourse.id)
        expect(200)


        expect(response.body).toEqual(expect.objectContaining({
            ...correctDataForUpdating,
            id: createdCourse.id,
            createdAt: expect.any(String),
            publicationDate: expect.any(String)
        }))
    })

    it('should delete both courses', async () => {
        await request(app)
            .delete('/hometask_01/api/videos/' + createdCourse.id)
            .expect(204)

        await request(app)
            .get('/hometask_01/api/videos/' + createdCourse.id)
            .expect(404)

        await request(app)
            .delete('/hometask_01/api/videos/' + createdCourse2.id)
            .expect(204)

        await request(app)
            .get('/hometask_01/api/videos/' + createdCourse2.id)
            .expect(404)

        await request(app)
            .get('/hometask_01/api/videos')
            .expect(200, [])
    })





})