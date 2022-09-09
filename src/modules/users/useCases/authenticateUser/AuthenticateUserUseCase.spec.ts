import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { AppError } from "../../../../shared/errors/AppError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
	});

	it(" should be able to authenticate an user ", async () => {
		const user: ICreateUserDTO = {
			name: "Test",
			email: "teste@test",
			password: "123"
		}
		await createUserUseCase.execute(user);

		const result = await authenticateUserUseCase.execute({
			email: user.email,
			password: user.password
		});

		expect(result).toHaveProperty("token");
	});

	it(" must not be able to authenticate a non-existent user ", () => {
		expect(async () => {
			await authenticateUserUseCase.execute({
				email: "false@false.com",
				password: "hackerhacker"
			});
		}).rejects.toBeInstanceOf(AppError);
	});

	it(" must not be able to authenticate an incorrect password  ", async () => {
		  await expect(async () => {
			const user: ICreateUserDTO = {
				name: "test",
				email: "teste@test",
				password: "1234",
			}
			await createUserUseCase.execute(user);

			await authenticateUserUseCase.execute({
				email: user.email,
				password: "123"
			});
		}).rejects.toBeInstanceOf(AppError);
	});
});