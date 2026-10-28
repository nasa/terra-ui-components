import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import TerraButton from '../button/button.js'
import TerraIcon from '../icon/icon.js'
import TerraInput from '../input/input.js'
import TerraLoader from '../loader/loader.js'
import styles from './earthdata-login.styles.js'
import { property, state, query } from 'lit/decorators.js'
import { AuthMixin } from '../../mixins/auth.mixin.js'

/**
 * @summary A form that logs in to Earthdata Login (EDL)
 * @documentation https://terra-ui.netlify.app/components/earthdata-login
 * @status stable
 * @since 1.0
 *
 * @event terra-login - Emitted when a bearer token has been received from EDL.
 */
export default class TerraEarthdataLogin extends AuthMixin(TerraElement) {
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-input': TerraInput,
        'terra-loader': TerraLoader,
    }
    static styles: CSSResultGroup = [componentStyles, styles]

    /**
     * The message to show when the user is logged in
     * You can use the following placeholders:
     * {username} - The username of the user
     * {first_name} - The first name of the user
     * {last_name} - The last name of the user
     */
    @property({ attribute: 'logged-in-message' })
    loggedInMessage?: string

    @property({ attribute: 'logged-out-message' })
    loggedOutMessage?: string

    @property({ attribute: 'loading-message' })
    loadingMessage?: string

    @property()
    username: string = ''

    @property()
    password: string = ''

    @property({ attribute: 'hide-password-toggle', type: Boolean })
    hidePasswordToggle = false

    /**
     * if true and the user has passed in a username and password, we will automatically log them in
     * this is useful for Jupyter Notebooks where we may want to automatically log the user in when the component is rendered
     */
    @property({ attribute: 'auto-login', type: Boolean })
    autoLogin = false

    @state() usernameError: string = ''
    @state() passwordError: string = ''

    @query('#username-input') usernameInput?: TerraInput
    @query('#password-input') passwordInput?: TerraInput

    firstUpdated(): void {
        if (this.username && this.password) {
            // user passed in a password, we should hide the toggle for security
            this.hidePasswordToggle = true

            if (this.autoLogin) {
                this.loginWithCredentials(this.username, this.password)
            }
        }
    }

    render() {
        return html`
            <div class="login-container">
                <div class="login-header">
                    <a>
                        <terra-icon name="nasa-logo"></terra-icon>
                        <h1>Earthdata Login</h1>
                    </a>
                    <a
                        href="https://urs.earthdata.nasa.gov/documentation/what_do_i_need_to_know"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="help-link"
                        aria-label="Need help?"
                    >
                        <terra-icon name="question"></terra-icon>
                    </a>
                </div>

                ${
                    this.authState.user?.uid
                        ? html`<div class="login-form">
                          <p>
                              ${this.authState.user.first_name},<br />
                              You've successfully authenticated with Earthdata Login!
                          </p>
                          <terra-button
                              @click=${() => this.logout()}
                              size="small"
                              outline
                              >Logout</terra-button
                          >
                      </div>`
                        : html`
                          <form class="login-form" @submit=${this.#handleFormSubmit}>
                              <terra-input
                                  id="username-input"
                                  label="Username"
                                  name="username"
                                  type="text"
                                  .value=${this.username}
                                  ?disabled=${this.isLoggingIn}
                                  autocomplete="username"
                                  .errorText=${this.usernameError || ''}
                                  required
                                  @input=${this.#handleUsernameInput}
                                  @blur=${this.#validateUsername}
                              ></terra-input>

                              <terra-input
                                  id="password-input"
                                  label="Password"
                                  name="password"
                                  type="password"
                                  autocomplete="current-password"
                                  ?password-toggle=${!this.hidePasswordToggle}
                                  ?disabled=${this.isLoggingIn}
                                  .value=${this.password}
                                  .errorText=${this.passwordError || ''}
                                  required
                                  @input=${this.#handlePasswordInput}
                                  @blur=${this.#validatePassword}
                              ></terra-input>

                              <terra-button
                                  type="submit"
                                  variant="primary"
                                  class="login-button"
                                  ?disabled=${this.isLoggingIn}
                              >
                                  ${this.isLoggingIn ? 'Logging In...' : 'Log in'}
                              </terra-button>

                              ${
                                  this.authState.error
                                      ? html`<div class="form-feedback">
                                        ${this.authState.error}
                                        ${
                                            this.authState.error ===
                                            'Invalid user credentials'
                                                ? html`<p>
                                                  <a
                                                      class="link"
                                                      href="https://urs.earthdata.nasa.gov/retrieve_info"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      >Forgot username?</a
                                                  >
                                                  <a
                                                      class="link"
                                                      href="https://urs.earthdata.nasa.gov/reset_passwords/new"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      >Forgot password?</a
                                                  >
                                              </p>`
                                                : nothing
                                        }
                                    </div>`
                                      : ''
                              }
                              <a
                                  class="link register-link"
                                  href="https://urs.earthdata.nasa.gov/users/new"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  >Register for a profile</a
                              >
                          </form>
                      `
                }
            </div>
        `
    }

    #handleUsernameInput(event: Event) {
        const input = event.target as TerraInput
        this.username = input.value
        // Clear error when user starts typing and field becomes valid
        if (
            this.usernameError &&
            this.username &&
            this.usernameInput?.checkValidity()
        ) {
            this.usernameError = ''
            if (this.usernameInput) {
                this.usernameInput.setCustomValidity('')
            }
        }
    }

    #handlePasswordInput(event: Event) {
        const input = event.target as TerraInput
        this.password = input.value
        // Clear error when user starts typing and field becomes valid
        if (
            this.passwordError &&
            this.password &&
            this.passwordInput?.checkValidity()
        ) {
            this.passwordError = ''
            if (this.passwordInput) {
                this.passwordInput.setCustomValidity('')
            }
        }
    }

    #validateUsername() {
        if (!this.username || this.username.trim() === '') {
            this.usernameError = 'Username is required'
            if (this.usernameInput) {
                this.usernameInput.setCustomValidity('Username is required')
            }
        } else {
            // Clear error when field is valid
            this.usernameError = ''
            if (this.usernameInput) {
                this.usernameInput.setCustomValidity('')
            }
        }
    }

    #validatePassword() {
        if (!this.password || this.password.trim() === '') {
            this.passwordError = 'Password is required'
            if (this.passwordInput) {
                this.passwordInput.setCustomValidity('Password is required')
            }
        } else {
            // Clear error when field is valid
            this.passwordError = ''
            if (this.passwordInput) {
                this.passwordInput.setCustomValidity('')
            }
        }
    }

    #handleFormSubmit(event: Event) {
        event.preventDefault()

        this.#validateUsername()
        this.#validatePassword()

        const form = event.target as HTMLFormElement
        if (form.checkValidity() && this.username && this.password) {
            this.loginWithCredentials(this.username, this.password)
        } else {
            // Report validity to trigger validation and show error messages
            // This will set data-user-invalid on the inputs, which will display errors
            if (this.usernameInput) {
                this.usernameInput.reportValidity()
            }
            if (this.passwordInput) {
                this.passwordInput.reportValidity()
            }
        }
    }
}
