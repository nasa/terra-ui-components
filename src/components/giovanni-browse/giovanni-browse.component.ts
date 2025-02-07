import componentStyles from '../../styles/component.styles.js'
import styles from './giovanni-browse.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { GiovanniBrowseController } from './giovanni-browse.controller.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Browse through the Giovanni catalog.
 * @documentation https://disc.gsfc.nasa.gov/components/giovanni-browse
 * @status MVP
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraGiovanniBrowse extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /**
     * Filters the catalog categories and facets by the given searchQuery
     * If not provided, all categories and facets will be available to browse
     */
    @property()
    searchQuery: string

    #controller = new GiovanniBrowseController(this)

    render() {
        return html`
            <div class="initial-browse-container">
                <!-- Research Areas Column -->
                <div class="column">
                    <h2>Research Areas</h2>
                    <ul role="list">
                        <li role="button" tabindex="0" aria-selected="false">
                            Agriculture
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Air Quality
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Cryospheric Indicators
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Droughts
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Earthquakes
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Ecosystems
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Energy Production/Use
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Extreme Weather
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Famine
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Floods
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">Heat</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Land Use / Land Cover
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Landslides
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Public Health
                        </li>
                    </ul>
                </div>

                <!-- Keywords Column -->
                <div class="column">
                    <h2>Keywords</h2>
                    <ul role="list">
                        <li role="button" tabindex="0" aria-selected="false">
                            Aerosol Index
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Aerosol Optical Depth
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Air Pressure
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Air Temperature
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Albedo
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Atmospheric Moisture
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Canopy Water Storage
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Cloud Properties
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Energy
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Evaporation
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Evapotranspiration
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Flooding
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Geopotential
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Ground Heat
                        </li>
                    </ul>
                </div>

                <!-- Sources Column -->
                <div class="column">
                    <h2>Sources</h2>
                    <ul role="list">
                        <li role="button" tabindex="0" aria-selected="false">AIRS</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            AMSR-2
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            AMSR-E
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            Aquarius
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            FLDAS
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            GEOS-CHEM
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            GLDAS
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">GPM</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            GRACE
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            MERRA-2
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">MISR</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            MODIS-Aqua
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            MODIS-Terra
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            MOPITT
                        </li>
                    </ul>
                </div>

                <!-- Projects Column -->
                <div class="column">
                    <h2>Projects</h2>
                    <ul role="list">
                        <li role="button" tabindex="0" aria-selected="false">Aqua</li>
                        <li role="button" tabindex="0" aria-selected="false">Aura</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            FLDAS
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            GLDAS
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">GPCP</li>
                        <li role="button" tabindex="0" aria-selected="false">GPM</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            GRACE
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            MERRA-2
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            NCA-LDAS
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            NLDAS
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">
                            OCO-2
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">OMI</li>
                        <li role="button" tabindex="0" aria-selected="false">
                            SMERGE
                        </li>
                        <li role="button" tabindex="0" aria-selected="false">TRMM</li>
                    </ul>
                </div>
            </div>

            <div class="variables-container">
                <!-- Sidebar with Accessible Filters -->
                <aside class="sidebar">
                    <h2>Filter</h2>
                    <details open>
                        <summary>Observations</summary>
                        <label><input type="checkbox" /> Reanalysis</label>
                    </details>
                    <details open>
                        <summary>Temporal Resolution</summary>
                        <label><input type="checkbox" /> Hourly (12)</label>
                        <label><input type="checkbox" /> Monthly (10)</label>
                    </details>
                </aside>

                <!-- Main Content -->
                <main class="content">
                    <!-- Group: Aerosol Index -->
                    <section class="group">
                        <h3>Aerosol Index</h3>
                        <ul class="variable-list">
                            <li tabindex="0" aria-selected="false">
                                <input type="checkbox" />
                                <strong
                                    >Total Column Mass Density - PM2.5, time
                                    average</strong
                                >
                                <span class="meta">MERRA-2 • Monthly • kg-m2</span>
                                <div class="details-panel">
                                    <h4>
                                        Science Name: Total Column Mass Density -
                                        PM2.5
                                    </h4>
                                    <p>
                                        <strong>Spatial Resolution:</strong> 0.5 x
                                        0.625 deg.
                                    </p>
                                    <p>
                                        <strong>Temporal Coverage:</strong> 1980-01-01
                                        - 2024-01-01
                                    </p>
                                    <p><strong>Region Coverage:</strong> Global</p>
                                    <p><strong>Dataset:</strong> MERRA-2</p>
                                </div>
                            </li>
                            <li tabindex="0" aria-selected="false">
                                <input type="checkbox" /> Total Surface Mass
                                Concentration - PM2.5, time average
                                <div class="details-panel">
                                    <h4>
                                        Science Name: Total Surface Mass Concentration
                                        - PM2.5
                                    </h4>
                                    <p>
                                        <strong>Spatial Resolution:</strong> 0.5 x
                                        0.625 deg.
                                    </p>
                                    <p>
                                        <strong>Temporal Coverage:</strong> 1990-01-01
                                        - 2024-01-01
                                    </p>
                                    <p><strong>Region Coverage:</strong> Global</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </main>
            </div>
        `
    }
}
