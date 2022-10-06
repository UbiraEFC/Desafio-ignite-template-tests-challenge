import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ITransferStatementDTO } from "./ITransferStatementDTO";
import { OperationType } from "../../entities/Statement";
import { TransfersStatementsUseCase } from "./TransfersStatementsUseCase";
import { TransfersStatementsError } from "./TransfersStatementsError";
import { AppError } from "../../../../shared/errors/AppError";

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

	it(" must not be able to create a transfer operartion with a nonexistent sender ", async () => {
		expect(async () => {
			const user1 = await createUserUseCase.execute({
				name: "Test1",
				email: "teste1@test",
				password: "123"
			});

			await transfersStatementsUseCase.execute({
				user_id: user1.id as string,
				description: "Aquela Pizza",
				amount: 30,
				type: OperationType.TRANSFER,
			});

		}).rejects.toBeInstanceOf(AppError);
	});

	it(" must not be able to create a transfer operartion with a nonexistent user ", async () => {
		expect(async () => {
			const user2 = await createUserUseCase.execute({
				name: "Test2",
				email: "teste2@test",
				password: "123"
			});

			await transfersStatementsUseCase.execute({
				user_id: "ad06d678-083d-44f7-ba72-0426f3bcc5ae",
				sender_id: user2.id as string,
				description: "Aquela Pizza",
				amount: 30,
				type: OperationType.TRANSFER,
			});

		}).rejects.toBeInstanceOf(AppError);
	});
	
	it(" must not be able to create a transfer with insufficient funds  ", async () => {
		expect(async () => {
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
	
			await transfersStatementsUseCase.execute({
				user_id: user2.id as string,
				sender_id: user1.id as string,
				description: "Parcela Emprestimo",
				amount: 300,
				type: OperationType.TRANSFER,
			});

		}).rejects.toBeInstanceOf(AppError);
	});
	
	it(" must not be able to create a transfer to himself ", async () => {
		expect(async () => {
			const user1 = await createUserUseCase.execute({
				name: "Test1",
				email: "teste1@test",
				password: "123"
			});
		
			await createStatementUseCase.execute({
				user_id: user1.id as string,
				description: "Salário",
				amount: 100,
				type: OperationType.DEPOSIT,
			});
	
			await transfersStatementsUseCase.execute({
				user_id: user1.id as string,
				sender_id: user1.id as string,
				description: "Parcela Emprestimo",
				amount: 50,
				type: OperationType.TRANSFER,
			});

		}).rejects.toBeInstanceOf(AppError);
	});
});