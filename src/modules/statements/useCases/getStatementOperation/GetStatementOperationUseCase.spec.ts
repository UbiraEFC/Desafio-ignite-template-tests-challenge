import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

import { OperationType } from "../createStatement/CreateStatementController";
import { Statement } from "../../entities/Statement";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Get Statement Operation", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
	});

	it(" must be able to obtain a statement operation by id ", async () => {
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

		const statmentWithdraw = await createStatementUseCase.execute({
			user_id: user.id as string,
			description: "Festa",
			amount: 50,
			type: 'withdraw' as OperationType,
		});

		const statementById = await inMemoryStatementsRepository.findStatementOperation({
			user_id: user.id as string,
			statement_id: statmentWithdraw.id as string
		});

		expect(statementById).toBeInstanceOf(Statement);
	});

});
