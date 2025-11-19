import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import TerraButton from '../button/button.js'
import TerraIcon from '../icon/icon.js'
import TerraLoader from '../loader/loader.js'
import styles from './login.styles.js'
import { property } from 'lit/decorators.js'
import { AuthController } from '../../auth/auth.controller.js'

/**
 * @summary A form that logs in to Earthdata Login (EDL) and returns a bearer token.
 * @documentation https://terra-ui.netlify.app/components/login
 * @status stable
 * @since 1.0
 *
 * @event terra-login - Emitted when a bearer token has been received from EDL.
 */
export default class TerraLogin extends TerraElement {
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-loader': TerraLoader,
    }
    static styles: CSSResultGroup = [componentStyles, styles]

    @property({ attribute: 'button-label' })
    buttonLabel: string = 'Earthdata Login'

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

    #authController = new AuthController(this)

    login() {
        this.#authController.login()
    }

    logout() {
        this.#authController.logout()
    }

    render() {
        if (this.#authController.state.user?.uid) {
            // by default we don't show anything in the logged in slot, but if the user wants to show something
            // they can use the logged-in slot
            const template = this.querySelector<HTMLTemplateElement>(
                'template[slot="logged-in"]'
            )

            return html`${template
                ? template.content.cloneNode(true)
                : html`<slot name="logged-in" .user=${this.#authController.state.user}
                      >${this.#applyUserToMessage(this.loggedInMessage)}</slot
                  >`}`
        }

        if (this.#authController.state.isLoading) {
            // we don't know yet if the user is logged in or out, so show the loading slot
            return html`<slot name="loading">${this.loadingMessage}</slot>`
        }

        // user is definitely logged out, show the login button
        return html` <slot name="logged-out">${this.loggedOutMessage}</slot
            ><terra-button @click=${this.login}> ${this.buttonLabel}</terra-button>`
    }

    #applyUserToMessage(message?: string) {
        return (message ?? '')
            .replace('{username}', this.#authController.state.user?.uid ?? '')
            .replace(
                '{first_name}',
                this.#authController.state.user?.first_name ?? ''
            )
            .replace('{last_name}', this.#authController.state.user?.last_name ?? '')
    }
}
