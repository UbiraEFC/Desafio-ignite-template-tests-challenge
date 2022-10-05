import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';

import { TransfersStatementsUseCase } from './TransfersStatementsUseCase';


class TransfersStatementsController {
	async execute(request: Request, response: Response) {
		const { id: sender_id } = request.user;
		const { amount, description } = request.body;
		const { user_id } = request.params;
		const type = OperationType.TRANSFER;

		const transferStatement = container.resolve(TransfersStatementsUseCase);



		return response.status(201).json(await transferStatement.execute({
			user_id,
			sender_id,
			type,
			amount,
			description
		})
		);
	}
}

export { TransfersStatementsController }
