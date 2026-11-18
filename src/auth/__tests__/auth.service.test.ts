import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { authService, type User } from '../auth.service.js'

describe('AuthService', () => {
    beforeEach(async () => {
        await Promise.resolve()
        localStorage.removeItem('terra-token')
        authService.logout()
    })

    afterEach(() => {
        sinon.restore()
        localStorage.removeItem('terra-token')
        authService.logout()
    })

    it('clears expired terra-token from localStorage and keeps authState.token null when /user fails', async () => {
        localStorage.setItem('terra-token', 'expired-token')

        let resolveFetch!: (response: Response) => void
        sinon.stub(globalThis, 'fetch').returns(
            new Promise<Response>(resolve => {
                resolveFetch = resolve
            })
        )

        const authPromise = authService.authenticate()

        // Unverified token from localStorage must not be broadcast while /user is in-flight
        expect(authService.getState().isLoading).to.be.true
        expect(authService.getState().token).to.be.null

        resolveFetch(
            new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                statusText: 'Unauthorized',
                headers: { 'Content-Type': 'application/json' },
            })
        )

        await authPromise

        expect(localStorage.getItem('terra-token')).to.be.null
        expect(authService.getState().token).to.be.null
        expect(authService.getState().user).to.be.null
        expect(authService.getState().isLoading).to.be.false
        expect(authService.getState().error).to.equal('Unauthorized')
    })

    it('stores validated token and user in authState when /user succeeds', async () => {
        const mockUser: User = {
            uid: 'valid-user',
            first_name: 'Valid',
            last_name: 'User',
        }
        localStorage.setItem('terra-token', 'valid-token')

        sinon.stub(globalThis, 'fetch').resolves(
            new Response(JSON.stringify({ user: mockUser }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        )

        await authService.authenticate()

        expect(authService.getState().token).to.equal('valid-token')
        expect(authService.getState().user).to.deep.equal(mockUser)
        expect(authService.getState().isLoading).to.be.false
        expect(authService.getState().error).to.be.null
    })
})
