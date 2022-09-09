import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database"

let connection: Connection;

describe("Get Balance Controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it(" should be able to obtains a balance ", async () => {
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

		await request(app).post("/api/v1/statements/deposit")
			.send({
				amount: 100,
				description: "Salary"
			}).set({
				Authorization: `Bearer ${token}`
			});

		await request(app).post("/api/v1/statements/withdraw")
			.send({
				amount: 50,
				description: "party"
			}).set({
				Authorization: `Bearer ${token}`
			});


			const balance = await request(app).get("/api/v1/statements/balance")
			.set({
				Authorization: `Bearer ${token}`
			});

			expect(balance.status).toBe(200);
			expect(balance.body).toHaveProperty("balance");
			expect(balance.body.statement[0]).toHaveProperty("id");
	});

});