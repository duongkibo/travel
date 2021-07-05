import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { UserRepository } from '../repositories/users.repository';
import { AppRoles, User } from '../entities/users.entity';
import bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { UserCommonEnum } from 'src/modules/common/common.message';
import { NewUserInput, SearchUserInput } from '../dto/new_user.input';
import { UserBookTourService } from 'src/modules/tourist-areas/user-book-tour.service';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private readonly mailerService: MailerService, private readonly bookService: UserBookTourService) {}

  create = (data: DeepPartial<User>) => {
    const salt = bcrypt.genSaltSync(10);
    data.roles = ['BASE', 'ADMIN'];
    data.password = bcrypt.hashSync(data.password ?? '', salt);
    data.passwordSalt = salt;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  };

   signup = async (data: DeepPartial<User>, userId: string | undefined) => {
    const checkUser =  await this.findByUsername(data.username);
    if (checkUser) throw new BadRequestException(UserCommonEnum.USER_EXIST);
    const salt = bcrypt.genSaltSync(10);
    data.roles = !userId ? [AppRoles.USER] : data.roles;
    data.password = bcrypt.hashSync(data.password ?? '', salt);
    data.passwordSalt = salt;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  };


   findOne = async (id: string): Promise<User | undefined> => {
    return await this.userRepository.findOneOrFail({ where: { id } });
  };

  searchUser = async (input: SearchUserInput) => {
    let {keyword, page, limit } = input;
    const query = this.userRepository.createQueryBuilder('users');
    limit = limit || 15;
    page = page || 1;
    if (keyword && keyword?.length > 0) {
      query.andWhere('users.user_name ILIKE :name', { name: `%${keyword.trim()}%` });
      query.orWhere('users.email ILIKE :name', { name: `%${keyword.trim()}%` });
    }
    query.andWhere(`users.roles @> ARRAY[:roles]`, { roles: AppRoles.USER })
    query.orderBy(`users.createdAt`, 'DESC')
    return this.userRepository.customPaginate(query, { limit, page });
  }

  findByUsername = async (username: string | undefined): Promise<User | undefined> => {
    return this.userRepository.findOne({ where: { username } });
  };

  pagination = () => {
    return this.userRepository.paginate({ page: 1, limit: 15 });
  };

  login = async (username: string, password: string) => {
    const user = await this.userRepository.findOne({
      where: { email: username },
    });
    if (!user) return false;
    const check = bcrypt.compareSync(password, user.password);
    if (check) {
      return user;
    } else {
      return false;
    }
  };

  update = async (id: string, data: DeepPartial<User>) =>  {
    const findUser = await this.findOne(id);
    if (!findUser)    throw new NotFoundException(UserCommonEnum.USER_NOT_FOUND);
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password ?? '', salt);
    data.passwordSalt = salt;
    data.roles = data.roles;

    await this.userRepository.update(id, data);
    return this.userRepository.findOneOrFail(id);
  }

  delete = async (id: string) =>  {
    const findUser = await this.findOne(id);
    if (!findUser)    throw new NotFoundException(UserCommonEnum.USER_NOT_FOUND);
    
    await this.userRepository.delete(id);
    return true;
  }

  public sendMail(): void {
    this.mailerService
      .sendMail({
        to: 'cunghungngoc@gmail.com',
        from: 'cunghungngoc@gmail.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'demo',
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'Duong Tran Hung',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkLocation = async (id: string, limit: number, page: number) => {
    return await this.bookService.getUserLocation(id, limit, page);
  }
}
