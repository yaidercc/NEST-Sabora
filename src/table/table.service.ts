import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { handleException } from 'src/common/handleErrors';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from "uuid"
import { isActive } from 'src/common/isActive';

@Injectable()
export class TableService {
  private readonly logger = new Logger("TableService")

  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>
  ) { }

  async create(createTableDto: CreateTableDto) {
    try {
      const user = this.tableRepository.create(createTableDto)
      await this.tableRepository.save(user);

      return user;
    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async findAll(paginationDTO: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDTO
    return this.tableRepository.find({
      take: limit,
      skip: offset,
      where: { is_active: true }
    })
  }

  async findOne(term: string) {
    let table: Table | null = null
    try {
      if (isUUID(term)) table = await this.tableRepository.findOneBy({ id: term })
      else {
        const queryBuilder = this.tableRepository.createQueryBuilder("table");
        table = await queryBuilder
          .addSelect("table.is_active")
          .where("(LOWER(name) = :name", { term: term.toLowerCase() })
          .getOne()
      }
      if (!table) throw new NotFoundException("Table not found")
      if (!table.is_active) throw new BadRequestException("Table is not available")

      const { is_active, ...restTableInfo } = table

      return restTableInfo
    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    try {
      if (!updateTableDto || typeof updateTableDto !== 'object') {
        throw new BadRequestException("No data provided to update");
      }

      const table = await this.tableRepository.preload({
        id,
        ...updateTableDto
      })

      if (!table) throw new NotFoundException("Table not found")

      const is_active = await isActive(id, this.tableRepository);
      if (!is_active) {
        throw new BadRequestException("Table is not available")
      }

      await this.tableRepository.save(table)

      return table

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async remove(id: string) {
    try {
      const table = await this.tableRepository.findOneBy({ id });
      if (!table) throw new NotFoundException("Table not found")

      const is_active = await isActive(id, this.tableRepository);
      if (!is_active) {
        throw new BadRequestException("Table is inactive")
      }

      return await this.tableRepository.update(id, { is_active: false })
    } catch (error) {
      handleException(error, this.logger)
    }
  }
}
