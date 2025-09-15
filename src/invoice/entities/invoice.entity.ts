import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvoiceStatus } from "../enum/InvoiceStatus";
import { PaymentMethods } from "../enum/payment_methods";
import { ApiProperty } from "@nestjs/swagger";

@Entity("invoice")
export class Invoice {

    @ApiProperty({
        description: "Invoice id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        description: "Order",
        type: () => Order
    })
    @OneToOne(() => Order, { eager: true })
    @JoinColumn()
    order: Order;

    /**
     * precision: total of digits
     * scale: how many decimals
     */
    @ApiProperty({
        description: "Service fee rate",
        example: 0.2
    })
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.10 })
    service_fee_rate: number;

    @ApiProperty({
        description: "Total",
        example: 12.0000
    })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @ApiProperty({
        description: "Invoice status",
        enum: InvoiceStatus
    })
    @Column({ type: 'simple-enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
    status: string;

    @ApiProperty({
        description: "Payment method",
        enum: PaymentMethods
    })
    @Column({ type: 'simple-enum', enum: PaymentMethods })
    payment_method: string;


    @ApiProperty({
        description: "Unique identifier of the Stripe Checkout session",
        example: "cs_test_a1B2C3D4E5F6G7H8I9J0",
    })
    @Column({ nullable: true })
    stripe_session_id?: string;

    @ApiProperty({
        description: "Unique identifier of the Stripe Payment Intent",
        example: "pi_3Nk9WqL8ZsA0tB12345abcdef",
    })
    @Column({ nullable: true })
    stripe_payment_intent_id?: string;

}

