import { property, state } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-rods.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraVariableCombobox from '../variable-combobox/variable-combobox.component.js'
import TerraSpatialPicker from '../spatial-picker/spatial-picker.component.js'
import TerraDateRangeSlider from '../date-range-slider/date-range-slider.component.js'
import { Task } from '@lit/task'
import { GiovanniVariableCatalog } from '../../metadata-catalog/giovanni-variable-catalog.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { getUTCDate } from '../../utilities/date.js'
import type { TerraDateRangeChangeEvent } from '../../events/terra-date-range-change.js'
import type { TerraComboboxChangeEvent } from '../../events/terra-combobox-change.js'
import TerraTimeSeries from '../time-series/time-series.component.js'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import { MapEventType } from '../map/type.js'

/**
 * @summary A component for visualizing Hydrology Data Rods time series using the GES DISC Giovanni API
 * @documentation https://disc.gsfc.nasa.gov/components/data-rods
 * @status mvp
 * @since 1.0
 *
 * @event terra-date-range-change - Emitted whenever the date range of the date slider is updated
 */
export default class TerraDataRods extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-time-series': TerraTimeSeries,
        'terra-date-range-slider': TerraDateRangeSlider,
        'terra-spatial-picker': TerraSpatialPicker,
        'terra-variable-combobox': TerraVariableCombobox,
    }

    /**
     * a variable entry ID (ex: GPM_3IMERGHH_06_precipitationCal)
     */
    @property({ attribute: 'variable-entry-id', reflect: true })
    variableEntryId?: string

    /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     * only required if you don't include a variableEntryId
     */
    @property({ reflect: true })
    collection?: string

    /**
     * a variable short name to plot (ex: precipitationCal)
     * only required if you don't include a variableEntryId
     */
    @property({ reflect: true })
    variable?: string // TODO: support multiple variables (non-MVP feature)

    /**
     * The start date for the time series plot. (ex: 2021-01-01)
     */
    @property({
        attribute: 'start-date',
        reflect: true,
    })
    startDate?: string

    /**
     * The end date for the time series plot. (ex: 2021-01-01)
     */
    @property({
        attribute: 'end-date',
        reflect: true,
    })
    endDate?: string

    /**
     * The point location in "lat,lon" format.
     */
    @property({
        reflect: true,
    })
    location?: string

    /**
     * The token to be used for authentication with remote servers.
     * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
     * The property's value will be inserted after "Bearer" (the authentication scheme).
     */
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string

    @state() catalogVariable: Variable

    #catalog = new GiovanniVariableCatalog()

    // @ts-expect-error
    #fetchVariableTask = new Task(this, {
        task: async (_args, { signal }) => {
            const variableEntryId = this.#getVariableEntryId()

            console.debug('fetch variable ', variableEntryId)

            if (!variableEntryId) {
                return
            }

            const variable = await this.#catalog.getVariable(variableEntryId, {
                signal,
            })

            console.debug('found variable ', variable)

            if (!variable) {
                return
            }

            this.startDate =
                this.startDate ?? variable.exampleInitialStartDate?.toISOString()
            this.endDate =
                this.endDate ?? variable.exampleInitialEndDate?.toISOString()
            this.catalogVariable = variable
        },
        args: () => [this.variableEntryId, this.collection, this.variable],
    })

    render() {
        const minDate = this.catalogVariable
            ? getUTCDate(this.catalogVariable.dataProductBeginDateTime)
            : undefined
        const maxDate = this.catalogVariable
            ? getUTCDate(this.catalogVariable.dataProductEndDateTime)
            : undefined

        return html`
            <terra-variable-combobox
                exportparts="base:variable-combobox__base, combobox:variable-combobox__combobox, button:variable-combobox__button, listbox:variable-combobox__listbox"
                .value=${this.#getVariableEntryId()}
                .bearerToken=${this.bearerToken ?? null}
                .useTags=${true}
                @terra-combobox-change="${this.#handleVariableChange}"
            ></terra-variable-combobox>

            <terra-spatial-picker
                initial-value=${this.location}
                exportparts="map:spatial-picker__map, leaflet-bbox:spatial-picker__leaflet-bbox, leaflet-point:spatial-picker__leaflet-point"
                label="Select Point"
                @terra-map-change=${this.#handleMapChange}
            ></terra-spatial-picker>

            <terra-time-series
                variable-entry-id=${this.#getVariableEntryId()}
                start-date=${this.startDate}
                end-date=${this.endDate}
                location=${this.location}
                bearer-token=${this.bearerToken}
                @terra-date-range-change=${this.#handleTimeSeriesDateRangeChange}
            ></terra-time-series>

            <terra-date-range-slider
                exportparts="slider:date-range-slider__slider"
                min-date=${minDate}
                max-date=${maxDate}
                start-date=${this.startDate}
                end-date=${this.endDate}
                @terra-date-range-change="${this.#handleDateRangeSliderChangeEvent}"
            ></terra-date-range-slider>
        `
    }

    #getVariableEntryId() {
        if (!this.variableEntryId && !(this.collection && this.variable)) {
            return
        }

        return this.variableEntryId ?? `${this.collection}_${this.variable}`
    }

    /**
     * anytime the date range slider changes, update the start and end date
     */
    #handleDateRangeSliderChangeEvent(event: TerraDateRangeChangeEvent) {
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate
    }

    #handleVariableChange(event: TerraComboboxChangeEvent) {
        this.variableEntryId = event.detail.entryId
    }

    #handleMapChange(event: TerraMapChangeEvent) {
        if (event.detail.type === MapEventType.POINT) {
            // TODO: we may want to pick a `toFixed()` length in the spatial picker and stick with it.
            this.location = `${event.detail.latLng.lat.toFixed(4)},${event.detail.latLng.lng.toFixed(4)}`
        }
    }

    #handleTimeSeriesDateRangeChange(event: CustomEvent) {
        this.startDate = event.detail.startDate
        this.endDate = event.detail.endDate
    }
}
