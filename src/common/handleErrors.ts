import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common"

export const handleException = (error: any, logger: Logger) => {
    if (error.code === '23505') throw new BadRequestException(error.detail)
    if (error.code === '23503') throw new BadRequestException('There are still related records linked to this entry');
    logger.error(error)
    throw new InternalServerErrorException("Unexpected error! check server logs")
}