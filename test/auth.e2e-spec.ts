import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import mongoose from "mongoose";
import { AppModule } from '../src/app.module';

const mockUser = {
    name: "donato",
    email: "donato@email.com",
    password: "12345678"
}


describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let server;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        server = app.getHttpServer();
    });

    beforeAll(() => {
        mongoose.connect(process.env.DB_URI, () => {
            mongoose.connection.db.dropDatabase();
        });
    });

    afterEach(async () => {
        await app.close();
        server.close();
    });

    afterAll(() => {
        mongoose.disconnect();
        server.close();
    });

    it('[POST] - register new user', () => {
        const user = {...mockUser};

        return request(server)
            .post('/auth/signup')
            .send(user)
            .expect(201)
            .then((res) => {
                expect(res.body.token).toBeDefined()
            });
    });

    it('[POST] - login user', () => {
        const user = {...mockUser};
        
        return request(server)
            .post('/auth/login')
            .send(user)
            .expect(200)
            .then((res) => {
                expect(res.body.token).toBeDefined()
            });
    });
});