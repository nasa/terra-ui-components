import { property, query, state } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-subsetter-history.styles.js'
import type { CSSResultGroup } from 'lit'
import { DataSubsetterHistoryController } from './data-subsetter-history.controller.js'
import {
    Status,
    type SubsetJobs,
    type SubsetJobStatus,
} from '../../data-services/types.js'
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

    @property()
    label: string = 'History'

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
                    <span>${this.label}</span>
                </div>

                <div class="history-panel">
                    <div
                        style="display: flex; align-items: center; justify-content: flex-end; padding: 5px 20px;"
                    >
                        <a
                            href="https://harmony.earthdata.nasa.gov/jobs"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="font-size: 0.98em; color: #0066cc; text-decoration: none; display: flex; align-items: center; gap: 4px;"
                        >
                            View all
                            <terra-icon
                                name="outline-arrow-top-right-on-square"
                                library="heroicons"
                                size="32px"
                            ></terra-icon>
                        </a>
                    </div>
                    <div class="history-list">
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
                let fillColor = '#0066cc'
                if (
                    job.status === Status.SUCCESSFUL ||
                    job.status === Status.COMPLETE_WITH_ERRORS ||
                    job.status === Status.RUNNING_WITH_ERRORS
                ) {
                    fillColor = '#28a745' // green
                } else if (job.status === Status.FAILED) {
                    fillColor = '#dc3545' // red
                } else if (job.status === Status.CANCELED) {
                    fillColor = '#ffc107' // orange/yellow
                }

                const progressLabel =
                    job.status === Status.FAILED || job.status === Status.CANCELED
                        ? job.status
                        : `${job.progress}%`
                const progress =
                    job.status === Status.FAILED || job.status === Status.CANCELED
                        ? 100
                        : job.progress

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
                                style="width: ${progress}%; background-color: ${fillColor}"
                            >
                                ${progressLabel}
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
