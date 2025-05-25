import { app } from '../src/app'
import request from "supertest";


describe("GET /", () => {
    it("should return 'Hello world'", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toBe("Hello world!")
    })
})