import { property, state } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter-history.styles.js'
import type { CSSResultGroup } from 'lit'
import { DataSubsetterHistoryController } from './data-subsetter-history.controller.js'
import type { SubsetJobs } from '../../data-services/types.js'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/data-subsetter-history
 * @status experimental
 * @since 1.0
 *
 * @dependency terra-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class TerraDataSubsetterHistory extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @property({ attribute: 'bearer-token' })
    bearerToken: string

    @state()
    collapsed: boolean = false

    #controller = new DataSubsetterHistoryController(this)

    connectedCallback(): void {
        super.connectedCallback()
        this.addController(this.#controller)
    }

    private toggleCollapsed() {
        this.collapsed = !this.collapsed
    }

    render() {
        return html`
            <div class="${this.collapsed ? 'collapsed' : ''}">
                <div class="history-header" @click=${this.toggleCollapsed}>
                    <span class="count">0:1</span>
                    <span>History</span>
                </div>

                <div class="history-panel">
                    <div class="tabs">
                        <button class="tab active">
                            All <span class="count">1</span>
                        </button>
                        <button class="tab">Done <span class="count">0</span></button>
                        <button class="tab">
                            Active <span class="count">1</span>
                        </button>
                    </div>

                    <div class="history-list">
                        <p>${this.#controller.task.status}</p>

                        ${this.#controller.jobs
                            ? this.#renderHistoryItems(this.#controller.jobs)
                            : nothing}
                    </div>
                </div>
            </div>
        `
    }

    #renderHistoryItems(subsetJobs: SubsetJobs) {
        return subsetJobs.jobs
            .filter(job => job.labels?.length)
            .map(
                job => html`
                    <div class="history-item">
                        <div class="item-header">
                            <span class="icon">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="12" fill="#7c4dff" />
                                    <path
                                        d="M12 7v6m0 0v4m0-4h4m-4 0H8"
                                        stroke="#fff"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>

                            <span class="item-title">
                                ${job.labels?.length
                                    ? job.labels.join(' ')
                                    : job.request.split('.nasa.gov').pop()}
                            </span>
                        </div>

                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 29%">29%</div>
                        </div>
                    </div>
                `
            )
    }
}
