import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database"

let connection: Connection;

describe("Authenticate User Controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it(" should be able to authenticate a user ", async () => {
		await request(app).post("/api/v1/users")
			.send({
				name: "tester",
				email: "tester@email.com",
				password: "123"
			});

		const responseToken = await request(app).post("/api/v1/sessions")
			.send({
				email: "tester@email.com",
				password: "123"
			});
		
			expect(responseToken.status).toBe(200);
			expect(responseToken.body).toHaveProperty("user");
			expect(responseToken.body).toHaveProperty("token");
			expect(responseToken.body.user).toHaveProperty("id");
	});

	it(" should not be able to authenticate a user with an incorrect email/password ", async () => {
		await request(app).post("/api/v1/users")
			.send({
				name: "tester",
				email: "tester@email.com",
				password: "123"
			});

		const responseToken = await request(app).post("/api/v1/sessions")
			.send({
				email: "tester@email.com",
				password: "1234"
			});
		
			expect(responseToken.status).toBe(401);
	});
});