import { OwnerAminOptions } from './owner-protected.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
export declare function Auth(roles?: GeneralRoles[], options?: OwnerAminOptions, employeeRoles?: EmployeeRoles[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
