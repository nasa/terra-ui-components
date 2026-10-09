import { expect, fixture, html } from '@open-wc/testing'
import { elementUpdated, oneEvent } from '@open-wc/testing-helpers'
import './pagination.js'

const getPageButtons = (el: any) =>
    Array.from(
        el.shadowRoot?.querySelectorAll(
            '.pagination__button--page'
        ) as NodeListOf<HTMLButtonElement>
    )

const getPageNumbers = (el: any) =>
    getPageButtons(el).map(button => Number(button.textContent?.trim()))

const getEllipsisCount = (el: any) =>
    el.shadowRoot?.querySelectorAll('.pagination__ellipsis').length ?? 0

describe('<terra-pagination>', () => {
    describe('Rendering', () => {
        it('should render', async () => {
            const el = await fixture(html`<terra-pagination></terra-pagination>`)
            expect(el).to.exist
        })

        it('should render all pages when total is small', async () => {
            const el: any = await fixture(html`
                <terra-pagination current="3" total="7"></terra-pagination>
            `)
            await elementUpdated(el)

            expect(getPageNumbers(el)).to.deep.equal([1, 2, 3, 4, 5, 6, 7])
            expect(getEllipsisCount(el)).to.equal(0)
        })

        it('should render default middle window with ellipses', async () => {
            const el: any = await fixture(html`
                <terra-pagination current="10" total="20"></terra-pagination>
            `)
            await elementUpdated(el)

            expect(getPageNumbers(el)).to.deep.equal([1, 9, 10, 11, 20])
            expect(getEllipsisCount(el)).to.equal(2)
        })

        it('should keep early pages visible near the beginning', async () => {
            const el: any = await fixture(html`
                <terra-pagination current="4" total="8"></terra-pagination>
            `)
            await elementUpdated(el)

            expect(getPageNumbers(el)).to.deep.equal([1, 2, 3, 4, 5, 8])
            expect(getEllipsisCount(el)).to.equal(1)
        })
    })

    describe('Properties', () => {
        it('should support sibling-count for wider page windows', async () => {
            const el: any = await fixture(html`
                <terra-pagination
                    current="10"
                    total="20"
                    sibling-count="2"
                ></terra-pagination>
            `)
            await elementUpdated(el)

            expect(getPageNumbers(el)).to.deep.equal([1, 8, 9, 10, 11, 12, 20])
            expect(getEllipsisCount(el)).to.equal(2)
        })

        it('should clamp invalid numeric values', async () => {
            const el: any = await fixture(html`
                <terra-pagination
                    current="-5"
                    total="0"
                    sibling-count="-3"
                ></terra-pagination>
            `)
            await elementUpdated(el)

            expect(getPageNumbers(el)).to.deep.equal([1])
            expect(getEllipsisCount(el)).to.equal(0)
        })
    })

    describe('Variants', () => {
        it('should hide page numbers in simple variant', async () => {
            const el: any = await fixture(html`
                <terra-pagination
                    variant="simple"
                    current="2"
                    total="5"
                ></terra-pagination>
            `)
            await elementUpdated(el)

            expect(getPageButtons(el)).to.have.length(0)

            const prevButton = el.shadowRoot?.querySelector(
                '.pagination__button--prev'
            )
            const nextButton = el.shadowRoot?.querySelector(
                '.pagination__button--next'
            )

            expect(prevButton?.textContent).to.include('Previous')
            expect(nextButton?.textContent).to.include('Next')
        })
    })

    describe('Events and interactions', () => {
        it('should emit terra-page-change when a page button is clicked', async () => {
            const el: any = await fixture(html`
                <terra-pagination current="5" total="20"></terra-pagination>
            `)
            await elementUpdated(el)

            const button = el.shadowRoot?.querySelector(
                'button[data-page="6"]'
            ) as HTMLButtonElement
            expect(button).to.exist

            const eventPromise = oneEvent(el, 'terra-page-change')
            button.click()
            const event: any = await eventPromise

            expect(event.detail.page).to.equal(6)
            expect(el.current).to.equal(6)
        })

        it('should disable previous and next buttons at bounds', async () => {
            const firstPage: any = await fixture(html`
                <terra-pagination current="1" total="5"></terra-pagination>
            `)
            await elementUpdated(firstPage)

            const firstPrev = firstPage.shadowRoot?.querySelector(
                '.pagination__button--prev'
            ) as HTMLButtonElement
            const firstNext = firstPage.shadowRoot?.querySelector(
                '.pagination__button--next'
            ) as HTMLButtonElement

            expect(firstPrev.disabled).to.be.true
            expect(firstNext.disabled).to.be.false

            firstPage.current = 5
            await elementUpdated(firstPage)

            const lastPrev = firstPage.shadowRoot?.querySelector(
                '.pagination__button--prev'
            ) as HTMLButtonElement
            const lastNext = firstPage.shadowRoot?.querySelector(
                '.pagination__button--next'
            ) as HTMLButtonElement

            expect(lastPrev.disabled).to.be.false
            expect(lastNext.disabled).to.be.true
        })
    })

    describe('Accessibility', () => {
        it('should mark the active page with aria-current', async () => {
            const el: any = await fixture(html`
                <terra-pagination current="4" total="8"></terra-pagination>
            `)
            await elementUpdated(el)

            const currentButton = el.shadowRoot?.querySelector(
                '.pagination__button--current'
            ) as HTMLButtonElement

            expect(currentButton.getAttribute('aria-current')).to.equal('page')
            expect(currentButton.getAttribute('aria-label')).to.equal('Page 4')
        })
    })
})
