import { SetMetadata } from '@nestjs/common';

export const OWNER_ADMIN_KEY = 'allow_owner_or_admin'

export interface OwnerAminOptions {
    allowAdmin?: boolean;
}
// There are some actions the only the owner of the user can do or the admin can do to so this decorator is for swtich between those options
export const AllowOwnerOrAdmin = (options: OwnerAminOptions) => {
    return SetMetadata(OWNER_ADMIN_KEY, options); 
}
