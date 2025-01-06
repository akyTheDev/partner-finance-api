import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { logger, UnauthorizedError } from '../../../common'
import { config } from '../../../common/config'
import { UserLoginDto } from '../dto'
import { JwtPayload } from '../interface'
import { UserModel } from '../model/user.model'
import { UserRepository } from '../repository'

export class UserLoginService {
  private readonly JWT_SECRET = config.JWT_SECRET

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Check user credentials and generate a JWT token.
   *
   * @param userLoginDto - The user login dto.
   * @returns The object that includes JWT token.
   * @throws {UnauthorizedError} if user is not found or password is incorrect
   */
  async login(userLoginDto: UserLoginDto): Promise<JwtPayload> {
    this.logUserLogin(userLoginDto.email)
    const user = await this.getUser(userLoginDto.email)
    await this.checkPassword(userLoginDto.password, user.password)
    return {
      access_token: this.generateJwtToken(user.id),
      token_type: 'bearer',
    }
  }

  /**
   * Get user info from db.
   *
   * @param email - The email of the user.
   * @returns The user info.
   * @throws {UnauthorizedError} if user is not found.
   */
  private async getUser(email: string): Promise<UserModel> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedError()
    }
    return user
  }

  /**
   * Compare the given passwords and throw an error if they don't match.
   *
   * @param password - The password given by the user to compare.
   * @param hashedPassword - The password stored in the database.
   * @throws {UnauthorizedError} if the passwords don't match.
   */
  private async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw new UnauthorizedError()
    }
  }

  /**
   * Generate a JWT token for the user.
   *
   * @param userId - The user id to generate jwt token.
   * @return The JWT token that includes user id.
   */
  private generateJwtToken(userId: number): string {
    return jwt.sign(
      {
        userId,
      },
      this.JWT_SECRET,
    )
  }

  /**
   * Logs a user's login activity.
   *
   * @param email - The email address of the user logging in.
   * @return Void
   */
  private logUserLogin(email: string): void {
    logger.info(
      JSON.stringify({
        message: 'Login',
        email,
        time: new Date().toISOString(),
      }),
    )
  }
}
