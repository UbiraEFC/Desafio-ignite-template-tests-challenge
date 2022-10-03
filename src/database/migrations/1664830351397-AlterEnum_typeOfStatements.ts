import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterEnumTypeOfStatements1664830351397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "statements",
            "type",
            new TableColumn({
                name: "type",
                type: "enum",
                enum: ["deposit", "withdraw", "transferIN","transferOUT",],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
