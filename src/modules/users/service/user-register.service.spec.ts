import bcrypt from 'bcrypt'

import { UserRegisterService } from './user-register.service'
import { ConflictError } from '../../../common'
import { UserRegisterDto } from '../dto'
import { UserModel } from '../model/user.model'
import { UserRepository } from '../repository/user.repository'

describe('UserRegisterService', () => {
  let userRepositoryMock: jest.Mocked<UserRepository>
  let userRegisterService: UserRegisterService
  let passwordHashSpy: jest.SpyInstance

  beforeEach(() => {
    passwordHashSpy = jest.spyOn(bcrypt, 'hash')
    passwordHashSpy.mockResolvedValue('hashedPassword')

    userRepositoryMock = {
      findByEmail: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UserRepository>

    userRegisterService = new UserRegisterService(userRepositoryMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    } as UserRegisterDto

    it('should hash the password, generate userId, and insert the user into the DB', async () => {
      await userRegisterService.register(user)

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email)
      expect(passwordHashSpy).toHaveBeenCalledWith(user.password, 10)
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        ...user,
        password: 'hashedPassword',
      })
    })

    it('should throw ConflictError if email is already in use', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce({
        email: 'test@example.com',
        name: 'Name',
        password: 'Password',
      } as UserModel)

      await expect(userRegisterService.register(user)).rejects.toThrow(
        ConflictError,
      )

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email)
      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(userRepositoryMock.create).not.toHaveBeenCalled()
      expect(userRepositoryMock.create).not.toHaveBeenCalled()
    })
  })
})
