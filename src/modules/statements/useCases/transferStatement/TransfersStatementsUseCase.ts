import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransfersStatementsError } from "./TransfersStatementsError";
import { ITransferStatementDTO } from "./ITransferStatementDTO";

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

    if (!user) {
      throw new TransfersStatementsError.UserNotFound();
    }
    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new TransfersStatementsError.InsufficientFunds()
    }


    const statementOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
