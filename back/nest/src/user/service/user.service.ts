import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { UserI } from '../models/user.interface';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    addUser(user: UserI): Observable<UserI> {
        return from(this.userRepository.save(user));
    }

    findAllUsers(): Observable<UserI[]> {
        return from(this.userRepository.find());
    }

    findUserById(id: string): Observable<UserI> {
        return from(this.userRepository.findOne({where: {id: id}}));
    }

    updateUser(id: string, user: UserI): Observable<UpdateResult> {
        return from(this.userRepository.update(id, user))
    }

}