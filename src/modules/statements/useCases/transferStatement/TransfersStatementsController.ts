import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { TransfersStatementsUseCase } from './TransfersStatementsUseCase';


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFERIN = 'transferIN',
  TRANSFEROUT = 'transferOUT',
}

class TransfersStatementsController {
	async execute(request: Request, response: Response) {
		const { id: user_id } = request.user;
		const { amount, description } = request.body;
		const { id: sender_id } = request.params;

		const type1 = "transferIN";
		const type2 = "transferOUT";

		const transferStatement = container.resolve(TransfersStatementsUseCase);

		const sent = await transferStatement.execute({
			user_id,
			sender_id,
			type: type1 as OperationType,
			amount,
			description
		});

		const received = await transferStatement.execute({
			user_id: sender_id,
			sender_id: user_id,
			type: type2 as OperationType,
			amount,
			description
		});

		return response.status(201).json({ 
			sent,
			received
		 });
	}
}

export { TransfersStatementsController }
