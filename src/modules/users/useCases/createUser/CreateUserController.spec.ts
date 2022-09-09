import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database"

let connection: Connection;

describe("Create User Controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it(" should be able to create a new user ", async () => {
		const newUser = await request(app).post("/api/v1/users")
			.send({
				name: "tester",
				email: "tester@email.com",
				password: "123"
			});


		expect(newUser.status).toBe(201);
	});

	it(" should not be able to create a new user with an existent email ", async () => {
		await request(app).post("/api/v1/users")
			.send({
				name: "tester",
				email: "tester@email.com",
				password: "123"
			});

		const user2 = await request(app).post("/api/v1/users")
			.send({
				name: "testerFake",
				email: "tester@email.com",
				password: "1234"
			});


		expect(user2.status).toBe(400);
		expect(user2.body.message).toEqual("User already exists");
	});
});