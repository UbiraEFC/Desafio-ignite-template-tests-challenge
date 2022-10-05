import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';

import { TransfersStatementsUseCase } from './TransfersStatementsUseCase';


class TransfersStatementsController {
	async execute(request: Request, response: Response) {
		const { id: user_id } = request.user;
		const { amount, description } = request.body;
		const { id: sender_id } = request.params;
		const type = 'transfer' as OperationType; 
		
		const transferStatement = container.resolve(TransfersStatementsUseCase);

		const sent = await transferStatement.execute({
			user_id,
			sender_id,
			type,
			amount,
			description
		});

		return response.status(201).json({ 
			sent,
		 });
	}
}

export { TransfersStatementsController }
