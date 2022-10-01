# Desafio-ignite-template-tests-challenge
Desafio da Jornada Ignite do bootcamp de Backend da Rocketseat


O conteudo do desafio é melhor descrito nos links:

https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11 (testes unitários)

https://www.notion.so/Desafio-02-Testes-de-integra-o-70a8af48044d444cb1d2c1fa00056958 (testes de integração)


# Transferências com a FinAPI
**RF**
- Criar funcionalidade tranferência de valores entre contas

**RN**
- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;

- O balance obtido na rota apropriada deverá considerar também, todos os valores enviados ou recebidos, 
através do tipo de transação "transfer";

- Rota para enviar tranferência: /api/v1/statements/transfers/:user_id

- O id do usuário destinatário será recebido via parâmetro da rota e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;

- Ao mostrar o balance de um usuário, operações do tipo "transfer" deverão possuir os seguintes campos:
{
  "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
  "amount": 100,
  "description": "Transferência de valor",
  "type": "transfer",
  "created_at": "2021-03-26T21:33:11.370Z",
  "updated_at": "2021-03-26T21:33:11.370Z"
}
Observe o campo sender_id. Esse deverá ser o id do usuário que enviou a transferência.
O campo type também deverá exibir o tipo da operação, que nesse caso é transfer.