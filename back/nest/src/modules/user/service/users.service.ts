import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find();     
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
