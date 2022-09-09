import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
	});

	it(" must be able to create a new user ", async () => {
		const user = await createUserUseCase.execute({
			name: "Test",
			email: "teste@test",
			password: "123"
		});

		expect(user).toHaveProperty("id");
	});

	it(" must not be able to create a user with an existing email ", async () => {
		expect(async () => {
			await createUserUseCase.execute({
				name: "Bira",
				email: "teste@test",
				password: "1212"
			});
			await createUserUseCase.execute({
				name: "Bruno",
				email: "teste@test",
				password: "1313"
			});
		}).rejects.toBeInstanceOf(AppError);
	});
});