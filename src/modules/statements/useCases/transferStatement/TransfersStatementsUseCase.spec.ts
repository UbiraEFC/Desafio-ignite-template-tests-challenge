import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ITransferStatementDTO } from "./ITransferStatementDTO";
import { OperationType } from "../../entities/Statement";
import { TransfersStatementsUseCase } from "./TransfersStatementsUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let transfersStatementsUseCase: TransfersStatementsUseCase;

describe("Create a Transfer Operation", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		createStatementUseCase = new CreateStatementUseCase(
			inMemoryUsersRepository,
			inMemoryStatementsRepository,
		);
		transfersStatementsUseCase = new TransfersStatementsUseCase(
			inMemoryUsersRepository,
			inMemoryStatementsRepository,
		);
	});

	it(" must be able to create a transfer operation ", async () => {
		const user1 = await createUserUseCase.execute({
			name: "Test1",
			email: "teste1@test",
			password: "123"
		});
		
		const user2 = await createUserUseCase.execute({
			name: "Test2",
			email: "teste2@test",
			password: "123"
		});

		await createStatementUseCase.execute({
			user_id: user1.id as string,
			description: "Salário",
			amount: 100,
			type: OperationType.DEPOSIT,
		});

		const transfer: ITransferStatementDTO = await transfersStatementsUseCase.execute({
			user_id: user2.id as string,
			sender_id: user1.id as string,
			description: "Aquela Pizza",
			amount: 30,
			type: OperationType.TRANSFER,
		});

		expect(transfer).toHaveProperty("id");
		expect(transfer).toHaveProperty("user_id");
		expect(transfer).toHaveProperty("sender_id");
		expect(transfer.type).toEqual(OperationType.TRANSFER);
	});
})