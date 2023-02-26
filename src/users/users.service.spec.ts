import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto = {
      name: 'mock',
      password: 'mock',
      password_confirmation: 'mock',
      email: 'mock@mock.com',
    };
    expect(await service.create(dto)).toEqual({
      id: expect.any(String),
      name: dto.name,
      password: dto.password,
      password_confirmation: dto.password_confirmation,
      email: dto.email,
    });
  });
});
