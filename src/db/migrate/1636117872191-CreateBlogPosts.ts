import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateBlogPosts1636117872191 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'blog_post',
              columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isUnique: true,
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'body',
                    type: 'varchar',
                    isNullable: false,
                },
              ],
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE blog_post`);
    }

}
