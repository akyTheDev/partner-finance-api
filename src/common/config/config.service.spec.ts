import { ApplicationConfiguration } from './config.model'
import { ConfigService } from './config.service'

describe('ConfigService', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should create a valid configuration', () => {
    process.env.PORT = '5000'
    process.env.JWT_SECRET = 'supersecret'
    process.env.DB_HOST = 'localhost'
    process.env.DB_USERNAME = 'admin'
    process.env.DB_PASSWORD = 'password'
    process.env.DB_NAME = 'postgres'
    process.env.DB_PORT = '5432'

    const configService = new ConfigService()
    const config: ApplicationConfiguration = configService.config

    expect(config).toEqual({
      PORT: 5000,
      JWT_SECRET: 'supersecret',
      DB: {
        HOST: 'localhost',
        USERNAME: 'admin',
        PASSWORD: 'password',
        NAME: 'postgres',
        PORT: 5432,
      },
    })
  })

  it('should throw an error if environment variables are not correct', () => {
    delete process.env.PORT

    expect(() => new ConfigService()).toThrow(
      'Environment variable validation error',
    )
  })
})
