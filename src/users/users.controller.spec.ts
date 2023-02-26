import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = {
      name: 'mock',
      password: 'mock',
      password_confirmation: 'mock',
      email: 'mock@mock.com',
    };
    expect(controller.create(dto)).toEqual({
      id: expect.any(String),
      name: dto.name,
      password: dto.password,
      password_confirmation: dto.password_confirmation,
      email: dto.email,
    });

    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', () => {
    const dto = {
      password: 'mock',
      old_password: 'mock',
    };

    expect(controller.update('1', dto)).toEqual({
      id: '1',
      ...dto,
    });

    expect(mockUsersService.update).toHaveBeenCalledWith('1', { ...dto });
  });
});
