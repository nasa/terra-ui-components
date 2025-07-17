import { property, query, state } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter-history.styles.js'
import type { CSSResultGroup } from 'lit'
import { DataSubsetterHistoryController } from './data-subsetter-history.controller.js'
import type { SubsetJobs, SubsetJobStatus } from '../../data-services/types.js'
import TerraIcon from '../icon/icon.component.js'
import TerraDataSubsetter from '../data-subsetter/data-subsetter.component.js'
import TerraDialog from '../dialog/dialog.component.js'

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
    static dependencies: Record<string, typeof TerraElement> = {
        'terra-icon': TerraIcon,
        'terra-data-subsetter': TerraDataSubsetter,
        'terra-dialog': TerraDialog,
    }
    static styles: CSSResultGroup = [componentStyles, styles]

    @property({ attribute: 'bearer-token' })
    bearerToken: string

    @state()
    collapsed: boolean = false

    @state()
    selectedJob?: string

    @query('[part~="dialog"]')
    dialog: TerraDialog

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
                        ${this.selectedJob}
                        ${this.#controller.jobs
                            ? this.#renderHistoryItems(this.#controller.jobs)
                            : nothing}
                    </div>
                </div>
            </div>

            <terra-dialog part="dialog" width="1500px">
                <terra-data-subsetter
                    .jobId=${this.selectedJob}
                    .bearerToken=${this.bearerToken}
                ></terra-data-subsetter>
            </terra-dialog>
        `
    }

    #renderHistoryItems(subsetJobs: SubsetJobs) {
        return subsetJobs.jobs
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map(job => {
                let fillColor = '#0066cc' // default blue
                if (job.status === 'successful') {
                    fillColor = '#28a745' // green
                } else if (job.status === 'failed') {
                    fillColor = '#dc3545' // red
                } else if (
                    job.status === 'canceled' ||
                    job.status === 'complete_with_errors' ||
                    job.status === 'running_with_errors'
                ) {
                    fillColor = '#ffc107' // orange/yellow
                }
                return html`
                    <div
                        class="history-item"
                        @click=${this.#handleHistoryItemClick.bind(this, job)}
                    >
                        <div class="item-header">
                            <span class="item-title">
                                ${job.labels?.length
                                    ? job.labels.join(' ')
                                    : job.request.split('.nasa.gov').pop()}
                            </span>
                        </div>

                        <div class="progress-bar">
                            <div
                                class="progress-fill"
                                style="width: ${job.progress}%; background-color: ${fillColor}"
                            >
                                ${job.progress}%
                            </div>
                        </div>
                    </div>
                `
            })
    }

    #handleHistoryItemClick(job: SubsetJobStatus) {
        this.selectedJob = job.jobID
        this.dialog?.show()
    }
}
