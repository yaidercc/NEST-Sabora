export declare const OWNER_ADMIN_KEY = "allow_owner_or_admin";
export interface OwnerAminOptions {
    allowAdmin?: boolean;
}
export declare const AllowOwnerOrAdmin: (options: OwnerAminOptions) => import("@nestjs/common").CustomDecorator<string>;
