import {
    expect,
    fixture,
    html,
    elementUpdated,
    oneEvent,
} from '@open-wc/testing'
import { Status } from '../../apis/harmony.api.js'
import type { SubsetJobStatus } from '../../apis/harmony.api.js'
import './harmony-history.js'

function makeJob(overrides: Partial<SubsetJobStatus> = {}): SubsetJobStatus {
    return {
        jobID: 'test-job-id-1',
        status: Status.SUCCESSFUL,
        message: '',
        progress: 100,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        dataExpiration: '2026-04-01T00:00:00.000Z',
        request: 'https://harmony.earthdata.nasa.gov/jobs/test',
        numInputGranules: 1,
        links: [],
        ...overrides,
    }
}

describe('<terra-harmony-history>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            expect(el).to.exist
        })

        it('should render left and right nav buttons', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const buttons = el.shadowRoot?.querySelectorAll('.nav-button')
            expect(buttons?.length).to.equal(2)
        })

        it('should render a viewport and track', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            expect(el.shadowRoot?.querySelector('[part="viewport"]')).to.exist
            expect(el.shadowRoot?.querySelector('[part="track"]')).to.exist
        })

        it('should show a loading state when query is pending and no jobs', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el.jobsQuery = { result: { status: 'pending', data: undefined } }
            await elementUpdated(el)
            const loader = el.shadowRoot?.querySelector('terra-loader')
            expect(loader).to.exist
        })
    })

    describe('Thumbnails', () => {
        it('should render thumbnails equal to total count', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const jobs = [
                makeJob({ jobID: 'a' }),
                makeJob({ jobID: 'b' }),
                makeJob({ jobID: 'c' }),
            ]
            el._totalCount = 3
            el._loadedPages = new Map([[1, jobs]])
            await elementUpdated(el)

            const thumbnails =
                el.shadowRoot?.querySelectorAll('[part="thumbnail"]')
            expect(thumbnails?.length).to.equal(3)
        })

        it('should render a loading overlay for null (unloaded) jobs', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            // 2 total, only page 1 partial load (1 job), second slot is null
            el._totalCount = 2
            el._loadedPages = new Map([[1, [makeJob({ jobID: 'a' })]]])
            await elementUpdated(el)

            const overlays = el.shadowRoot?.querySelectorAll('.loading-overlay')
            expect(overlays?.length).to.be.greaterThan(0)
        })

        it('should render a loading overlay for non-final job statuses', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const runningJob = makeJob({
                jobID: 'running',
                status: Status.RUNNING,
                progress: 40,
            })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [runningJob]]])
            await elementUpdated(el)

            const overlay = el.shadowRoot?.querySelector('.loading-overlay')
            expect(overlay).to.exist
        })

        it('should not render a loading overlay for final job statuses', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const successJob = makeJob({
                jobID: 'done',
                status: Status.SUCCESSFUL,
            })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [successJob]]])
            await elementUpdated(el)

            const overlay = el.shadowRoot?.querySelector('.loading-overlay')
            expect(overlay).to.not.exist
        })
    })

    describe('Navigation', () => {
        it('should have the left button disabled when at the start', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._scrollIndex = 0
            el._totalCount = 5
            await elementUpdated(el)

            const leftBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll left"]',
            )
            expect(leftBtn?.disabled).to.be.true
        })

        it('should have the right button disabled when total count is 0', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._totalCount = 0
            await elementUpdated(el)

            const rightBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll right"]',
            )
            expect(rightBtn?.disabled).to.be.true
        })

        it('should increment scroll index when right arrow is clicked', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._scrollIndex = 0
            el._totalCount = 20
            el._loadedPages = new Map([
                [
                    1,
                    Array.from({ length: 10 }, (_, i) =>
                        makeJob({ jobID: `job-${i}` }),
                    ),
                ],
            ])
            await elementUpdated(el)

            const rightBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll right"]',
            )
            rightBtn?.click()
            await elementUpdated(el)

            expect(el._scrollIndex).to.equal(1)
        })

        it('should decrement scroll index when left arrow is clicked', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._scrollIndex = 3
            el._totalCount = 20
            await elementUpdated(el)

            const leftBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll left"]',
            )
            leftBtn?.click()
            await elementUpdated(el)

            expect(el._scrollIndex).to.equal(2)
        })

        it('should not scroll below index 0', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._scrollIndex = 0
            el._totalCount = 10
            await elementUpdated(el)

            const leftBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll left"]',
            )
            leftBtn?.click()
            await elementUpdated(el)

            expect(el._scrollIndex).to.equal(0)
        })
    })

    describe('Events', () => {
        it('should emit terra-harmony-job-select when a loaded thumbnail is clicked', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const job = makeJob({ jobID: 'clickable-job' })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [job]]])
            await elementUpdated(el)

            const thumbnail = el.shadowRoot?.querySelector('[part="thumbnail"]')
            const eventPromise = oneEvent(el, 'terra-harmony-job-select')
            thumbnail?.click()
            const event = await eventPromise

            expect((event as CustomEvent).detail.job).to.deep.equal(job)
        })

        it('should not emit terra-harmony-job-select for a null (unloaded) thumbnail', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            // 2 slots, only 1 loaded — index 1 is null
            el._totalCount = 2
            el._loadedPages = new Map([[1, [makeJob({ jobID: 'a' })]]])
            await elementUpdated(el)

            let eventFired = false
            el.addEventListener('terra-harmony-job-select', () => {
                eventFired = true
            })

            const thumbnails =
                el.shadowRoot?.querySelectorAll('[part="thumbnail"]')
            thumbnails?.[1]?.click()

            await new Promise<void>((r) => setTimeout(r, 50))
            expect(eventFired).to.be.false
        })

        it('should emit terra-harmony-job-delete when the delete button is clicked (after confirmation)', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const job = makeJob({ jobID: 'deletable-job' })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [job]]])
            await elementUpdated(el)

            const originalConfirm = window.confirm
            window.confirm = () => true

            const deleteBtn = el.shadowRoot?.querySelector('.delete-button')
            const eventPromise = oneEvent(el, 'terra-harmony-job-delete')
            deleteBtn?.click()
            const event = await eventPromise

            window.confirm = originalConfirm
            expect((event as CustomEvent).detail.jobId).to.equal(
                'deletable-job',
            )
        })

        it('should NOT emit terra-harmony-job-delete when user cancels the confirmation', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const job = makeJob({ jobID: 'cancelable-job' })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [job]]])
            await elementUpdated(el)

            const originalConfirm = window.confirm
            window.confirm = () => false

            let eventFired = false
            el.addEventListener('terra-harmony-job-delete', () => {
                eventFired = true
            })

            const deleteBtn = el.shadowRoot?.querySelector('.delete-button')
            deleteBtn?.click()

            await new Promise<void>((r) => setTimeout(r, 50))
            window.confirm = originalConfirm
            expect(eventFired).to.be.false
        })
    })

    describe('removeLabelsOnDelete', () => {
        it('should have removeLabelsOnDelete default to false', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            expect(el.removeLabelsOnDelete).to.be.false
        })

        it('should accept remove-labels-on-delete attribute', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history remove-labels-on-delete></terra-harmony-history>`,
            )
            expect(el.removeLabelsOnDelete).to.be.true
        })

        it('should call mutation and NOT emit terra-harmony-job-delete when removeLabelsOnDelete is true and labels are set', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history
                    filter-by-labels="my-label"
                    remove-labels-on-delete
                ></terra-harmony-history>`,
            )
            const job = makeJob({ jobID: 'label-job' })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [job]]])
            await elementUpdated(el)

            const originalConfirm = window.confirm
            window.confirm = () => true

            let mutateCalledWith: unknown = null
            el._removeLabelsOnDeleteMutation.mutate = async (vars: unknown) => {
                mutateCalledWith = vars
            }

            let eventFired = false
            el.addEventListener('terra-harmony-job-delete', () => {
                eventFired = true
            })

            const deleteBtn = el.shadowRoot?.querySelector('.delete-button')
            deleteBtn?.click()

            await new Promise<void>((r) => setTimeout(r, 100))
            window.confirm = originalConfirm

            expect(mutateCalledWith).to.deep.include({
                jobIDs: ['label-job'],
                labels: ['my-label'],
            })
            expect(eventFired).to.be.false
        })

        it('should still emit terra-harmony-job-delete when removeLabelsOnDelete is true but no labels are set', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history
                    remove-labels-on-delete
                ></terra-harmony-history>`,
            )
            const job = makeJob({ jobID: 'no-label-job' })
            el._totalCount = 1
            el._loadedPages = new Map([[1, [job]]])
            await elementUpdated(el)

            const originalConfirm = window.confirm
            window.confirm = () => true

            const deleteBtn = el.shadowRoot?.querySelector('.delete-button')
            const eventPromise = oneEvent(el, 'terra-harmony-job-delete')
            deleteBtn?.click()
            const event = await eventPromise

            window.confirm = originalConfirm
            expect((event as CustomEvent).detail.jobId).to.equal('no-label-job')
        })
    })

    describe('refresh()', () => {
        it('should reset scroll index, loaded pages, pending pages, and total count', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._scrollIndex = 5
            el._totalCount = 20
            el._loadedPages = new Map([[1, [makeJob()]]])
            el._pendingPages = new Set([2])
            el._lastPage1Data = { count: 20, jobs: [], links: [] }

            let invalidateCalled = false
            el.queryClient = {
                invalidateQueries: async () => {
                    invalidateCalled = true
                },
            }

            await el.refresh()

            expect(el._scrollIndex).to.equal(0)
            expect(el._totalCount).to.equal(0)
            expect(el._loadedPages.size).to.equal(0)
            expect(el._pendingPages.size).to.equal(0)
            expect(el._lastPage1Data).to.be.undefined
            expect(invalidateCalled).to.be.true
        })
    })

    describe('Accessibility', () => {
        it('should have aria-label on the left nav button', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const leftBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll left"]',
            )
            expect(leftBtn).to.exist
        })

        it('should have aria-label on the right nav button', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            const rightBtn = el.shadowRoot?.querySelector(
                '[aria-label="Scroll right"]',
            )
            expect(rightBtn).to.exist
        })

        it('should have aria-label on delete buttons', async () => {
            const el: any = await fixture(
                html`<terra-harmony-history></terra-harmony-history>`,
            )
            el._totalCount = 1
            el._loadedPages = new Map([[1, [makeJob()]]])
            await elementUpdated(el)

            const deleteBtn = el.shadowRoot?.querySelector('.delete-button')
            expect(deleteBtn?.getAttribute('aria-label')).to.equal('Delete job')
        })
    })
})
