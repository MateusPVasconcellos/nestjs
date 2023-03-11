import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from './users.service';

describe('UserService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        password_confirmation: 'testpassword',
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(createUserDto);

      const createdUser = await usersService.create(createUserDto);

      expect(createdUser).toEqual(createUserDto);
      expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if the email already exists', async () => {
      const existingUser = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'existingpassword',
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(
        existingUser,
      );

      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: existingUser.email,
        password: 'testpassword',
        password_confirmation: 'testpassword',
      };

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledTimes(2);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });
});
