import bcrypt from 'bcrypt'

import { ConflictError } from '../../../common'
import { UserRegisterDto } from '../dto'
import { UserModel } from '../model'
import { UserRepository } from '../repository'

export class UserRegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Register new user to the application.
   *
   * @param user User details to insert to db.
   * @returns Void
   * @throws {ConflictError} if the email is already in use.
   */
  async register(userRegisterDto: UserRegisterDto): Promise<void> {
    await this.checkEmail(userRegisterDto.email)
    const hashedPassword = await this.hashPassword(userRegisterDto.password)
    await this.insertUserToDb(userRegisterDto, hashedPassword)
  }

  /**
   * Check whether the email is already in use.
   *
   * @param email - The email to check.
   * @returns void
   * @throws {ConflictError} if the email is already in use.
   */
  private async checkEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.find({
      email,
    })
    if (existingUser && existingUser.length > 0) {
      throw new ConflictError('Email already in use.')
    }
  }

  /**
   * Hash the given password.
   *
   * @param password - The password to hash.
   * @returns The hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Inserts the given user to the database.
   *
   * @param user User info to insert to db.
   * @param hashedPassword Hashed password.
   * @param userId Unique id generated for the user
   * @returns void
   */
  private async insertUserToDb(
    user: UserRegisterDto,
    hashedPassword: string,
  ): Promise<void> {
    const newUser: Omit<UserModel, 'id'> = {
      ...user,
      password: hashedPassword,
    }

    await this.userRepository.create(newUser)
  }
}
