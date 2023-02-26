import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UsersRepository } from './repository/users-repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    create: jest
      .fn()
      .mockImplementation((dto) =>
        Promise.resolve({ id: randomUUID(), ...dto }),
      ),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
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
