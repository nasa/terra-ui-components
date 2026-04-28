import { expect, fixture, html, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'
import './earthdata-login.js'

function okJson(body: unknown, status = 200) {
    return Promise.resolve(
        new Response(JSON.stringify(body), {
            status,
            headers: { 'Content-Type': 'application/json' },
        })
    )
}

describe('<terra-earthdata-login>', () => {
    let fetchStub: sinon.SinonStub

    beforeEach(() => {
        // Mock fetch so AuthService never calls the real Earthdata Login service
        fetchStub = sinon
            .stub(globalThis, 'fetch')
            .callsFake((input: RequestInfo | URL) => {
                const url = typeof input === 'string' ? input : input.toString()

                // Default successful responses for any auth-related calls
                if (url.includes('/login')) {
                    return okJson({ access_token: 'fake-token' })
                }

                if (url.includes('/user')) {
                    return okJson({
                        user: {
                            uid: 'testuser',
                            first_name: 'Test',
                            last_name: 'User',
                        },
                    })
                }

                return okJson({})
            })
    })

    afterEach(() => {
        sinon.restore()
    })

    it('renders the login form', async () => {
        const el = await fixture<HTMLDivElement>(
            html`<terra-earthdata-login></terra-earthdata-login>`
        )

        const shadowRoot = (el as any).shadowRoot as ShadowRoot
        const usernameInput = shadowRoot.querySelector('#username-input')
        const passwordInput = shadowRoot.querySelector('#password-input')
        const button = shadowRoot.querySelector('terra-button.login-button')

        expect(usernameInput).to.exist
        expect(passwordInput).to.exist
        expect(button).to.exist
    })

    it('shows validation errors when submitting with empty fields', async () => {
        const el: any = await fixture(
            html`<terra-earthdata-login></terra-earthdata-login>`
        )

        const form = el.shadowRoot.querySelector('form') as HTMLFormElement
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

        await el.updateComplete

        const usernameInput: any = el.shadowRoot.querySelector('#username-input')
        const passwordInput: any = el.shadowRoot.querySelector('#password-input')

        expect(usernameInput.errorText).to.equal('Username is required')
        expect(passwordInput.errorText).to.equal('Password is required')
        // When validation fails, we should not attempt a login request
        expect(fetchStub.calledWithMatch(sinon.match('/login'))).to.be.false
    })

    it('submits credentials and calls the login endpoint when form is valid', async () => {
        const el: any = await fixture(
            html`<terra-earthdata-login></terra-earthdata-login>`
        )

        const usernameInput: any = el.shadowRoot.querySelector('#username-input')
        usernameInput.value = 'my-user'
        usernameInput.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
        )

        const passwordInput: any = el.shadowRoot.querySelector('#password-input')
        passwordInput.value = 'my-password'
        passwordInput.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
        )

        await el.updateComplete

        const form = el.shadowRoot.querySelector('form') as HTMLFormElement
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

        expect(fetchStub.called).to.be.true
        expect(
            fetchStub.calledWithMatch(
                sinon.match((arg: RequestInfo | URL) =>
                    typeof arg === 'string'
                        ? arg.includes('/login')
                        : arg.toString().includes('/login')
                )
            )
        ).to.be.true
    })
})
