import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database"

let connection: Connection;

describe("Show User Profile Controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it(" should be able to show a user profile ", async () => {
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

			const { token } = responseToken.body;

			const userProfile = await request(app).get("/api/v1/profile")
			.set({
				Authorization: `Bearer ${token}`
			});

			expect(userProfile.status).toBe(200);
			expect(userProfile.body).toHaveProperty("id");
			expect(userProfile.body).toHaveProperty("created_at");
	});
});
