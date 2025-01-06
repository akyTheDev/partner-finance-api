import { UserRepository } from './user.repository'

jest.mock('../../../common', () => {
  return {
    BaseRepository: class {
      find = jest.fn()
    },
  }
})

describe('UserRepository', () => {
  let userRepository: UserRepository
  let mockedFind: jest.Mock

  beforeEach(() => {
    userRepository = new UserRepository()
    mockedFind = (userRepository as any).find as jest.Mock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined if no user is found', async () => {
    const email = 'test@example.com'
    mockedFind.mockResolvedValueOnce([])

    const result = await userRepository.findByEmail(email)

    expect(mockedFind).toHaveBeenCalledWith({ email })
    expect(result).toBeUndefined()
  })

  it('should return the first user if a match is found', async () => {
    const email = 'existing@example.com'
    const mockUser = {
      id: 123,
      name: 'Test User',
      email,
      password: 'pass',
    }

    mockedFind.mockResolvedValueOnce([mockUser])

    const result = await userRepository.findByEmail(email)

    expect(result).toEqual(mockUser)
    expect(mockedFind).toHaveBeenCalledWith({ email })
  })
})
