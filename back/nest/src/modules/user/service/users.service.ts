import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreateFailedException } from 'src/exceptions/create-failed.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/createUserDto';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';
//import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}



  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new CreateFailedException(error);
    } 
  }

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

      const itemCount = await queryBuilder.getCount();
      const {entities} = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

      return new PageDto(entities, pageMetaDto)
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
