import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user Profile", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
	});

	it(" should be able to get a user profile by id ", async () => {
		const user = await createUserUseCase.execute({
			name: "Test",
			email: "teste@test",
			password: "123"
		});

		const result = await inMemoryUsersRepository.findById(user.id as string);
		expect(result).toBeInstanceOf(User);
	});
});