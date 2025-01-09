import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UserLoginService } from './user-login.service'
import { UnauthorizedError } from '../../../common'
import { UserLoginDto } from '../dto'
import { UserRepository } from '../repository/user.repository'

describe('UserLoginService', () => {
  let userRepositoryMock: jest.Mocked<UserRepository>
  let service: UserLoginService
  let passwordCompareSpy: jest.SpyInstance
  let jwtSpy: jest.SpyInstance

  const user = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'storedPassword',
  }

  beforeEach(() => {
    passwordCompareSpy = jest.spyOn(bcrypt, 'compare')
    passwordCompareSpy.mockResolvedValue(true)

    jwtSpy = jest.spyOn(jwt, 'sign')
    jwtSpy.mockReturnValue('token')

    userRepositoryMock = {
      findByEmail: jest.fn().mockResolvedValue(user),
      create: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UserRepository>

    service = new UserLoginService(userRepositoryMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    const userLoginDto = {
      email: 'test@example.com',
      password: 'password123',
    } as UserLoginDto

    it('should throw unauthorized error if user is not found', async () => {
      userRepositoryMock.findByEmail.mockResolvedValueOnce(undefined)

      await expect(service.login(userLoginDto)).rejects.toThrow(
        UnauthorizedError,
      )

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        userLoginDto.email,
      )
    })

    it('should throw unauthorized error if password is incorrect', async () => {
      passwordCompareSpy.mockResolvedValue(false)

      await expect(service.login(userLoginDto)).rejects.toThrow(
        UnauthorizedError,
      )

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        userLoginDto.email,
      )
    })

    it('should return token if user is found and password is correct', async () => {
      const token = await service.login(userLoginDto)

      expect(token).toEqual({
        access_token: 'token',
        token_type: 'bearer',
      })

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        userLoginDto.email,
      )

      expect(passwordCompareSpy).toHaveBeenCalledWith(
        userLoginDto.password,
        'storedPassword',
      )

      expect(jwtSpy).toHaveBeenCalledWith({ userId: 'user1' }, 'supersecret')
    })
  })
})
