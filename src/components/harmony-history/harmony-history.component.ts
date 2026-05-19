import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { QueryController } from '../../controllers/query.controller.js'
import { MutationController } from '../../controllers/mutation.controller.js'
import TerraElement from '../../internal/terra-element.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import {
    mutationRemoveHarmonyJobLabels,
    queryHarmonyJobs,
} from '../../queries/harmony.queries.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './harmony-history.styles.js'
import { AuthController } from '../../auth/auth.controller.js'
import { FINAL_STATUSES } from '../../apis/harmony.api.js'
import type { SubsetJobStatus, SubsetJobLink } from '../../apis/harmony.api.js'
import TerraLoader from '../loader/loader.component.js'
import TerraTooltip from '../tooltip/tooltip.component.js'
import TerraIcon from '../icon/icon.component.js'
import '../../events/terra-harmony-job-select.js'
import '../../events/terra-harmony-job-delete.js'
import { HarmonyRequest } from '../../lib/harmony/harmony.request.js'
import { formatDate } from '../../utilities/date.js'

/** Thumbnail width + gap (96px + 12px) */
const STRIDE = 108

/** Format a date string for tooltip display. Includes HH:mm UTC when the time is non-midnight UTC. */
function formatDatetimeUtc(dateStr: string | undefined): string {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const hasTime =
        d.getUTCHours() !== 0 ||
        d.getUTCMinutes() !== 0 ||
        d.getUTCSeconds() !== 0
    if (hasTime) {
        const yyyy = d.getUTCFullYear()
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(d.getUTCDate()).padStart(2, '0')
        const hh = String(d.getUTCHours()).padStart(2, '0')
        const min = String(d.getUTCMinutes()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`
    }
    return formatDate(d, 'yyyy-MM-dd')
}

/**
 * @summary Displays a horizontal scrolling strip of a user's recent Harmony job requests,
 * fetching additional pages on demand as the user scrolls.
 * @documentation https://terra-ui.netlify.app/components/harmony-history
 * @status stable
 * @since 1.0
 *
 * @dependency terra-loader
 * @dependency terra-tooltip
 * @dependency terra-icon
 *
 * @event {{ job: SubsetJobStatus }} terra-harmony-job-select - Emitted when a thumbnail is clicked.
 * @event {{ jobId: string }} terra-harmony-job-delete - Emitted when the delete button on a thumbnail is clicked (only when `removeLabelsOnDelete` is false).
 *
 * @csspart nav-button - The left/right navigation arrow buttons.
 * @csspart viewport - The overflow-hidden container that clips the thumbnail track.
 * @csspart track - The inner flex container that translates to implement scrolling.
 * @csspart thumbnail - Each individual job thumbnail wrapper.
 */
export default class TerraHarmonyHistory extends QueryClientMixin(
    TerraElement,
) {
    static styles: CSSResultGroup = [componentStyles, styles]

    static dependencies: Record<string, typeof TerraElement> = {
        'terra-loader': TerraLoader,
        'terra-tooltip': TerraTooltip,
        'terra-icon': TerraIcon,
    }

    @property({ attribute: 'bearer-token' })
    override bearerToken?: string

    @property({ type: Number })
    limit: number = 20

    @property({ attribute: 'filter-by-labels' })
    filterByLabels?: string

    /**
     * When true and `filter-by-labels` is set, clicking the delete button on a thumbnail
     * will call the Harmony /labels DELETE endpoint to remove the active filter labels from
     * that job (causing it to disappear from the filtered list). When false, a
     * `terra-harmony-job-delete` event is emitted instead and the consumer handles deletion.
     */
    @property({ type: Boolean, attribute: 'remove-labels-on-delete' })
    removeLabelsOnDelete = false

    private _boundDataChangeHandler = () => {
        clearTimeout(this._refreshPage1Timer)
        this._refreshPage1Timer = window.setTimeout(() => {
            this._refreshPage1()
        }, 500)
    }

    @state() private _scrollIndex = 0
    @state() private _totalCount = 0
    @state() private _loadedPages = new Map<number, SubsetJobStatus[]>()
    @state() private _pendingPages = new Set<number>()

    @query('[part="viewport"]') private _viewportEl?: HTMLElement
    @query('terra-tooltip') private _tooltip?: TerraTooltip

    private _hideTooltipTimer?: number
    private _showTooltipTimer?: number
    private _refreshPage1Timer?: number
    private _resizeObserver?: ResizeObserver

    _authController = new AuthController(this)

    _removeLabelsOnDeleteMutation = new MutationController(
        this,
        mutationRemoveHarmonyJobLabels(),
    )

    /**
     * Page 1 is always managed by this QueryController (includes polling for non-final jobs).
     * Other pages are fetched imperatively via _fetchPage().
     */
    jobsQuery = new QueryController(this, () =>
        queryHarmonyJobs(
            {
                page: 1,
                limit: this.limit,
                ...(this.filterByLabels ? { label: this.filterByLabels } : {}),
            },
            { bearerToken: this.bearerToken },
        ),
    )

    /** Cached reference to the last page-1 result to avoid redundant state updates */
    private _lastPage1Data?: {
        count: number
        jobs: SubsetJobStatus[]
        links: SubsetJobLink[]
    }

    private get _visibleCount() {
        const viewportWidth = this._viewportEl?.clientWidth ?? 400
        return Math.max(1, Math.floor(viewportWidth / STRIDE))
    }

    /** Returns all jobs as a sparse array — null slots represent not-yet-loaded pages */
    private get _allJobs(): Array<SubsetJobStatus | null> {
        return Array.from({ length: this._totalCount }, (_, i) => {
            const page = Math.floor(i / this.limit) + 1
            const indexInPage = i % this.limit
            return this._loadedPages.get(page)?.[indexInPage] ?? null
        })
    }

    override connectedCallback() {
        super.connectedCallback()
        if (typeof window !== 'undefined') {
            window.addEventListener(
                'terra-time-average-map-data-change',
                this._boundDataChangeHandler,
            )
            window.addEventListener(
                'terra-time-series-data-change',
                this._boundDataChangeHandler,
            )
        }
    }

    override firstUpdated() {
        if (this._viewportEl && typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => {
                this._checkPagesInView()
            })
            this._resizeObserver.observe(this._viewportEl)
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback()
        this._resizeObserver?.disconnect()
        if (typeof window !== 'undefined') {
            window.removeEventListener(
                'terra-time-average-map-data-change',
                this._boundDataChangeHandler,
            )
            window.removeEventListener(
                'terra-time-series-data-change',
                this._boundDataChangeHandler,
            )
        }
    }

    override updated(changedProperties: Map<string | symbol, unknown>) {
        super.updated(changedProperties)

        const data = this.jobsQuery.result?.data
        if (data && data !== this._lastPage1Data) {
            this._lastPage1Data = data
            if (data.count !== this._totalCount) {
                this._totalCount = data.count
            }
            const newMap = new Map(this._loadedPages)
            newMap.set(1, data.jobs)
            this._loadedPages = newMap
            this._checkPagesInView()
        }
    }

    private async _refreshPage1() {
        await this.queryClient.invalidateQueries({
            queryKey: [
                'harmony',
                'jobs',
                {
                    page: 1,
                    limit: this.limit,
                    ...(this.filterByLabels
                        ? { label: this.filterByLabels }
                        : {}),
                },
            ],
        })
    }

    private async _fetchPage(page: number) {
        if (this._loadedPages.has(page) || this._pendingPages.has(page)) return

        const newPending = new Set(this._pendingPages)
        newPending.add(page)
        this._pendingPages = newPending

        try {
            const data = await this.queryClient.fetchQuery(
                queryHarmonyJobs(
                    {
                        page,
                        limit: this.limit,
                        ...(this.filterByLabels
                            ? { label: this.filterByLabels }
                            : {}),
                    },
                    { bearerToken: this.bearerToken },
                ),
            )
            const newMap = new Map(this._loadedPages)
            newMap.set(page, data.jobs)
            this._loadedPages = newMap
        } finally {
            const newPending = new Set(this._pendingPages)
            newPending.delete(page)
            this._pendingPages = newPending
        }
    }

    private _checkPagesInView() {
        if (!this.bearerToken) return

        const endIndex = Math.min(
            this._scrollIndex + this._visibleCount,
            this._totalCount,
        )
        const startPage = Math.floor(this._scrollIndex / this.limit) + 1
        const endPage = Math.floor(Math.max(0, endIndex - 1) / this.limit) + 1

        for (let page = startPage; page <= endPage; page++) {
            // Page 1 is handled by the QueryController
            if (page === 1) continue
            this._fetchPage(page)
        }
    }

    private _scrollLeft() {
        this._scrollIndex = Math.max(0, this._scrollIndex - 1)
        this._checkPagesInView()
    }

    private _scrollRight() {
        const max = Math.max(0, this._totalCount - this._visibleCount)
        this._scrollIndex = Math.min(max, this._scrollIndex + 1)
        this._checkPagesInView()
    }

    private _handleWheel(e: WheelEvent) {
        e.preventDefault()
        if (e.deltaY > 0) {
            this._scrollRight()
        } else {
            this._scrollLeft()
        }
    }

    async refresh() {
        this._scrollIndex = 0
        this._loadedPages = new Map()
        this._pendingPages = new Set()
        this._totalCount = 0
        this._lastPage1Data = undefined
        await this.queryClient.invalidateQueries({
            queryKey: ['harmony', 'jobs'],
        })
    }

    private _showTooltip(e: MouseEvent, job: SubsetJobStatus | null) {
        clearTimeout(this._hideTooltipTimer)
        clearTimeout(this._showTooltipTimer)
        if (!this._tooltip) return
        const isNonFinal = job !== null && !FINAL_STATUSES.has(job.status)

        const harmonyRequest = job?.request
            ? HarmonyRequest.fromUrl(job.request)
            : null

        const tooltipContent = document.createElement('div')

        if (harmonyRequest) {
            const instrumentShortName = harmonyRequest.getLabelByPrefix(
                'instrument-short-name',
            )
            const interval = harmonyRequest.getLabelByPrefix('time-interval')
            const units = harmonyRequest.getLabelByPrefix('units')
            const collection = harmonyRequest.getLabelByPrefix('collection')

            const metadata = []

            if (instrumentShortName) metadata.push(instrumentShortName)
            if (interval) metadata.push(interval)
            if (units) metadata.push(units)
            if (collection) metadata.push(collection)

            tooltipContent.style.lineHeight = '1.3'
            tooltipContent.style.fontSize = '12px'
            tooltipContent.style.padding = '5px'
            tooltipContent.innerHTML = `
                <div class="font-weight-semibold tooltip-row">${harmonyRequest.getLabelByPrefix('variable-display-name') ?? job?.jobID}</div>
                <div class="text-gray-300 mb-1 tooltip-row">${metadata.join(' • ')}</div>
                ${
                    harmonyRequest.options.startDate &&
                    harmonyRequest.options.endDate
                        ? `
                    <div class="text-gray-300 tooltip-row">
                        <terra-icon library="heroicons" name="solid-calendar-date-range"></terra-icon> 
                        ${formatDatetimeUtc(harmonyRequest.options.startDate)} to ${formatDatetimeUtc(harmonyRequest.options.endDate)}
                    </div>
                `
                        : ''
                }
                <div class="text-gray-300 mb-1 tooltip-row">
                    <terra-icon library="heroicons" name="solid-map"></terra-icon>
                    ${harmonyRequest.options.location?.toString()}
                </div>
                ${
                    !isNonFinal
                        ? `<div class="text-gray-300 tooltip-row">
                        Last updated: ${formatDate(harmonyRequest.getLabelByPrefix('updated-at') ?? new Date())}
                        </div>`
                        : `<div class="text-gray-300 tooltip-row">Status: ${job?.status}</div>`
                }
                
            `
        }

        tooltipContent.slot = 'content'

        const anchor = e.currentTarget as Element

        if (this._tooltip.open) {
            // Already visible — update content and position immediately without re-animating
            this._tooltip.innerHTML = ''
            this._tooltip.appendChild(tooltipContent)
            this._tooltip.popup.anchor = anchor
            this._tooltip.popup.reposition()
        } else {
            // Debounce the show so rapid mouse passes don't race with the show animation
            this._showTooltipTimer = window.setTimeout(() => {
                if (!this._tooltip) return
                this._tooltip.innerHTML = ''
                this._tooltip.appendChild(tooltipContent)
                this._tooltip.popup.anchor = anchor
                this._tooltip.show()
            }, 100)
        }
    }

    private _hideTooltip() {
        clearTimeout(this._showTooltipTimer)
        clearTimeout(this._hideTooltipTimer)
        this._hideTooltipTimer = window.setTimeout(() => {
            this._tooltip?.hide()
        }, 250)
    }

    private _handleThumbnailClick(job: SubsetJobStatus | null) {
        if (!job) return
        this.emit('terra-harmony-job-select', { detail: { job } })
    }

    private async _handleDeleteClick(e: Event, job: SubsetJobStatus) {
        e.stopPropagation()

        const confirmed = window.confirm(
            `Are you sure you want to delete this history item?`,
        )
        if (!confirmed) return

        const labels = this.filterByLabels
            ?.split(',')
            .map((l) => l.trim())
            .filter(Boolean)

        // Optimistically remove the job from local state so it disappears immediately
        // without blanking the entire strip while the refetch is in flight
        this._optimisticallyRemoveJob(job.jobID)

        if (this.removeLabelsOnDelete && labels?.length) {
            await this._removeLabelsOnDeleteMutation.mutate({
                jobIDs: [job.jobID],
                labels,
                options: { bearerToken: this.bearerToken },
            })
        } else {
            this.emit('terra-harmony-job-delete', {
                detail: { jobId: job.jobID },
            })
        }

        // Refresh page 1 from the server so the strip reflects accurate server state
        await this._refreshPage1()
    }

    /** Removes a single job from the local page cache and decrements the total count. */
    private _optimisticallyRemoveJob(jobID: string) {
        const newMap = new Map(this._loadedPages)
        for (const [page, jobs] of newMap) {
            const filtered = jobs.filter((j) => j.jobID !== jobID)
            if (filtered.length !== jobs.length) {
                newMap.set(page, filtered)
                this._totalCount = Math.max(0, this._totalCount - 1)
            }
        }
        this._loadedPages = newMap
    }

    private _renderThumbnail(job: SubsetJobStatus | null) {
        const showLoadingOverlay =
            job === null || !FINAL_STATUSES.has(job.status)
        const thumbUrl = job?.thumbnailBlob
            ? URL.createObjectURL(job.thumbnailBlob)
            : null
        const harmonyRequest = HarmonyRequest.fromUrl(job?.request ?? '')

        return html`
            <div
                part="thumbnail"
                class="thumbnail"
                @click=${() => this._handleThumbnailClick(job)}
                @mouseenter=${(e: MouseEvent) => this._showTooltip(e, job)}
                @mouseleave=${this._hideTooltip}
            >
                <div class="thumbnail-inner">
                    ${
                        thumbUrl
                            ? html`<img
                                  class="thumbnail-img"
                                  src=${thumbUrl}
                                  alt=""
                                  aria-hidden="true"
                              />`
                            : html`<terra-icon
                                  library="heroicons"
                                  name=${harmonyRequest.getTerraIcon()}
                                  style="font-size: 1.5rem"
                              ></terra-icon>`
                    }
                    ${
                        showLoadingOverlay
                            ? html`<div class="loading-overlay">
                                <terra-loader
                                    indeterminate
                                    variant="small"
                                ></terra-loader>
                            </div>`
                            : nothing
                    }
                </div>
                ${
                    job
                        ? html`<button
                            class="delete-button"
                            aria-label="Delete job"
                            ?disabled=${
                                this._removeLabelsOnDeleteMutation.result
                                    ?.isPending
                            }
                            @click=${(e: Event) =>
                                this._handleDeleteClick(e, job)}
                        >
                            ×
                        </button>`
                        : nothing
                }
            </div>
        `
    }

    render() {
        const jobs = this._allJobs
        const isAtStart = this._scrollIndex <= 0
        const isAtEnd =
            this._totalCount === 0 ||
            this._scrollIndex >= this._totalCount - this._visibleCount

        const isInitialLoading =
            jobs.length === 0 && this.jobsQuery.result?.status === 'pending'

        return html`
            <button
                part="nav-button"
                class="nav-button"
                aria-label="Scroll left"
                ?disabled=${isAtStart}
                @click=${this._scrollLeft}
            >
                <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <div
                part="viewport"
                class="viewport"
                @wheel=${this._handleWheel}
            >
                <div
                    part="track"
                    class="track"
                    style="transform: translateX(-${this._scrollIndex * STRIDE}px)"
                >
                    ${
                        isInitialLoading
                            ? html`<div class="empty-state">
                              <terra-loader indeterminate></terra-loader>
                          </div>`
                            : jobs.map((job) => this._renderThumbnail(job))
                    }
                </div>
            </div>

            <button
                part="nav-button"
                class="nav-button"
                aria-label="Scroll right"
                ?disabled=${isAtEnd}
                @click=${this._scrollRight}
            >
                <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            <terra-tooltip
                trigger="manual"
                placement="top"
                hoist
                interactive
                @mouseenter=${() => {
                    clearTimeout(this._showTooltipTimer)
                    clearTimeout(this._hideTooltipTimer)
                }}
                @mouseleave=${this._hideTooltip}
            ></terra-tooltip>
        `
    }
}
