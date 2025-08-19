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
 * @documentation https://disc.gsfc.nasa.gov/components/login
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
                : html`<slot
                      name="logged-in"
                      .user=${this.#authController.state.user}
                  ></slot>`}`
        }

        if (this.#authController.state.isLoading) {
            // we don't know yet if the user is logged in or out, so show the loading slot
            return html`<slot name="loading"></slot>`
        }

        // user is definitely logged out, show the login button
        return html` <slot name="logged-out"></slot
            ><terra-button @click=${this.login}> ${this.buttonLabel}</terra-button>`
    }
}
