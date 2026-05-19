import { expect } from '@open-wc/testing'
import { HarmonyRequest, Environments } from '../harmony.request.js'
import { LatLngBounds } from '../../../components/map/models/LatLngBounds.js'
import { LatLng } from '../../../components/map/models/LatLng.js'

const COLLECTION_CONCEPT_ID = 'C1276812863-GES_DISC'
const VARIABLE_CONCEPT_ID = 'V2586807132-GES_DISC'
const VARIABLE_ENTRY_ID = 'M2T1NXSLV_5_12_4_CLDTMP'
const BBOX = new LatLngBounds([62.23, 5.29, 94.57, 37.49]) // west, south, east, north
const START_DATE = '2026-01-01T00:00:00.000Z'
const END_DATE = '2026-01-02T23:59:00.000Z'

describe('HarmonyRequest', () => {
    describe('baseUrl', () => {
        it('throws error when no collectionConceptId is provided', () => {
            const request = new HarmonyRequest()
            expect(() => request.baseUrl).to.throw(
                'Collection concept id is required',
            )
        })

        it('defaults to the PROD harmony URL', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
            })
            expect(request.baseUrl).to.include(
                'https://harmony.earthdata.nasa.gov',
            )
        })

        it('uses the UAT harmony URL when environment is UAT', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                environment: Environments.UAT,
            })
            expect(request.baseUrl).to.include(
                'https://harmony.uat.earthdata.nasa.gov',
            )
        })

        it('uses the variable concept id in the base url when variableConceptIds is provided', () => {
            // matches URL 2: .../collections/V2586807132-GES_DISC/coverage/rangeset
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                variableConceptIds: [VARIABLE_CONCEPT_ID],
            })
            expect(request.baseUrl).to.equal(
                `https://harmony.earthdata.nasa.gov/${COLLECTION_CONCEPT_ID}/ogc-api-coverages/1.0.0/collections/${VARIABLE_CONCEPT_ID}/coverage/rangeset`,
            )
        })

        it('joins multiple variable concept ids with commas in the base url', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                variableConceptIds: ['V1-GES_DISC', 'V2-GES_DISC'],
            })
            expect(request.baseUrl).to.include('/V1-GES_DISC,V2-GES_DISC/')
        })

        it('uses parameter_vars in the base url when variables are provided', () => {
            // matches URL 1: .../collections/parameter_vars/coverage/rangeset
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                variables: [VARIABLE_ENTRY_ID],
            })
            expect(request.baseUrl).to.equal(
                `https://harmony.earthdata.nasa.gov/${COLLECTION_CONCEPT_ID}/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset`,
            )
        })

        it('defaults to "all" when neither variableConceptIds nor variables are provided', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
            })
            expect(request.baseUrl).to.include('/all/')
        })
    })

    describe('params', () => {
        it('appends lat and lon subsets for a LatLngBounds location', () => {
            // matches URL 1 & 2: subset=lat(5.29:37.49)&subset=lon(62.23:94.57)
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
            })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lat(5.29:37.49)')
            expect(params).to.include('subset=lon(62.23:94.57)')
        })

        it('does not append lat/lon subset params for a LatLng point', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: new LatLng(37.49, 94.57),
            })
            expect(request.params).to.not.include('lat(')
            expect(request.params).to.not.include('lon(')
        })

        it('appends a time subset with start and end date', () => {
            // matches URL 1 & 2: subset=time(%222026-01-01...%222026-01-02...)
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                startDate: START_DATE,
                endDate: END_DATE,
            })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=time(')
            expect(params).to.include('2026-01-01T00:00:00.000Z')
            expect(params).to.include('2026-01-02T23:59:00.000Z')
        })

        it('uses startDate as endDate when only startDate is provided', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                startDate: START_DATE,
            })
            const params = decodeURIComponent(request.params)
            // startDate should appear twice
            expect(
                params.split('2026-01-01T00:00:00.000Z').length - 1,
            ).to.equal(2)
        })

        it('does not append a time subset when startDate is not provided', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
            })
            expect(request.params).to.not.include('subset=time(')
        })

        it('appends format for netcdf4', () => {
            // matches URL 2: format=application%2Fx-netcdf4
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                format: 'application/x-netcdf4',
            })
            expect(request.params).to.include('format=application%2Fx-netcdf4')
        })

        it('appends format for csv', () => {
            // matches URL 1: format=text%2Fcsv
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                format: 'text/csv',
            })
            expect(request.params).to.include('format=text%2Fcsv')
        })

        it('appends each label as a separate label param', () => {
            // matches URL 1 & 2: label=collectionEntryId:...&label=variableConceptIds:...
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                labels: [
                    `collectionConceptId: ${COLLECTION_CONCEPT_ID}`,
                    `variableConceptIds: ["${VARIABLE_CONCEPT_ID}"]`,
                ],
            })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('label=')
            expect(params).to.include('C1276812863-GES_DISC')
            expect(params).to.include('V2586807132-GES_DISC')
        })

        it('appends each variableEntryId as a separate variable param', () => {
            // matches URL 1: variable=M2T1NXSLV_5_12_4_CLDTMP
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                variables: [VARIABLE_ENTRY_ID],
            })
            expect(request.params).to.include(`variable=${VARIABLE_ENTRY_ID}`)
        })

        it('appends average param', () => {
            // matches URL 1: average=time
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                average: 'time',
            })
            expect(request.params).to.include('average=time')
        })

        it('appends maxResults=10 when anonymous is true', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                anonymous: true,
            })
            expect(request.params).to.include('maxResults=10')
        })

        it('does not append maxResults when anonymous is false', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                anonymous: false,
            })
            expect(request.params).to.not.include('maxResults')
        })

        it('appends a single dimension subset', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                dimensions: [{ name: 'lev', min: 1, max: 5 }],
            })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lev(1:5)')
        })

        it('appends multiple dimension subsets', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                dimensions: [
                    { name: 'lev', min: 1, max: 5 },
                    { name: 'height', min: 10, max: 100 },
                ],
            })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lev(1:5)')
            expect(params).to.include('subset=height(10:100)')
        })

        it('does not append dimension subset when dimensions array is empty', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
                dimensions: [],
            })
            expect(request.params).to.not.include('subset=lev')
        })

        it('does not append dimension subset when dimensions is undefined', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                location: BBOX,
            })
            expect(request.params).to.not.include('subset=lev')
        })
    })

    describe('requestUrl', () => {
        it('produces a URL matching the variableConceptId pattern (URL 2)', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                variableConceptIds: [VARIABLE_CONCEPT_ID],
                location: BBOX,
                startDate: START_DATE,
                endDate: END_DATE,
                format: 'application/x-netcdf4',
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                `https://harmony.earthdata.nasa.gov/${COLLECTION_CONCEPT_ID}`,
            )
            expect(url).to.include(`/collections/${VARIABLE_CONCEPT_ID}/`)
            expect(url).to.include('subset=lat(5.29:37.49)')
            expect(url).to.include('subset=lon(62.23:94.57)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('format=application/x-netcdf4')
        })

        it('produces a URL matching the variableEntryId pattern (URL 1)', () => {
            const request = new HarmonyRequest({
                collectionConceptId: COLLECTION_CONCEPT_ID,
                variables: [VARIABLE_ENTRY_ID],
                location: BBOX,
                startDate: START_DATE,
                endDate: END_DATE,
                format: 'text/csv',
                average: 'time',
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                `https://harmony.earthdata.nasa.gov/${COLLECTION_CONCEPT_ID}`,
            )
            expect(url).to.include('/collections/parameter_vars/')
            expect(url).to.include('subset=lat(5.29:37.49)')
            expect(url).to.include('subset=lon(62.23:94.57)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('format=text/csv')
            expect(url).to.include(`variable=${VARIABLE_ENTRY_ID}`)
            expect(url).to.include('average=time')
        })

        it('NetCDF request with variable concept id', () => {
            // https://harmony.earthdata.nasa.gov/C1276812863-GES_DISC/ogc-api-coverages/1.0.0/collections/V2296950155-GES_DISC/coverage/rangeset
            // ?subset=lat(14.85:27.92)&subset=lon(65.74:91.76)&subset=time("2026-01-01":"2026-01-02")&format=application/x-netcdf4
            const request = new HarmonyRequest({
                collectionConceptId: 'C1276812863-GES_DISC',
                variableConceptIds: ['V2296950155-GES_DISC'],
                location: new LatLngBounds([65.74, 14.85, 91.76, 27.92]),
                startDate: '2026-01-01T00:00:00.000Z',
                endDate: '2026-01-02T23:59:59.000Z',
                format: 'application/x-netcdf4',
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                'harmony.earthdata.nasa.gov/C1276812863-GES_DISC',
            )
            expect(url).to.include('/collections/V2296950155-GES_DISC/')
            expect(url).to.include('subset=lat(14.85:27.92)')
            expect(url).to.include('subset=lon(65.74:91.76)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('2026-01-01T00:00:00.000Z')
            expect(url).to.include('2026-01-02T23:59:59.000Z')
            expect(url).to.include('format=application/x-netcdf4')
        })

        it('Giovanni time-averaged CSV request with variable entry id', () => {
            // https://harmony.earthdata.nasa.gov/C1276812863-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset
            // ?subset=lat(5.29:37.49)&subset=lon(62.23:94.57)&subset=time("2026-02-02":"2026-02-04")&format=text/csv&variable=M2T1NXSLV_5_12_4_CLDTMP&average=time
            const request = new HarmonyRequest({
                collectionConceptId: 'C1276812863-GES_DISC',
                variables: ['M2T1NXSLV_5_12_4_CLDTMP'],
                location: new LatLngBounds([62.23, 5.29, 94.57, 37.49]),
                startDate: '2026-02-02T00:00:00.000Z',
                endDate: '2026-02-04T00:00:00.000Z',
                format: 'text/csv',
                average: 'time',
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                'harmony.earthdata.nasa.gov/C1276812863-GES_DISC',
            )
            expect(url).to.include('/collections/parameter_vars/')
            expect(url).to.include('subset=lat(5.29:37.49)')
            expect(url).to.include('subset=lon(62.23:94.57)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('2026-02-02T00:00:00.000Z')
            expect(url).to.include('2026-02-04T00:00:00.000Z')
            expect(url).to.include('format=text/csv')
            expect(url).to.include('variable=M2T1NXSLV_5_12_4_CLDTMP')
            expect(url).to.include('average=time')
        })

        it('OPeNDAP request with opendap_url profile format', () => {
            // https://harmony.earthdata.nasa.gov/C1276812863-GES_DISC/ogc-api-coverages/1.0.0/collections/V2296950155-GES_DISC/coverage/rangeset
            // ?subset=lat(-12.16:31.74)&subset=lon(63.63:101.6)&subset=time("2025-09-02":"2025-09-04")&format=application/x-netcdf4;profile=opendap_url
            const request = new HarmonyRequest({
                collectionConceptId: 'C1276812863-GES_DISC',
                variableConceptIds: ['V2296950155-GES_DISC'],
                location: new LatLngBounds([63.63, -12.16, 101.6, 31.74]),
                startDate: '2025-09-02T00:00:00.000Z',
                endDate: '2025-09-04T00:00:00.000Z',
                format: 'application/x-netcdf4;profile=opendap_url',
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                'harmony.earthdata.nasa.gov/C1276812863-GES_DISC',
            )
            expect(url).to.include('/collections/V2296950155-GES_DISC/')
            expect(url).to.include('subset=lat(-12.16:31.74)')
            expect(url).to.include('subset=lon(63.63:101.6)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('2025-09-02T00:00:00.000Z')
            expect(url).to.include('2025-09-04T00:00:00.000Z')
            expect(url).to.include(
                'format=application/x-netcdf4;profile=opendap_url',
            )
        })

        it('PODAAC L2 subsetter request with a different collection', () => {
            // https://harmony.earthdata.nasa.gov/C1239966755-GES_DISC/ogc-api-coverages/1.0.0/collections/V2778423892-GES_DISC/coverage/rangeset
            // ?subset=lat(12.32:47.86)&subset=lon(45:85.08)&subset=time("2026-02-01":"2026-03-02")&format=application/x-netcdf4
            const request = new HarmonyRequest({
                collectionConceptId: 'C1239966755-GES_DISC',
                variableConceptIds: ['V2778423892-GES_DISC'],
                location: new LatLngBounds([45, 12.32, 85.08, 47.86]),
                startDate: '2026-02-01T00:03:05.000Z',
                endDate: '2026-03-02T08:02:04.000Z',
                format: 'application/x-netcdf4',
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                'harmony.earthdata.nasa.gov/C1239966755-GES_DISC',
            )
            expect(url).to.include('/collections/V2778423892-GES_DISC/')
            expect(url).to.include('subset=lat(12.32:47.86)')
            expect(url).to.include('subset=lon(45:85.08)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('2026-02-01T00:03:05.000Z')
            expect(url).to.include('2026-03-02T08:02:04.000Z')
            expect(url).to.include('format=application/x-netcdf4')
        })
    })

    describe('builder methods', () => {
        it('collection() sets the collectionConceptId', () => {
            const request = new HarmonyRequest().collection(
                COLLECTION_CONCEPT_ID,
            )
            expect(request.baseUrl).to.include(COLLECTION_CONCEPT_ID)
        })

        it('environment() sets the environment to UAT', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .environment(Environments.UAT)
            expect(request.baseUrl).to.include('uat')
        })

        it('variable() adds a variable concept id to the base url', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .variable(VARIABLE_CONCEPT_ID)
            expect(request.baseUrl).to.include(VARIABLE_CONCEPT_ID)
        })

        it('variable() can be chained to add multiple variable concept ids', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .variable('V1-GES_DISC')
                .variable('V2-GES_DISC')
            expect(request.baseUrl).to.include('V1-GES_DISC,V2-GES_DISC')
        })

        it('variable() with a variable entry id adds parameter_vars to the base url', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .variable(VARIABLE_ENTRY_ID)
            expect(request.baseUrl).to.include('parameter_vars')
        })

        it('variable() with a variable entry id adds the entry id as a variable param', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .variable(VARIABLE_ENTRY_ID)
            expect(request.params).to.include(`variable=${VARIABLE_ENTRY_ID}`)
        })

        it('variable() can be chained to add multiple entry ids', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .variable('entry1')
                .variable('entry2')
            expect(request.params).to.include('variable=entry1')
            expect(request.params).to.include('variable=entry2')
        })

        it('location() sets a bounding box location', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)

            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lat(5.29:37.49)')
            expect(params).to.include('subset=lon(62.23:94.57)')
        })

        it('dateRange() sets start and end dates', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .dateRange(START_DATE, END_DATE)

            const params = decodeURIComponent(request.params)
            expect(params).to.include('2026-01-01T00:00:00.000Z')
            expect(params).to.include('2026-01-02T23:59:00.000Z')
        })

        it('format() sets the output format', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .format('application/x-netcdf4')
            expect(request.params).to.include('format=application%2Fx-netcdf4')
        })

        it('label() adds a label', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .label('collection-entry-id: M2T1NXSLV_5.12.4')
            expect(request.params).to.include('label=')
            expect(request.params).to.include('M2T1NXSLV_5.12.4')
        })

        it('label() can be chained to add multiple labels', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .label('label1')
                .label('label2')
            const params = decodeURIComponent(request.params)
            expect(params).to.include('label1')
            expect(params).to.include('label2')
        })

        it('average() sets the average param', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .average('time')
            expect(request.params).to.include('average=time')
        })

        it('dimension() adds a single dimension', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .dimension({ name: 'lev', min: 1, max: 5 })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lev(1:5)')
        })

        it('dimension() can be chained to add multiple dimensions', () => {
            const request = new HarmonyRequest()
                .collection(COLLECTION_CONCEPT_ID)
                .location(BBOX)
                .dimension({ name: 'lev', min: 1, max: 5 })
                .dimension({ name: 'height', min: 10, max: 100 })
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lev(1:5)')
            expect(params).to.include('subset=height(10:100)')
        })

        it('produces URL matching the example with dimensions (subset=lev)', () => {
            // Reference example: https://harmony.earthdata.nasa.gov/C1276812882-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset
            // ?forceAsync=true&subset=lat(0:90)&subset=lon(-180:180)&subset=time("2020-12-25T00:00:00":"2020-12-25T03:00:00")&subset=lev(1:5)&label=harmony-py&variable=SO2&variable=PS
            const request = new HarmonyRequest({
                collectionConceptId: 'C1276812882-GES_DISC',
                variables: ['SO2', 'PS'],
                location: new LatLngBounds([-180, 0, 180, 90]),
                startDate: '2020-12-25T00:00:00Z',
                endDate: '2020-12-25T03:00:00Z',
                dimensions: [{ name: 'lev', min: 1, max: 5 }],
                labels: ['harmony-py'],
            })
            const url = decodeURIComponent(request.requestUrl)
            expect(url).to.include(
                'harmony.earthdata.nasa.gov/C1276812882-GES_DISC',
            )
            expect(url).to.include('/collections/parameter_vars/')
            expect(url).to.include('subset=lat(0:90)')
            expect(url).to.include('subset=lon(-180:180)')
            expect(url).to.include('subset=time(')
            expect(url).to.include('2020-12-25T00:00:00Z')
            expect(url).to.include('2020-12-25T03:00:00Z')
            expect(url).to.include('subset=lev(1:5)')
            expect(url).to.include('variable=SO2')
            expect(url).to.include('variable=PS')
            expect(url).to.include('label=harmony-py')
        })

        it('builder methods are fully chainable and produce a complete URL', () => {
            const url = decodeURIComponent(
                new HarmonyRequest()
                    .collection(COLLECTION_CONCEPT_ID)
                    .variable(VARIABLE_CONCEPT_ID)
                    .location(BBOX)
                    .dateRange(START_DATE, END_DATE)
                    .format('application/x-netcdf4')
                    .label(`collectionConceptId: ${COLLECTION_CONCEPT_ID}`)
                    .average('time').requestUrl,
            )

            expect(url).to.include('harmony.earthdata.nasa.gov')
            expect(url).to.include(COLLECTION_CONCEPT_ID)
            expect(url).to.include(VARIABLE_CONCEPT_ID)
            expect(url).to.include('subset=lat(')
            expect(url).to.include('subset=lon(')
            expect(url).to.include('subset=time(')
            expect(url).to.include('format=application/x-netcdf4')
            expect(url).to.include('average=time')
        })
    })

    describe('isVariableConceptId', () => {
        it('valid cases', () => {
            const request = new HarmonyRequest()
            expect(
                request.isVariableConceptId('V2621793629-GES_DISC'),
            ).to.equal(true)
            expect(request.isVariableConceptId('V1-foo')).to.equal(true)
            expect(request.isVariableConceptId('V123-abc-def-123')).to.equal(
                true,
            )
            expect(request.isVariableConceptId('V999-!@#$%^&*')).to.equal(true)
        })

        it('invalid cases', () => {
            const request = new HarmonyRequest()
            expect(request.isVariableConceptId('V123')).to.equal(false)
            expect(request.isVariableConceptId('V-abc')).to.equal(false)
            expect(request.isVariableConceptId('123-abc')).to.equal(false)
            expect(request.isVariableConceptId('foo')).to.equal(false)
        })
    })

    describe('fromUrl', () => {
        const EXAMPLE_URL =
            'https://harmony.earthdata.nasa.gov/C2723754847-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?subset=lat(5%3A40)&subset=lon(62%3A95)&subset=time(%222009-01-01T00%3A00%3A00Z%22%3A%222009-01-05T23%3A59%3A59Z%22)&format=text%2Fcsv&label=terra-time-series&variable=GPM_3IMERGHH_07_precipitation&average=area'

        it('parses collectionConceptId from the URL path', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            expect(request.baseUrl).to.include('C2723754847-GES_DISC')
        })

        it('sets environment to PROD for the production harmony URL', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            expect(request.baseUrl).to.include(
                'https://harmony.earthdata.nasa.gov',
            )
            expect(request.baseUrl).to.not.include('uat')
        })

        it('sets environment to UAT for the UAT harmony URL', () => {
            const uatUrl =
                'https://harmony.uat.earthdata.nasa.gov/C2723754847-GES_DISC/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?subset=lat(5:40)&subset=lon(62:95)'
            const request = HarmonyRequest.fromUrl(uatUrl)
            expect(request.baseUrl).to.include(
                'https://harmony.uat.earthdata.nasa.gov',
            )
        })

        it('parses parameter_vars path as named variables (not concept ids)', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            // parameter_vars means variable names are in query params, so baseUrl includes parameter_vars
            expect(request.baseUrl).to.include('parameter_vars')
        })

        it('parses variable concept ids from the URL path', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C1276812863-GES_DISC/ogc-api-coverages/1.0.0/collections/V2586807132-GES_DISC/coverage/rangeset?subset=lat(5:40)&subset=lon(62:95)'
            const request = HarmonyRequest.fromUrl(url)
            expect(request.baseUrl).to.include('V2586807132-GES_DISC')
            expect(request.baseUrl).to.not.include('parameter_vars')
        })

        it('parses multiple variable concept ids joined by commas in the path', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C1276812863-GES_DISC/ogc-api-coverages/1.0.0/collections/V1-GES_DISC,V2-GES_DISC/coverage/rangeset?subset=lat(0:90)&subset=lon(-180:180)'
            const request = HarmonyRequest.fromUrl(url)
            expect(request.baseUrl).to.include('V1-GES_DISC,V2-GES_DISC')
        })

        it('parses lat/lon subsets into a LatLngBounds location', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lat(5:40)')
            expect(params).to.include('subset=lon(62:95)')
        })

        it('parses the time subset into startDate and endDate', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            const params = decodeURIComponent(request.params)
            expect(params).to.include('2009-01-01T00:00:00Z')
            expect(params).to.include('2009-01-05T23:59:59Z')
        })

        it('parses the format query param', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            expect(request.params).to.include('format=text%2Fcsv')
        })

        it('parses the label query param into labels array', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            const params = decodeURIComponent(request.params)
            expect(params).to.include('label=terra-time-series')
        })

        it('parses multiple comma-separated labels', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C2723754847-GES_DISC/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?subset=lat(0:90)&subset=lon(0:180)&label=label-a,label-b'
            const request = HarmonyRequest.fromUrl(url)
            const params = decodeURIComponent(request.params)
            expect(params).to.include('label-a')
            expect(params).to.include('label-b')
        })

        it('parses variable query params', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            expect(request.params).to.include(
                'variable=GPM_3IMERGHH_07_precipitation',
            )
        })

        it('parses multiple variable query params', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C1276812882-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?subset=lat(0:90)&subset=lon(-180:180)&variable=SO2&variable=PS'
            const request = HarmonyRequest.fromUrl(url)
            expect(request.params).to.include('variable=SO2')
            expect(request.params).to.include('variable=PS')
        })

        it('parses the average query param', () => {
            const request = HarmonyRequest.fromUrl(EXAMPLE_URL)
            expect(request.params).to.include('average=area')
        })

        it('parses maxResults=10 as anonymous access', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C2723754847-GES_DISC/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?subset=lat(0:90)&subset=lon(0:180)&maxResults=10'
            const request = HarmonyRequest.fromUrl(url)
            expect(request.params).to.include('maxResults=10')
        })

        it('parses named dimension subsets', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C1276812882-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?subset=lat(0:90)&subset=lon(-180:180)&subset=lev(1:5)&variable=SO2'
            const request = HarmonyRequest.fromUrl(url)
            const params = decodeURIComponent(request.params)
            expect(params).to.include('subset=lev(1:5)')
        })

        it('parses a point subset into a LatLng location', () => {
            const url =
                'https://harmony.earthdata.nasa.gov/C2723754847-GES_DISC/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?point=37.5,94.0'
            const request = HarmonyRequest.fromUrl(url)
            const params = decodeURIComponent(request.params)
            expect(params).to.include('point=37.5,94')
        })

        it('produces a requestUrl that round-trips through fromUrl', () => {
            const original = HarmonyRequest.fromUrl(EXAMPLE_URL)
            const roundtripped = HarmonyRequest.fromUrl(original.requestUrl)
            const originalParams = decodeURIComponent(original.params)
            const roundtrippedParams = decodeURIComponent(roundtripped.params)
            expect(roundtrippedParams).to.include('subset=lat(5:40)')
            expect(roundtrippedParams).to.include('subset=lon(62:95)')
            expect(roundtrippedParams).to.include('2009-01-01T00:00:00Z')
            expect(roundtrippedParams).to.include('2009-01-05T23:59:59Z')
            expect(roundtrippedParams).to.equal(originalParams)
        })
    })
})
