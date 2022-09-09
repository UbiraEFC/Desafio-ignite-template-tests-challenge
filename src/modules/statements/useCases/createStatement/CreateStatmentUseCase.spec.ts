import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

import { OperationType } from "../createStatement/CreateStatementController"
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a statment", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
	});

	it(" must be able to create a new statement ", async () => {
		const user = await createUserUseCase.execute({
			name: "Test",
			email: "teste@test",
			password: "123"
		});

		const statement: ICreateStatementDTO = await createStatementUseCase.execute({
			user_id: user.id as string,
			description: "Salário",
			amount: 100,
			type: 'deposit' as OperationType,
		});

		expect(statement).toHaveProperty("id");
	});

	it(" must not be able to withdraw the balance is zero or less than the withdraw ", async () => {
		expect(async () => {
			const user = await createUserUseCase.execute({
				name: "Test",
				email: "teste@test",
				password: "123"
			});

			const statement: ICreateStatementDTO = await createStatementUseCase.execute({
				user_id: user.id as string,
				description: "Salário",
				amount: 100,
				type: 'withdraw' as OperationType,
			});
		}).rejects.toBeInstanceOf(AppError);

	});
});