import { expect, fixture, html } from '@open-wc/testing'
import sinon from 'sinon'
import { LitElement, html as litHtml } from 'lit'
import { AuthMixin } from '../auth.mixin.js'
import { authService, type AuthState, type User } from '../../auth/auth.service.js'

class TestAuthElement extends AuthMixin(LitElement) {
    override render() {
        return litHtml`<span>${this.authState?.user?.uid ?? 'anonymous'}</span>`
    }
}

if (!customElements.get('test-auth-element')) {
    customElements.define('test-auth-element', TestAuthElement)
}

describe('AuthMixin', () => {
    let subscribeStub: sinon.SinonStub
    let getStateStub: sinon.SinonStub
    let loginStub: sinon.SinonStub
    let logoutStub: sinon.SinonStub
    let loginWithCredentialsStub: sinon.SinonStub
    let activeListener: ((state: AuthState) => void) | null = null
    let unsubscribeSpy: sinon.SinonSpy

    const defaultLoggedOutState: AuthState = {
        user: null,
        token: null,
        isLoading: false,
        error: null,
    }

    beforeEach(() => {
        activeListener = null
        unsubscribeSpy = sinon.spy()

        getStateStub = sinon
            .stub(authService, 'getState')
            .returns(defaultLoggedOutState)

        subscribeStub = sinon
            .stub(authService, 'subscribe')
            .callsFake(
                (listener: (state: AuthState) => void, bearerToken?: string) => {
                    activeListener = listener
                    if (bearerToken) {
                        listener({
                            user: null,
                            token: bearerToken,
                            isLoading: false,
                            error: null,
                        })
                    } else {
                        listener(authService.getState())
                    }
                    return unsubscribeSpy
                }
            )

        loginStub = sinon.stub(authService, 'login')
        logoutStub = sinon.stub(authService, 'logout')
        loginWithCredentialsStub = sinon.stub(authService, 'loginWithCredentials')
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('initialization and lifecycle', () => {
        it('initializes authState from authService.getState()', async () => {
            const loggedInState: AuthState = {
                user: { uid: 'user1', first_name: 'Test', last_name: 'User' },
                token: 'token-abc',
                isLoading: false,
                error: null,
            }
            getStateStub.returns(loggedInState)

            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            expect(el.authState).to.deep.equal(loggedInState)
            expect(el.bearerToken).to.equal('token-abc')
            expect(el.isAuthenticated).to.be.true
        })

        it('subscribes to authService on connectedCallback and unsubscribes on disconnectedCallback', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            expect(subscribeStub.calledOnce).to.be.true

            el.remove()

            expect(unsubscribeSpy.calledOnce).to.be.true
        })

        it('passes bearerToken attribute to authService.subscribe', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element
                    bearer-token="my-token-123"
                ></test-auth-element>`
            )

            expect(subscribeStub.calledWith(sinon.match.func, 'my-token-123')).to.be
                .true
            expect(el.bearerToken).to.equal('my-token-123')
        })
    })

    describe('reactivity and events', () => {
        it('updates authState and bearerToken when authService emits a new state', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            expect(activeListener).to.be.a('function')

            const newUser: User = {
                uid: 'jane',
                first_name: 'Jane',
                last_name: 'Doe',
            }
            const updatedState: AuthState = {
                user: newUser,
                token: 'new-token-456',
                isLoading: false,
                error: null,
            }

            activeListener!(updatedState)
            await el.updateComplete

            expect(el.authState).to.deep.equal(updatedState)
            expect(el.bearerToken).to.equal('new-token-456')
            expect(el.isAuthenticated).to.be.true
        })

        it('emits terra-login custom event when authService notifies listeners', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            let eventDetail: AuthState | null = null
            el.addEventListener('terra-login', (e: Event) => {
                eventDetail = (e as CustomEvent<AuthState>).detail
            })

            const updatedState: AuthState = {
                user: { uid: 'john', first_name: 'John', last_name: 'Smith' },
                token: 'token-xyz',
                isLoading: false,
                error: null,
            }

            activeListener!(updatedState)

            expect(eventDetail).to.deep.equal(updatedState)
        })
    })

    describe('isAuthenticated getter', () => {
        it('returns false when token is absent', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            el.authState = { user: null, token: null, isLoading: false, error: null }
            expect(el.isAuthenticated).to.be.false
        })

        it('returns false when isLoading is true even if token exists', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            el.authState = {
                user: null,
                token: 'token-123',
                isLoading: true,
                error: null,
            }
            expect(el.isAuthenticated).to.be.false
        })

        it('returns true when token is present and isLoading is false', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            el.authState = {
                user: null,
                token: 'token-123',
                isLoading: false,
                error: null,
            }
            expect(el.isAuthenticated).to.be.true
        })
    })

    describe('delegated methods', () => {
        it('delegates login() to authService.login()', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            el.login()
            expect(loginStub.calledOnce).to.be.true
        })

        it('delegates logout() to authService.logout()', async () => {
            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            el.logout()
            expect(logoutStub.calledOnce).to.be.true
        })

        it('delegates loginWithCredentials and manages isLoggingIn state on success', async () => {
            const mockUser: User = {
                uid: 'auth-user',
                first_name: 'Auth',
                last_name: 'User',
            }
            let resolveLogin: (user: User) => void

            loginWithCredentialsStub.returns(
                new Promise<User>(resolve => {
                    resolveLogin = resolve
                })
            )

            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            expect(el.isLoggingIn).to.be.false

            const loginPromise = el.loginWithCredentials('user', 'secret')

            expect(el.isLoggingIn).to.be.true
            expect(loginWithCredentialsStub.calledWith('user', 'secret')).to
                .be.true

            resolveLogin!(mockUser)
            const result = await loginPromise

            expect(result).to.deep.equal(mockUser)
            expect(el.isLoggingIn).to.be.false
        })

        it('resets isLoggingIn state even when loginWithCredentials throws', async () => {
            let rejectLogin: (err: Error) => void

            loginWithCredentialsStub.returns(
                new Promise<User>((_, reject) => {
                    rejectLogin = reject
                })
            )

            const el = await fixture<TestAuthElement>(
                html`<test-auth-element></test-auth-element>`
            )

            const loginPromise = el.loginWithCredentials('user', 'invalid')
            expect(el.isLoggingIn).to.be.true

            rejectLogin!(new Error('Invalid credentials'))

            try {
                await loginPromise
                expect.fail('Expected loginWithCredentials to reject')
            } catch (err) {
                expect((err as Error).message).to.equal('Invalid credentials')
            }

            expect(el.isLoggingIn).to.be.false
        })
    })
})
