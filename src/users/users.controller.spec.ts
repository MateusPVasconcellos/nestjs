import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const dtoCreateUser = {
    name: 'mock',
    password: 'mock',
    password_confirmation: 'mock',
    email: 'mock@mock',
  };

  const dtoUpdateUser = {
    id: '1',
    password: 'mock',
    old_password: 'mock',
  };

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return ['mock', 'mock'];
    }),
    remove: jest.fn((id) => {
      return {
        id,
        name: 'mock',
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
    expect(controller.create(dtoCreateUser)).toEqual({
      ...dtoCreateUser,
    });
  });

  it('should update a user', () => {
    expect(controller.update('1', dtoUpdateUser)).toEqual({
      ...dtoUpdateUser,
    });
  });

  it('should return an array of users', () => {
    expect(controller.findAll()).toEqual(['mock', 'mock']);
  });

  it('should delete a user', () => {
    expect(controller.remove('1')).toEqual({ id: '1', name: 'mock' });
  });
});
