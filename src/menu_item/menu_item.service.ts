import { PaginationDto } from './../common/dtos/pagination.dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu_item.entity';
import { Repository } from 'typeorm';
import { handleException } from 'src/common/helpers/handleErrors';
import { validateExistence } from 'src/common/helpers/validateExistence';
import { validate as isUUID } from "uuid"
import { isActive } from 'src/common/helpers/isActive';
import { UploadService } from 'src/common/services/upload.service';

@Injectable()
export class MenuItemService {
  private readonly logger = new Logger("MenuItemService")
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly uploadsService: UploadService
  ) { }
  async create(createMenuItemDto: CreateMenuItemDto, file: Express.Multer.File) {
    try {
      const existsMenuItem = await validateExistence(this.menuItemRepository, {
        name: createMenuItemDto.name.trim().toLowerCase()
      })
      if (!existsMenuItem) throw new BadRequestException(`Menu item already exits`)

      const image = await this.uploadsService.create(file)

      const menuItem = this.menuItemRepository.create({
        ...createMenuItemDto,
        name: createMenuItemDto.name.trim().toLowerCase(),
        image
      })
      await this.menuItemRepository.save(menuItem);

      return menuItem;

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return await this.menuItemRepository.find({
      take: limit,
      skip: offset,
      where: {
        is_active: true
      }
    })
  }

  async findOne(term: string) {
    let menuItem: MenuItem | null = null;
    if (isUUID(term)) menuItem = await this.menuItemRepository.findOneBy({ id: term })
    else menuItem = await this.menuItemRepository.findOneBy({ name: term.trim().toLowerCase() })

    if (!menuItem) throw new NotFoundException("Menu item not found")

    const is_active = await isActive(menuItem.id, this.menuItemRepository);
    if (!is_active) {
      throw new BadRequestException("Menu item is not available")
    }

    return menuItem
  }

  async update(id: string, updateMenuItemDto?: UpdateMenuItemDto, file?: Express.Multer.File) {
    try {
      if (!updateMenuItemDto && !file) throw new BadRequestException("you must provide a file or data to update");

      let menuItem = await this.findOne(id)

      if (updateMenuItemDto) {
        if (updateMenuItemDto?.name) updateMenuItemDto.name = updateMenuItemDto.name.trim().toLowerCase()

        menuItem = {
          ...menuItem,
          ...updateMenuItemDto
        }

      }


      if (file) {
        const image = await this.uploadsService.create(file)
        menuItem.image = image!
      }
      await this.menuItemRepository.update(id, menuItem)

      return await this.findOne(id)


    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.menuItemRepository.update(id, { is_active: false })
    } catch (error) {
      handleException(error, this.logger)
    }
  }
}
