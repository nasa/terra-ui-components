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
import { AuthController } from '../../auth/auth.controller.js'

/**
 * @summary Shows a floating panel with a user's recent data subset requests and their status, with quick access to results and re-submission.
 * @documentation https://disc.gsfc.nasa.gov/components/data-subsetter-history
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 * @dependency terra-data-subsetter
 * @dependency terra-dialog
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

    /**
     * if a user has never done a subset request, by default they don't see the history panel at all
     * this prop allows you to override that behavior and always show the history panel
     */
    @property({ attribute: 'always-show', type: Boolean })
    alwaysShow: boolean

    @state()
    collapsed: boolean = true

    @state()
    selectedJob?: string

    @state()
    hideCancelled: boolean = true

    @query('[part~="dialog"]')
    dialog: TerraDialog

    #controller = new DataSubsetterHistoryController(this)
    _authController = new AuthController(this)

    connectedCallback(): void {
        super.connectedCallback()
        this.addController(this.#controller)
    }

    private toggleCollapsed() {
        this.collapsed = !this.collapsed
    }

    render() {
        const jobs = this.#controller.jobs
        const hasJobs = jobs && jobs.jobs.length > 0

        if (!hasJobs) {
            // hide the history panel if the user doesn't have any requests
            return nothing
        }

        return html`
            <div class="${this.collapsed ? 'collapsed' : ''}">
                <div class="history-header" @click=${this.toggleCollapsed}>
                    <span>${this.label}</span>
                </div>

                <div class="history-panel">
                    ${hasJobs
                        ? html`
                              <div class="history-link-row">
                                  <label>
                                      <input
                                          type="checkbox"
                                          .checked=${this.hideCancelled}
                                          @change=${(e: Event) => {
                                              this.hideCancelled = (
                                                  e.target as HTMLInputElement
                                              ).checked
                                          }}
                                      />
                                      Hide Cancelled
                                  </label>

                                  <a
                                      href="https://harmony.earthdata.nasa.gov/workflow-ui"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="history-link"
                                  >
                                      View all
                                      <terra-icon
                                          name="outline-arrow-top-right-on-square"
                                          library="heroicons"
                                          size="32px"
                                      ></terra-icon>
                                  </a>
                              </div>
                          `
                        : nothing}

                    <div class="history-list">
                        ${jobs
                            ? hasJobs
                                ? this.#renderHistoryItems(jobs)
                                : html`<div class="history-alert-message">
                                      You haven't made any requests yet.<br />
                                      Get started by
                                      <a
                                          href="#"
                                          class="history-alert-link"
                                          @click=${(e: Event) => {
                                              e.preventDefault()
                                              this.selectedJob = undefined
                                              this.dialog?.show()
                                          }}
                                      >
                                          creating your first request!</a
                                      >.
                                  </div>`
                            : html`<div class="history-alert-message">
                                  Retrieving your requests....
                              </div>`}
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
        const filteredJobs = subsetJobs.jobs
            .slice()
            .filter(job => {
                if (this.hideCancelled) {
                    return job.status !== Status.CANCELED
                }

                return true
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

        if (!filteredJobs.length) {
            return html`
                <div class="history-alert-message">
                    There are no active requests to show.<br />
                    If you'd like, you can
                    <a
                        href="#"
                        class="history-alert-link"
                        @click=${(e: Event) => {
                            e.preventDefault()
                            this.selectedJob = undefined
                            this.dialog?.show()
                        }}
                    >
                        create a new request.</a
                    >
                </div>
            `
        }

        return filteredJobs.map(job => {
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
