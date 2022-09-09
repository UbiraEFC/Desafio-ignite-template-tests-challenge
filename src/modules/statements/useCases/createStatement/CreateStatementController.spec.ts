import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database"

let connection: Connection;

describe("Create Statement Controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it(" should be able to create a statement ", async () => {
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

		const response = await request(app).post("/api/v1/statements/deposit")
			.send({
				amount: 100,
				description: "Salary"
			}).set({
				Authorization: `Bearer ${token}`
			});

		expect(response.status).toBe(201);
	});
	
	it(" must not be able to withdraw if the balance is zero or less than the withdraw ", async () => {
		await request(app).post("/api/v1/users")
		.send({
			name: "newTester",
			email: "newTester@email.com",
			password: "123"
		});

		const responseToken = await request(app).post("/api/v1/sessions")
			.send({
				email: "newTester@email.com",
				password: "123"
			}); 
		const { token } = responseToken.body;

		const response = await request(app).post("/api/v1/statements/withdraw")
			.send({
				amount: 100,
				description: "party"
			}).set({
				Authorization: `Bearer ${token}`
			});

		expect(response.status).toBe(400);
	});


});