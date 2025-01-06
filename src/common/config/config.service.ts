import 'reflect-metadata'

import { plainToInstance, Type } from 'class-transformer'
import {
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator'

import { ApplicationConfiguration } from './config.model'

export class EnvironmentVariable {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(65535)
  PORT!: number

  @IsString()
  @MinLength(8)
  JWT_SECRET!: string

  @IsString()
  DB_HOST!: string

  @IsString()
  DB_USERNAME!: string

  @IsString()
  DB_PASSWORD!: string

  @IsString()
  DB_NAME!: string

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(65535)
  DB_PORT!: number
}

export class ConfigService {
  private readonly _config: ApplicationConfiguration

  constructor() {
    const envVariables: Record<string, string> = {
      PORT: process.env.PORT!,
      JWT_SECRET: process.env.JWT_SECRET!,
      DB_HOST: process.env.DB_HOST!,
      DB_USERNAME: process.env.DB_USERNAME!,
      DB_PASSWORD: process.env.DB_PASSWORD!,
      DB_NAME: process.env.DB_NAME!,
      DB_PORT: process.env.DB_PORT!,
    }

    const validatedConfig = this.validate(envVariables)

    this._config = {
      PORT: validatedConfig.PORT,
      JWT_SECRET: validatedConfig.JWT_SECRET,
      DB: {
        HOST: validatedConfig.DB_HOST,
        USERNAME: validatedConfig.DB_USERNAME,
        PASSWORD: validatedConfig.DB_PASSWORD,
        NAME: validatedConfig.DB_NAME,
        PORT: validatedConfig.DB_PORT,
      },
    }
    console.log('CONFIG IS READY!')
  }

  get config(): ApplicationConfiguration {
    return this._config
  }

  private validate(
    environmentVariable: Record<string, string>,
  ): EnvironmentVariable {
    const validatedConfig = plainToInstance(
      EnvironmentVariable,
      environmentVariable,
      {
        enableImplicitConversion: true,
      },
    )

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    })

    if (errors.length > 0) {
      throw new Error(
        `Environment variable validation error: ${errors.toString()}`,
      )
    }

    return validatedConfig
  }
}
