import { AppError } from "../../../../shared/errors/AppError";

export namespace TransfersStatementsError {
  
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }
  
  export class SenderNotFound extends AppError {
    constructor() {
      super('Sender not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class InvalidTransferOperation extends AppError {
    constructor() {
      super('Invalid transfer operation', 404);
    }
  }
}
