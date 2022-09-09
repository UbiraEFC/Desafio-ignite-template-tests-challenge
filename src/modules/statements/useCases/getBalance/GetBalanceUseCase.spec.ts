import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

import { OperationType } from "../createStatement/CreateStatementController";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () =>{
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
		getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
	});

	it(" should be able to get a user balance ", async () => {
		const user = await createUserUseCase.execute({
			name: "Test",
			email: "teste@test",
			password: "123"
		});

		await createStatementUseCase.execute({
			user_id: user.id as string,
			description: "Salário",
			amount: 100,
			type: 'deposit' as OperationType,
		});
		
		await createStatementUseCase.execute({
			user_id: user.id as string,
			description: "Festa",
			amount: 50,
			type: 'withdraw' as OperationType,
		});

		const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

		expect(balance).toHaveProperty("balance");
	});
});