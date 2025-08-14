import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("table")
export class Table {

    @ApiProperty({
        description: "Table id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        description: "Table capacity",
        example: "3"
    })
    @Column({ length: 40 })
    capacity: string;

    @ApiProperty({
        description: "Table name",
        example: "Table 201"
    })
    @Column({ length: 40, unique: true })
    @Index()
    name: string;

    @Column("boolean", { default: true, select: false })
    is_active: boolean

    @BeforeInsert()
    @BeforeUpdate()
    beforeInserORUpdate() {
        if (this.name) this.name = this.name.toLowerCase()
    }
}
