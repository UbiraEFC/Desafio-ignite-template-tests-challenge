import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Transfer Statement Controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it(" must be able to create a transfer operation ", async () => {
		await request(app).post("/api/v1/users")
			.send({
				name: "tester1",
				email: "tester1@tester",
				password: "123"
			});

		const responseTokenSender = await request(app).post("/api/v1/sessions")
			.send({
				email: "tester1@tester",
				password: "123"
			});

		const { token: sender_token } = responseTokenSender.body;

		await request(app).post("/api/v1/users")
			.send({
				name: "tester2",
				email: "tester2@tester",
				password: "123"
			});

		const responseTokenReceiver = await request(app).post("/api/v1/sessions")
			.send({
				email: "tester2@tester",
				password: "123"
			});

		const { id: user_id } = responseTokenReceiver.body.user;

		await request(app).post("/api/v1/statements/deposit")
			.send({
				amount: 100,
				description: "Salary"
			}).set({
				Authorization: `Bearer ${sender_token}`
			});

		const response = await request(app).post(`/api/v1/statements/transfers/${user_id}`)
			.send({
				amount: 100,
				description: "Debit payment"
			}).set({
				Authorization: `Bearer ${sender_token}`
			});

		expect(response.status).toBe(201);
	});

	it(" must not be able to transfer an amount bigger than the balance ", async () => {
		await request(app).post("/api/v1/users")
			.send({
				name: "tester1",
				email: "tester1@tester",
				password: "123"
			});

		const responseTokenSender = await request(app).post("/api/v1/sessions")
			.send({
				email: "tester1@tester",
				password: "123"
			});

		const { token: sender_token } = responseTokenSender.body;

		await request(app).post("/api/v1/users")
			.send({
				name: "tester2",
				email: "tester2@tester",
				password: "123"
			});

		const responseTokenReceiver = await request(app).post("/api/v1/sessions")
			.send({
				email: "tester2@tester",
				password: "123"
			});

		const { id: user_id } = responseTokenReceiver.body.user;

		await request(app).post("/api/v1/statements/deposit")
			.send({
				amount: 100,
				description: "Salary"
			}).set({
				Authorization: `Bearer ${sender_token}`
			});

		const response = await request(app).post(`/api/v1/statements/transfers/${user_id}`)
			.send({
				amount: 200,
				description: "Debit payment"
			}).set({
				Authorization: `Bearer ${sender_token}`
			});

		expect(response.status).toBe(400);
	});
});