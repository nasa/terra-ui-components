import { Task } from '@lit/task'
import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import TerraButton from '../button/button.js'
import TerraIcon from '../icon/icon.js'
import TerraLoader from '../loader/loader.js'
import styles from './login.styles.js'

/**
 * @summary A form that logs in to Earthdata Login (EDL) and returns a bearer token.
 * @documentation https://disc.gsfc.nasa.gov/components/login
 * @status stable
 * @since 1.0
 *
 * @event terra-login - Emitted when a bearer token has been received from EDL.
 */
export default class TerraLogin extends TerraElement {
    // cspell:disable-next-line
    #clientID = globalThis.atob('QlNsbllwQTdTNmtIbklTRzk5R2pCZw==') // obfuscated public identifier
    #formRef = createRef<HTMLFormElement>()
    #serverURL = globalThis.atob(
        // cspell:disable-next-line
        'aHR0cHM6Ly93aW5kbWlsbC1sb2FkLWJhbGFuY2VyLTY0MTQ5OTIwNy51cy1lYXN0LTEuZWxiLmFtYXpvbmF3cy5jb20vYXBpL3IvZWRsX2xvZ2lu'
    ) // obfuscated URL
    #loginTask = new Task(this, {
        task: async ([], { signal }) => {
            const code = await this.#getAccessCode(signal)
            const accessToken = await this.#exchangeCodeForAccessToken(code, signal)

            this.emit('terra-login', { detail: accessToken })
            this.#clearForm()
        },
    })

    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-loader': TerraLoader,
    }
    static styles: CSSResultGroup = [componentStyles, styles]

    /**
     * Using a fetch that contains our credentials, get a code from EDL that we can use to exchange for an JWT.
     */
    async #getAccessCode(signal: AbortSignal): Promise<string> {
        const formData = new FormData(this.#formRef.value)
        const authURL = `https://urs.earthdata.nasa.gov/oauth/authorize?response_type=code&client_id=${this.#clientID}&redirect_uri=${this.#serverURL}`
        const clientAuth = `credentials=${globalThis.btoa(`${formData.get('username')}:${formData.get('password')}`)}`

        // Send a request to EDL / URS to log the user in, getting an access code in return.
        const loginResponse = await fetch(authURL, {
            body: clientAuth,
            method: 'POST',
            headers: {
                'Content-Length': `${clientAuth.length}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            signal,
        })

        if (!loginResponse.ok) {
            throw new Error('Unable to log in to EDL.')
        }

        const code = new URL(loginResponse.url).searchParams.get('code')

        if (!code) {
            throw new Error('Access code not present in response from EDL.')
        }

        return code
    }
    /**
     * Check for a code and attempt to exchange it for a JWT, accessing only the access_token.
     */
    async #exchangeCodeForAccessToken(code: string, signal: AbortSignal) {
        const tokenResponse = await fetch(`${this.#serverURL}?code=${code}`, {
            signal,
        })

        if (!tokenResponse.ok) {
            throw new Error('Unable to exchange access code for access token.')
        }

        const { access_token } = await tokenResponse.json()

        return access_token
    }

    /**
     * If the user submits our form to log in to EDL, use a fetch request to get an authorization code, then exchange it for an access token.
     */
    async #handleSubmit(event: SubmitEvent) {
        event.preventDefault()

        const username = this.#formRef.value?.elements.namedItem(
            'username'
        ) as HTMLInputElement
        const password = this.#formRef.value?.elements.namedItem(
            'password'
        ) as HTMLInputElement

        const usernameIsValid = !username.validity.valueMissing
        const passwordIsValid = !password.validity.valueMissing

        const usernameFeedback = this.shadowRoot?.querySelector(
            '.form-feedback__username'
        ) as HTMLDivElement
        const passwordFeedback = this.shadowRoot?.querySelector(
            '.form-feedback__password'
        ) as HTMLDivElement

        usernameFeedback.textContent = usernameIsValid ? '' : 'Username is required'
        passwordFeedback.textContent = passwordIsValid ? '' : 'Password is required'

        if (usernameIsValid && passwordIsValid) {
            this.#loginTask.run([])
        }
    }

    #handleKeypress(event: KeyboardEvent) {
        // requirements: the user typed it, it's the Enter key, and they weren't trying to create a line break
        const shouldSubmit =
            event.isTrusted && event.key === 'Enter' && !event.shiftKey

        if (!shouldSubmit) {
            return
        }

        // `submit()` ignores validation constraints
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit
        this.#formRef.value?.requestSubmit()
    }

    /**
     * Clear the given form of all entries.
     */
    #clearForm() {
        this.#formRef.value?.reset()
    }

    render() {
        // Un-focus the form on success.
        if (this.#loginTask.status === 2) {
            ;(document.activeElement as HTMLInputElement).blur()
        }

        return html`
            <form
                ${ref(this.#formRef)}
                @keypress=${this.#handleKeypress}
                @submit=${this.#handleSubmit}
                action=""
                id="edl-login"
                name="terra-login"
                novalidate
            >
                <p>
                    <label for="username"
                        >EDL Username
                        <strong><span aria-label="required">*</span></strong>
                    </label>

                    <input
                        type="text"
                        name="username"
                        autocomplete="username"
                        inputmode="text"
                        required
                        id="username"
                    />

                    <output
                        class="form-feedback form-feedback__username"
                        for="username"
                        name="username-feedback"
                    ></output>
                </p>

                <p>
                    <label for="password"
                        >EDL Password
                        <strong><span aria-label="required">*</span></strong>
                    </label>

                    <input
                        type="password"
                        name="password"
                        autocomplete="current-password"
                        inputmode="text"
                        required
                        id="password"
                    />

                    <output
                        class="form-feedback form-feedback__password"
                        for="password"
                        name="password-feedback"
                    ></output>
                </p>

                <p>
                    <terra-button
                        type="submit"
                        @click=${this.#handleSubmit}
                        data-task-status=${this.#loginTask.status}
                    >
                        ${this.#loginTask.render({
                            pending: () =>
                                html`<span
                                    class="login-task login-task--pending"
                                    slot="prefix"
                                    >&hellip;</span
                                >`,
                            complete: () =>
                                html`<terra-icon
                                    class="login-task login-task--complete"
                                    library="heroicons"
                                    name="solid-check-circle"
                                    slot="prefix"
                                ></terra-icon>`,
                            error: () => html`
                                <terra-icon
                                    class="login-task login-task--error"
                                    library="heroicons"
                                    name="solid-x-circle"
                                    slot="prefix"
                                ></terra-icon>
                            `,
                        })}
                        Sign In</terra-button
                    >

                    <output
                        class="form-feedback form-feedback__form"
                        for="edl-login"
                        name="login-feedback"
                        >${this.#loginTask.status === 3
                            ? `An error occurred and has been logged to you browser's console.`
                            : nothing}</output
                    >
                </p>

                <p class="help-text">
                    <a
                        href="https://urs.earthdata.nasa.gov/documentation/what_do_i_need_to_know"
                        rel="noopener noreferrer"
                        target="_blank"
                        >Earthdata Login (EDL) documentation
                        <terra-icon
                            name="outline-arrow-top-right-on-square"
                            library="heroicons"
                        ></terra-icon>
                    </a>
                </p>
            </form>
        `
    }
}
