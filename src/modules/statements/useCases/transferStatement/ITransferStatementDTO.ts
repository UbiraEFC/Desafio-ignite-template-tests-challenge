import { Statement } from "../../entities/Statement";

export type ITransferStatementDTO =
Pick<
  Statement,
  'user_id' |
	'sender_id' |
  'description' |
  'amount' |
  'type'
>
