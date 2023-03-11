import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        password_confirmation: 'testpassword',
      };

      await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 1,
          name: 'Test User 1',
          email: 'test1@example.com',
          password: 'testpassword1',
        },
        {
          id: 2,
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'testpassword2',
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Test User',
        email: 'updatedtest@example.com',
        password: 'teste',
        old_password: 'teste',
      };

      await controller.update(id, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
