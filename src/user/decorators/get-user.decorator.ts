import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    const user = req.user;

    if (!user) throw new InternalServerErrorException("User not found in the request")

    return data ? user[data] : user
})