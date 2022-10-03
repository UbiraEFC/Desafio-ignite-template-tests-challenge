import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { TransfersStatementsUseCase } from './TransfersStatementsUseCase';


enum OperationType {
	TRANSFERIN = 'transferIN',
	TRANSFEROUT = 'transferOUT',
}

class TransfersStatementsController {
	async execute(request: Request, response: Response) {
		const { id: user_id } = request.user;
		const { amount, description } = request.body;
		const { id: sender_id } = request.params;

		const transferStatement = container.resolve(TransfersStatementsUseCase);

		const sent = await transferStatement.execute({
			user_id,
			sender_id,
			type: 'transferOUT' as OperationType,
			amount,
			description
		});

		const received = await transferStatement.execute({
			user_id: sender_id,
			sender_id: user_id,
			type: 'transferIN' as OperationType,
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
