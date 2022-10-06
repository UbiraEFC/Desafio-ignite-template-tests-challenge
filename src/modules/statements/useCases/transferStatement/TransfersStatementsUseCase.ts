import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransfersStatementsError } from "./TransfersStatementsError";
import { ITransferStatementDTO } from "./ITransferStatementDTO";
import { OperationType } from "../../entities/Statement";

@injectable()
export class TransfersStatementsUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, sender_id, type, amount, description }: ITransferStatementDTO) {
    const user = await this.usersRepository.findById(user_id);
    const sender = await this.usersRepository.findById(String(sender_id));

    if(user_id === sender_id) {
      throw new TransfersStatementsError.InvalidTransferOperation();
    }

    if (!user) {
      throw new TransfersStatementsError.UserNotFound();
    }
    if (!sender) {
      throw new TransfersStatementsError.SenderNotFound();
    }
    const { balance } = await this.statementsRepository.getUserBalance({ user_id: String(sender_id) });

    if (balance < amount) {
      throw new TransfersStatementsError.InsufficientFunds()
    }


    await this.statementsRepository.create({
      user_id: String(sender_id),
      sender_id: user_id,
      type: OperationType.WITHDRAW,
      amount,
      description: `Tranfered ${amount} to ${user.name}`
    });
    
    const statementOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return statementOperation;
  }
}
