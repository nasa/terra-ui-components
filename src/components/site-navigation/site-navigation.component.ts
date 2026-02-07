import { property } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './site-navigation.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Site navigation provides a flexible navigation structure with dropdown menus.
 * @documentation https://terra-ui.netlify.app/components/site-navigation
 * @status stable
 * @since 1.0
 *
 * @slot - Navigation items. Can contain `<terra-dropdown>` elements or any custom navigation content.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraSiteNavigation extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** When true, dropdowns use full-width panels instead of normal list-based navigation. */
    @property({ type: Boolean, reflect: true, attribute: 'full-width' })
    fullWidth = false

    render() {
        return html`
            <nav class="navbar" aria-label="Main navigation">
                <ul class="nav-list">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#news">News</a></li>
                    <li class="dropdown">
                        <button
                            class="dropbtn"
                            aria-expanded="false"
                            aria-haspopup="true"
                            id="megamenu-button"
                        >
                            Dropdown
                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                        </button>
                        <div
                            class="dropdown-content"
                            id="megamenu"
                            role="region"
                            aria-labelledby="megamenu-button"
                        >
                            <div class="header">
                                <h2>Mega Menu</h2>
                            </div>
                            <div class="row">
                                <div class="column">
                                    <h3>Category 1</h3>
                                    <ul>
                                        <li><a href="#">Link 1</a></li>
                                        <li><a href="#">Link 2</a></li>
                                        <li><a href="#">Link 3</a></li>
                                    </ul>
                                </div>
                                <div class="column">
                                    <h3>Category 2</h3>
                                    <ul>
                                        <li><a href="#">Link 1</a></li>
                                        <li><a href="#">Link 2</a></li>
                                        <li><a href="#">Link 3</a></li>
                                    </ul>
                                </div>
                                <div class="column">
                                    <h3>Category 3</h3>
                                    <ul>
                                        <li><a href="#">Link 1</a></li>
                                        <li><a href="#">Link 2</a></li>
                                        <li><a href="#">Link 3</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        `
    }
}
