import mockAxios from 'axios'
import AuthService from './auth'

jest.mock('axios')

describe('AuthService', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return a token when user login', async () => {
        const token = '123.123.123'
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.resolve({ data: { token } })
        })

        const response = await AuthService(mockAxios).login({ email: 'igor@igor.me', password: '123'})
        expect(response.data).toHaveProperty('token')
        expect(response).toMatchSnapshot()
    })

    it('Should return an user when user resgister', async () => {
        const user = {
            name: 'gabriel',
            password: '123',
            email: 'gabriel@gmail.com'
        }

        mockAxios.post.mockImplementationOnce(() => {
            return Promise.resolve({ data: user })
        })

        const response = await AuthService(mockAxios).register(user)
        expect(response.data).toHaveProperty('name')
        expect(response.data).toHaveProperty('password')
        expect(response.data).toHaveProperty('email')
        expect(response.data).toMatchSnapshot()
    })

    it("Should throw and error when there's not network", async () => {
        const errors = { status: 404, statusText: 'Not Found' }
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.resolve({ request: errors })
        })

        const response = await AuthService(mockAxios).login({ email: 'igor@igor.me', password: '123'})
        expect(response.errors).toHaveProperty('status')
        expect(response.errors).toHaveProperty('statusText')
    })
})