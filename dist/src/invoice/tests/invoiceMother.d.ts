import { InvoiceService } from './../invoice.service';
import { Invoice } from './../entities/invoice.entity';
import { UserService } from "src/user/user.service";
import { EmployeeService } from "src/employee/employee.service";
import { Repository } from "typeorm";
import { EmployeeRole } from "src/employee/entities/employee_role.entity";
import { CreateInvoiceDto } from "../dto/create-invoice.dto";
import { OrderMother } from 'src/order/tests/orderMother';
export declare class InvoiceMother {
    private readonly invoiceService;
    private readonly userService;
    private readonly employeeService;
    private readonly employeRoleRepository;
    private readonly orderMother;
    constructor(invoiceService: InvoiceService, userService: UserService, employeeService: EmployeeService, employeRoleRepository: Repository<EmployeeRole>, orderMother: OrderMother);
    private static getRandomPaymentMethod;
    static dto(InvoiceInfo?: Partial<CreateInvoiceDto>): CreateInvoiceDto;
    createManyInvoices(quantity: number): Promise<{
        invoice: Invoice;
        checkoutUrl: string;
    }[]>;
}
