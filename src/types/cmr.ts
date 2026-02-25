export interface UmmResponse<T> {
    hits: number
    items: Array<{
        meta: UmmMeta
        umm: T
    }>
}

/**
 * meta information from the CMR search endpoint
 * there are quite a few more fields available but we're only using what we need
 */
export interface UmmMeta {
    'concept-id': string
    'native-id': string
    'provider-id': string
}

// generated dynamically using Quicktype from UMM v1.18.1
// https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/browse/collection/v1.18.1
export interface UmmC {
    Abstract: string
    AccessConstraints?: AccessConstraintsType
    AdditionalAttributes?: AdditionalAttributeType[]
    AncillaryKeywords?: string[]
    ArchiveAndDistributionInformation?: ArchiveAndDistributionInformationType
    AssociatedDOIs?: AssociatedDoiType[]
    CollectionCitations?: ResourceCitationType[]
    CollectionDataType?: CollectionDataTypeEnum
    CollectionProgress: CollectionProgressEnum
    ContactGroups?: ContactGroupType[]
    ContactPersons?: ContactPersonType[]
    DataCenters: DataCenterType[]
    DataDates?: DateType[]
    DataLanguage?: string
    DataMaturity?: DataMaturity
    DirectDistributionInformation?: DirectDistributionInformationType
    DirectoryNames?: DirectoryNameType[]
    DOI: DoiType
    EntryTitle: string
    FileNamingConvention?: FileNamingConventionType
    ISOTopicCategories?: string[]
    LocationKeywords?: LocationKeywordType[]
    MetadataAssociations?: MetadataAssociationType[]
    MetadataDates?: DateType[]
    MetadataLanguage?: string
    MetadataSpecification: MetadataSpecificationType
    OtherIdentifiers?: OtherIdentifierType[]
    PaleoTemporalCoverages?: PaleoTemporalCoverageType[]
    Platforms: PlatformType[]
    ProcessingLevel: ProcessingLevelType
    Projects?: ProjectType[]
    PublicationReferences?: PublicationReferenceType[]
    Purpose?: string
    Quality?: string
    RelatedUrls?: RelatedURLType[]
    ScienceKeywords: ScienceKeywordType[]
    ShortName: string
    SpatialExtent: SpatialExtentType
    SpatialInformation?: SpatialInformationType
    SpatialKeywords?: string[]
    StandardProduct?: boolean
    TemporalExtents: TemporalExtentType[]
    TemporalKeywords?: string[]
    TilingIdentificationSystems?: TilingIdentificationSystemType[]
    UseConstraints?: UseConstraintsType
    Version: string
    VersionDescription?: string
}

export interface AccessConstraintsType {
    Description: string
    Value?: number
}

export interface AdditionalAttributeType {
    DataType: DataTypeEnum
    Description: string
    Group?: string
    MeasurementResolution?: string
    Name: string
    ParameterRangeBegin?: string
    ParameterRangeEnd?: string
    ParameterUnitsOfMeasure?: string
    ParameterValueAccuracy?: string
    UpdateDate?: Date
    Value?: string
    ValueAccuracyExplanation?: string
}

export enum DataTypeEnum {
    Boolean = 'BOOLEAN',
    Date = 'DATE',
    DateString = 'DATE_STRING',
    Datetime = 'DATETIME',
    DatetimeString = 'DATETIME_STRING',
    Float = 'FLOAT',
    Int = 'INT',
    String = 'STRING',
    Time = 'TIME',
    TimeString = 'TIME_STRING',
}

export interface ArchiveAndDistributionInformationType {
    FileArchiveInformation?: FileArchiveInformationType[]
    FileDistributionInformation?: FileDistributionInformationType[]
}

export interface FileArchiveInformationType {
    AverageFileSize?: number
    AverageFileSizeUnit?: ArchiveDistributionUnitEnum
    Description?: string
    Format: string
    FormatDescription?: string
    FormatType?: ArchiveDistributionFormatTypeEnum
    TotalCollectionFileSize?: number
    TotalCollectionFileSizeUnit?: ArchiveDistributionUnitEnum
    TotalCollectionFileSizeBeginDate?: Date
}

export enum ArchiveDistributionUnitEnum {
    GB = 'GB',
    KB = 'KB',
    MB = 'MB',
    Na = 'NA',
    Pb = 'PB',
    TB = 'TB',
}

export enum ArchiveDistributionFormatTypeEnum {
    Native = 'Native',
    Supported = 'Supported',
}

export interface FileDistributionInformationType {
    AverageFileSize?: number
    AverageFileSizeUnit?: ArchiveDistributionUnitEnum
    Description?: string
    Fees?: string
    Format: string
    FormatDescription?: string
    FormatType?: ArchiveDistributionFormatTypeEnum
    Media?: string[]
    TotalCollectionFileSize?: number
    TotalCollectionFileSizeUnit?: ArchiveDistributionUnitEnum
    TotalCollectionFileSizeBeginDate?: Date
}

export interface AssociatedDoiType {
    Authority?: string
    DOI: string
    Title?: string
    Type?: AssociatedDoiTypeType
    DescriptionOfOtherType?: string
}

export enum AssociatedDoiTypeType {
    ChildDataset = 'Child Dataset',
    CollaborativeOtherAgency = 'Collaborative/Other Agency',
    FieldCampaign = 'Field Campaign',
    Other = 'Other',
    ParentDataset = 'Parent Dataset',
    RelatedDataset = 'Related Dataset',
}

export interface ResourceCitationType {
    Creator?: string
    DataPresentationForm?: string
    Editor?: string
    IssueIdentification?: string
    OnlineResource?: OnlineResourceType
    OtherCitationDetails?: string
    Publisher?: string
    ReleaseDate?: Date
    ReleasePlace?: string
    SeriesName?: string
    Title?: string
    Version?: string
}

export interface OnlineResourceType {
    ApplicationProfile?: string
    Description?: string
    Function?: string
    Linkage: string
    MimeType?: string
    Name?: string
    Protocol?: string
}

export enum CollectionDataTypeEnum {
    Expedited = 'EXPEDITED',
    LowLatency = 'LOW_LATENCY',
    NearRealTime = 'NEAR_REAL_TIME',
    Other = 'OTHER',
    ScienceQuality = 'SCIENCE_QUALITY',
}

export enum CollectionProgressEnum {
    Active = 'ACTIVE',
    Complete = 'COMPLETE',
    Deprecated = 'DEPRECATED',
    NotApplicable = 'NOT APPLICABLE',
    NotProvided = 'NOT PROVIDED',
    Planned = 'PLANNED',
}

export interface ContactGroupType {
    ContactInformation?: ContactInformationType
    GroupName: string
    NonDataCenterAffiliation?: string
    Roles: DataContactRoleEnum[]
    Uuid?: string
}

export interface ContactInformationType {
    Addresses?: AddressType[]
    ContactInstruction?: string
    ContactMechanisms?: ContactMechanismType[]
    RelatedUrls?: RelatedURLType[]
    ServiceHours?: string
}

export interface AddressType {
    City?: string
    Country?: string
    PostalCode?: string
    StateProvince?: string
    StreetAddresses?: string[]
}

export interface ContactMechanismType {
    Type: ContactMechanismTypeEnum
    Value: string
}

export enum ContactMechanismTypeEnum {
    DirectLine = 'Direct Line',
    Email = 'Email',
    Facebook = 'Facebook',
    Fax = 'Fax',
    Mobile = 'Mobile',
    Modem = 'Modem',
    Other = 'Other',
    Primary = 'Primary',
    TDDTTYPhone = 'TDD/TTY Phone',
    Telephone = 'Telephone',
    Twitter = 'Twitter',
    USTollFree = 'U.S. toll free',
}

export interface RelatedURLType {
    Description?: string
    GetData?: GetDataType
    GetService?: GetServiceType
    Subtype?: string
    Type: string
    URL: string
    URLContentType: string
}

export interface GetDataType {
    Checksum?: string
    Fees?: string
    Format: string
    MimeType?: string
    Size: number
    Unit: GetDataUnit
}

export enum GetDataUnit {
    GB = 'GB',
    KB = 'KB',
    MB = 'MB',
    Pb = 'PB',
    TB = 'TB',
}

export interface GetServiceType {
    DataID: string
    DataType: string
    Format?: GetServiceTypeFormatEnum
    FullName: string
    MimeType: URLMIMETypeEnum
    Protocol: Protocol
    URI?: string[]
}

export enum GetServiceTypeFormatEnum {
    ASCII = 'ascii',
    Binary = 'binary',
    Bufr = 'BUFR',
    Geotiff = 'geotiff',
    Grib = 'GRIB',
    Hdf4 = 'HDF4',
    Hdf5 = 'HDF5',
    HdfEos4 = 'HDF-EOS4',
    HdfEos5 = 'HDF-EOS5',
    JPEG = 'jpeg',
    Kml = 'kml',
    NotProvided = 'Not provided',
    PNG = 'png',
    Tiff = 'tiff',
}

export enum URLMIMETypeEnum {
    ApplicationGMLXML = 'application/gml+xml',
    ApplicationJSON = 'application/json',
    ApplicationOctetStream = 'application/octet-stream',
    ApplicationOpensearchdescriptionXML = 'application/opensearchdescription+xml',
    ApplicationPDF = 'application/pdf',
    ApplicationVndGoogleEarthKmlXML = 'application/vnd.google-earth.kml+xml',
    ApplicationVndGoogleEarthKmz = 'application/vnd.google-earth.kmz',
    ApplicationXHdf = 'application/x-hdf',
    ApplicationXML = 'application/xml',
    ApplicationXNetcdf = 'application/x-netcdf',
    ApplicationXVndISO191392XML = 'application/x-vnd.iso.19139-2+xml',
    ApplicationXhdf5 = 'application/xhdf5',
    ImageBMP = 'image/bmp',
    ImageGIF = 'image/gif',
    ImageJPEG = 'image/jpeg',
    ImagePNG = 'image/png',
    ImageTiff = 'image/tiff',
    ImageVndColladaXML = 'image/vnd.collada+xml',
    NotProvided = 'Not provided',
    TextCSV = 'text/csv',
    TextHTML = 'text/html',
    TextPlain = 'text/plain',
    TextXML = 'text/xml',
}

export enum Protocol {
    FTP = 'FTP',
    Ftps = 'FTPS',
    HTTP = 'HTTP',
    HTTPS = 'HTTPS',
    NotProvided = 'Not provided',
}

export enum DataContactRoleEnum {
    DataCenterContact = 'Data Center Contact',
    Investigator = 'Investigator',
    MetadataAuthor = 'Metadata Author',
    ScienceContact = 'Science Contact',
    ScienceSoftwareDevelopment = 'Science Software Development',
    TechnicalContact = 'Technical Contact',
    UserServices = 'User Services',
}

export interface ContactPersonType {
    ContactInformation?: ContactInformationType
    FirstName?: string
    LastName: string
    MiddleName?: string
    NonDataCenterAffiliation?: string
    Roles: DataContactRoleEnum[]
    Uuid?: string
    [property: string]: any
}

export interface DoiType {
    Authority?: string
    DOI?: string
    PreviousVersion?: PreviousVersionType
    Explanation?: string
    MissingReason?: MissingReason
}

export enum MissingReason {
    NotApplicable = 'Not Applicable',
    Unknown = 'Unknown',
}

export interface PreviousVersionType {
    Description?: string
    DOI: string
    Published?: Date
    Version?: string
}

export interface DataCenterType {
    ContactGroups?: ContactGroupType[]
    ContactInformation?: ContactInformationType
    ContactPersons?: ContactPersonType[]
    LongName?: string
    Roles: DataCenterRoleEnum[]
    ShortName: string
    Uuid?: string
}

export enum DataCenterRoleEnum {
    Archiver = 'ARCHIVER',
    Distributor = 'DISTRIBUTOR',
    Originator = 'ORIGINATOR',
    Processor = 'PROCESSOR',
}

export interface DateType {
    Date: Date
    Type: LineageDateEnum
}

export enum LineageDateEnum {
    Create = 'CREATE',
    Delete = 'DELETE',
    Review = 'REVIEW',
    Update = 'UPDATE',
}

export enum DataMaturity {
    Beta = 'Beta',
    Provisional = 'Provisional',
    Stage1Validation = 'Stage 1 Validation',
    Stage2Validation = 'Stage 2 Validation',
    Stage3Validation = 'Stage 3 Validation',
    Stage4Validation = 'Stage 4 Validation',
    Validated = 'Validated',
}

export interface DirectDistributionInformationType {
    Region: DirectDistributionInformationRegionEnum
    S3BucketAndObjectPrefixNames?: string[]
    S3CredentialsAPIDocumentationURL: string
    S3CredentialsAPIEndpoint: string
}

export enum DirectDistributionInformationRegionEnum {
    UsEast1 = 'us-east-1',
    UsEast2 = 'us-east-2',
    UsWest1 = 'us-west-1',
    UsWest2 = 'us-west-2',
}

export interface DirectoryNameType {
    LongName?: string
    ShortName: string
}

export interface FileNamingConventionType {
    Convention: string
    Description?: string
}

export interface LocationKeywordType {
    Category: string
    DetailedLocation?: string
    Subregion1?: string
    Subregion2?: string
    Subregion3?: string
    Type?: string
}

export interface MetadataAssociationType {
    Description?: string
    EntryId: string
    Type?: MetadataAssociateTypeEnum
    Version?: string
}

export enum MetadataAssociateTypeEnum {
    Child = 'CHILD',
    Dependent = 'DEPENDENT',
    Input = 'INPUT',
    LargerCitationWorks = 'LARGER CITATION WORKS',
    Parent = 'PARENT',
    Related = 'RELATED',
    ScienceAssociated = 'SCIENCE ASSOCIATED',
}

export interface MetadataSpecificationType {
    Name: Name
    URL: URL
    Version: Version
}

export enum Name {
    UmmC = 'UMM-C',
}

export enum URL {
    HTTPSCDNEarthdataNasaGovUmmCollectionV1181 = 'https://cdn.earthdata.nasa.gov/umm/collection/v1.18.1',
}

export enum Version {
    The1181 = '1.18.1',
}

export interface OtherIdentifierType {
    Identifier: string
    Type: OtherIdentifierTypeType
    DescriptionOfOtherType?: string
}

export enum OtherIdentifierTypeType {
    ArchiveSetsNumber = 'ArchiveSetsNumber',
    Other = 'Other',
}

export interface PaleoTemporalCoverageType {
    ChronostratigraphicUnits?: ChronostratigraphicUnitType[]
    EndDate?: string
    StartDate?: string
}

export interface ChronostratigraphicUnitType {
    DetailedClassification?: string
    Eon: string
    Epoch?: string
    Era?: string
    Period?: string
    Stage?: string
}

export interface PlatformType {
    Characteristics?: CharacteristicType[]
    Instruments?: InstrumentType[]
    LongName?: string
    ShortName: string
    Type?: string
}

export interface CharacteristicType {
    DataType: DataTypeEnum
    Description: string
    Name: string
    Unit: string
    Value: string
}

export interface InstrumentType {
    Characteristics?: CharacteristicType[]
    ComposedOf?: InstrumentChildType[]
    LongName?: string
    NumberOfInstruments?: number
    OperationalModes?: string[]
    ShortName: string
    Technique?: string
}

export interface InstrumentChildType {
    Characteristics?: CharacteristicType[]
    LongName?: string
    ShortName: string
    Technique?: string
}

export interface ProcessingLevelType {
    Id: string
    ProcessingLevelDescription?: string
}

export interface ProjectType {
    Campaigns?: string[]
    EndDate?: Date
    LongName?: string
    ShortName: string
    StartDate?: Date
}

export interface PublicationReferenceType {
    Author?: string
    DOI?: DoiDoiType
    Edition?: string
    ISBN?: string
    Issue?: string
    OnlineResource?: OnlineResourceType
    OtherReferenceDetails?: string
    Pages?: string
    PublicationDate?: Date
    PublicationPlace?: string
    Publisher?: string
    ReportNumber?: string
    Series?: string
    Title?: string
    Volume?: string
}

export interface DoiDoiType {
    Authority?: string
    DOI: string
}

export interface ScienceKeywordType {
    Category: string
    DetailedVariable?: string
    Term: string
    Topic: string
    VariableLevel1?: string
    VariableLevel2?: string
    VariableLevel3?: string
}

export interface SpatialExtentType {
    GranuleSpatialRepresentation: GranuleSpatialRepresentationEnum
    HorizontalSpatialDomain?: HorizontalSpatialDomainType
    OrbitParameters?: OrbitParametersType
    SpatialCoverageType?: SpatialCoverageTypeEnum
    VerticalSpatialDomains?: VerticalSpatialDomainType[]
}

export enum GranuleSpatialRepresentationEnum {
    Cartesian = 'CARTESIAN',
    Geodetic = 'GEODETIC',
    NoSpatial = 'NO_SPATIAL',
    Orbit = 'ORBIT',
}

export interface HorizontalSpatialDomainType {
    Geometry: GeometryType
    ResolutionAndCoordinateSystem?: ResolutionAndCoordinateSystemType
    ZoneIdentifier?: string
}

export interface GeometryType {
    BoundingRectangles?: BoundingRectangleType[]
    CoordinateSystem: CoordinateSystemEnum
    GPolygons?: GPolygonType[]
    Lines?: LineType[]
    Points?: PointType[]
}

export interface BoundingRectangleType {
    EastBoundingCoordinate: number
    NorthBoundingCoordinate: number
    SouthBoundingCoordinate: number
    WestBoundingCoordinate: number
}

export enum CoordinateSystemEnum {
    Cartesian = 'CARTESIAN',
    Geodetic = 'GEODETIC',
}

export interface GPolygonType {
    Boundary: BoundaryType
    ExclusiveZone?: ExclusiveZoneType
}

export interface BoundaryType {
    Points: PointType[]
}

export interface PointType {
    Latitude: number
    Longitude: number
}

export interface ExclusiveZoneType {
    Boundaries: BoundaryType[]
}

export interface LineType {
    Points: PointType[]
}

export interface ResolutionAndCoordinateSystemType {
    Description?: string
    GeodeticModel?: GeodeticModelType
    HorizontalDataResolution?: HorizontalDataResolutionType
    LocalCoordinateSystem?: LocalCoordinateSystemType
}

export interface GeodeticModelType {
    DenominatorOfFlatteningRatio?: number
    EllipsoidName?: string
    HorizontalDatumName?: string
    SemiMajorAxis?: number
}

export interface HorizontalDataResolutionType {
    GenericResolutions?: HorizontalDataGenericResolutionType[]
    GriddedRangeResolutions?: HorizontalDataResolutionGriddedRangeType[]
    GriddedResolutions?: HorizontalDataResolutionGriddedType[]
    NonGriddedRangeResolutions?: HorizontalDataResolutionNonGriddedRangeType[]
    NonGriddedResolutions?: HorizontalDataResolutionNonGriddedType[]
    PointResolution?: HorizontalDataResolutionPointType
    VariesResolution?: HorizontalDataResolutionVariesType
}

export interface HorizontalDataGenericResolutionType {
    Unit: HorizontalDataResolutionUnitEnum
    XDimension?: number
    YDimension?: number
}

export enum HorizontalDataResolutionUnitEnum {
    DecimalDegrees = 'Decimal Degrees',
    Kilometers = 'Kilometers',
    Meters = 'Meters',
    NauticalMiles = 'Nautical Miles',
    NotProvided = 'Not provided',
    StatuteMiles = 'Statute Miles',
}

export interface HorizontalDataResolutionGriddedRangeType {
    MaximumXDimension?: number
    MaximumYDimension?: number
    MinimumXDimension?: number
    MinimumYDimension?: number
    Unit: HorizontalDataResolutionUnitEnum
}

export interface HorizontalDataResolutionGriddedType {
    Unit: HorizontalDataResolutionUnitEnum
    XDimension?: number
    YDimension?: number
}

export interface HorizontalDataResolutionNonGriddedRangeType {
    MaximumXDimension?: number
    MaximumYDimension?: number
    MinimumXDimension?: number
    MinimumYDimension?: number
    ScanDirection?: HorizontalResolutionScanDirectionType
    Unit: HorizontalDataResolutionUnitEnum
    ViewingAngleType?: HorizontalResolutionViewingAngleType
}

export enum HorizontalResolutionScanDirectionType {
    AlongTrack = 'Along Track',
    CrossTrack = 'Cross Track',
}

export enum HorizontalResolutionViewingAngleType {
    AtNadir = 'At Nadir',
    ScanExtremes = 'Scan Extremes',
}

export interface HorizontalDataResolutionNonGriddedType {
    ScanDirection?: HorizontalResolutionScanDirectionType
    Unit: HorizontalDataResolutionUnitEnum
    ViewingAngleType?: HorizontalResolutionViewingAngleType
    XDimension?: number
    YDimension?: number
}

export enum HorizontalDataResolutionPointType {
    Point = 'Point',
}

export enum HorizontalDataResolutionVariesType {
    Varies = 'Varies',
}

export interface LocalCoordinateSystemType {
    Description?: string
    GeoReferenceInformation?: string
}

export interface OrbitParametersType {
    InclinationAngle: number
    InclinationAngleUnit: EUnit
    NumberOfOrbits: number
    OrbitPeriod: number
    OrbitPeriodUnit: OrbitPeriodUnit
    StartCircularLatitude?: number
    StartCircularLatitudeUnit?: EUnit
    SwathWidth?: number
    SwathWidthUnit?: FootprintUnit
    Footprints?: FootprintType[]
}

export interface FootprintType {
    Description?: string
    Footprint: number
    FootprintUnit: FootprintUnit
}

export enum FootprintUnit {
    Kilometer = 'Kilometer',
    Meter = 'Meter',
}

export enum EUnit {
    Degree = 'Degree',
}

export enum OrbitPeriodUnit {
    DecimalMinute = 'Decimal Minute',
}

export enum SpatialCoverageTypeEnum {
    EarthGlobal = 'EARTH/GLOBAL',
    Horizontal = 'HORIZONTAL',
    HorizontalOrbital = 'HORIZONTAL_ORBITAL',
    HorizontalVertical = 'HORIZONTAL_VERTICAL',
    HorizontalVerticalOrbital = 'HORIZONTAL_VERTICAL_ORBITAL',
    Lunar = 'LUNAR',
    Orbital = 'ORBITAL',
    OrbitalVertical = 'ORBITAL_VERTICAL',
    Vertical = 'VERTICAL',
}

export interface VerticalSpatialDomainType {
    Type: VerticalSpatialDomainTypeEnum
    Value: string
}

export enum VerticalSpatialDomainTypeEnum {
    AtmosphereLayer = 'Atmosphere Layer',
    MaximumAltitude = 'Maximum Altitude',
    MaximumDepth = 'Maximum Depth',
    MinimumAltitude = 'Minimum Altitude',
    MinimumDepth = 'Minimum Depth',
}

export interface SpatialInformationType {
    SpatialCoverageType: string
    VerticalCoordinateSystem?: VerticalCoordinateSystemType
}

export interface VerticalCoordinateSystemType {
    AltitudeSystemDefinition?: AltitudeSystemDefinitionType
    DepthSystemDefinition?: DepthSystemDefinitionType
}

export interface AltitudeSystemDefinitionType {
    DatumName?: string
    DistanceUnits?: AltitudeDistanceUnitsEnum
    Resolutions?: number[]
}

export enum AltitudeDistanceUnitsEnum {
    HectoPascals = 'HectoPascals',
    Kilometers = 'Kilometers',
    Millibars = 'Millibars',
}

export interface DepthSystemDefinitionType {
    DatumName?: string
    DistanceUnits?: DepthDistanceUnitsEnum
    Resolutions?: number[]
}

export enum DepthDistanceUnitsEnum {
    Fathoms = 'Fathoms',
    Feet = 'Feet',
    HectoPascals = 'HectoPascals',
    Meters = 'Meters',
    Millibars = 'Millibars',
}

export interface TemporalExtentType {
    EndsAtPresentFlag?: boolean
    PeriodicDateTimes?: PeriodicDateTimeType[]
    PrecisionOfSeconds?: number
    RangeDateTimes?: RangeDateTimeType[]
    SingleDateTimes?: Date[]
    TemporalResolution?: TemporalResolutionType
}

export interface PeriodicDateTimeType {
    DurationUnit: DurationUnitEnum
    DurationValue: number
    EndDate: Date
    Name: string
    PeriodCycleDurationUnit: DurationUnitEnum
    PeriodCycleDurationValue: number
    StartDate: Date
}

export enum DurationUnitEnum {
    Day = 'DAY',
    Month = 'MONTH',
    Year = 'YEAR',
}

export interface RangeDateTimeType {
    BeginningDateTime: Date
    EndingDateTime?: Date
}

export interface TemporalResolutionType {
    Unit: TemporalResolutionTypeUnit
    Value?: number
}

export enum TemporalResolutionTypeUnit {
    Constant = 'Constant',
    Day = 'Day',
    Diurnal = 'Diurnal',
    Hour = 'Hour',
    Minute = 'Minute',
    Month = 'Month',
    Second = 'Second',
    Varies = 'Varies',
    Week = 'Week',
    Year = 'Year',
}

export interface TilingIdentificationSystemType {
    Coordinate1: TilingCoordinateType
    Coordinate2: TilingCoordinateType
    TilingIdentificationSystemName: TilingIdentificationSystemName
}

export interface TilingCoordinateType {
    MaximumValue?: number | string
    MinimumValue?: number | string
}

export enum TilingIdentificationSystemName {
    Calipso = 'CALIPSO',
    MODISTileEASE = 'MODIS Tile EASE',
    MODISTileSIN = 'MODIS Tile SIN',
    MilitaryGridReferenceSystem = 'Military Grid Reference System',
    Misr = 'MISR',
    WELDAlaskaTile = 'WELD Alaska Tile',
    WELDCONUSTile = 'WELD CONUS Tile',
    Wrs1 = 'WRS-1',
    Wrs2 = 'WRS-2',
}

export interface UseConstraintsType {
    Description?: string
    EULAIdentifiers?: string[]
    FreeAndOpenData?: boolean
    LicenseURL?: OnlineResourceType
    LicenseText?: string
}

export class Convert {
    public static toUmmC(json: string): UmmC {
        return cast(JSON.parse(json), r('UmmC'))
    }

    public static ummCToJson(value: UmmC): string {
        return JSON.stringify(uncast(value, r('UmmC')), null, 2)
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ)
    const parentText = parent ? ` on ${parent}` : ''
    const keyText = key ? ` for key "${key}"` : ''
    throw Error(
        `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`
    )
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`
        } else {
            return `one of [${typ
                .map(a => {
                    return prettyTypeName(a)
                })
                .join(', ')}]`
        }
    } else if (typeof typ === 'object' && typ.literal !== undefined) {
        return typ.literal
    } else {
        return typeof typ
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {}
        typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
        typ.jsonToJS = map
    }
    return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {}
        typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
        typ.jsToJSON = map
    }
    return typ.jsToJSON
}

function transform(
    val: any,
    typ: any,
    getProps: any,
    key: any = '',
    parent: any = ''
): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val
        return invalidValue(typ, val, key, parent)
    }

    function transformUnion(typs: any[], val: any): any {
        const l = typs.length
        for (let i = 0; i < l; i++) {
            const typ = typs[i]
            try {
                return transform(val, typ, getProps)
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent)
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val
        return invalidValue(
            cases.map(a => {
                return l(a)
            }),
            val,
            key,
            parent
        )
    }

    function transformArray(typ: any, val: any): any {
        if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent)
        return val.map(el => transform(el, typ, getProps))
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null
        }
        const d = new Date(val)
        if (isNaN(d.valueOf())) {
            return invalidValue(l('Date'), val, key, parent)
        }
        return d
    }

    function transformObject(
        props: { [k: string]: any },
        additional: any,
        val: any
    ): any {
        if (val === null || typeof val !== 'object' || Array.isArray(val)) {
            return invalidValue(l(ref || 'object'), val, key, parent)
        }
        const result: any = {}
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key]
            const v = Object.prototype.hasOwnProperty.call(val, key)
                ? val[key]
                : undefined
            result[prop.key] = transform(v, prop.typ, getProps, key, ref)
        })
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref)
            }
        })
        return result
    }

    if (typ === 'any') return val
    if (typ === null) {
        if (val === null) return val
        return invalidValue(typ, val, key, parent)
    }
    if (typ === false) return invalidValue(typ, val, key, parent)
    let ref: any = undefined
    while (typeof typ === 'object' && typ.ref !== undefined) {
        ref = typ.ref
        typ = typeMap[typ.ref]
    }
    if (Array.isArray(typ)) return transformEnum(typ, val)
    if (typeof typ === 'object') {
        return typ.hasOwnProperty('unionMembers')
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty('arrayItems')
              ? transformArray(typ.arrayItems, val)
              : typ.hasOwnProperty('props')
                ? transformObject(getProps(typ), typ.additional, val)
                : invalidValue(typ, val, key, parent)
    }
    if (typ === Date && typeof val !== 'number') return transformDate(val)
    return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps)
}

function l(typ: any) {
    return { literal: typ }
}

function a(typ: any) {
    return { arrayItems: typ }
}

function u(...typs: any[]) {
    return { unionMembers: typs }
}

function o(props: any[], additional: any) {
    return { props, additional }
}

function m(additional: any) {
    return { props: [], additional }
}

function r(name: string) {
    return { ref: name }
}

const typeMap: any = {
    UmmC: o(
        [
            { json: 'Abstract', js: 'Abstract', typ: '' },
            {
                json: 'AccessConstraints',
                js: 'AccessConstraints',
                typ: u(undefined, r('AccessConstraintsType')),
            },
            {
                json: 'AdditionalAttributes',
                js: 'AdditionalAttributes',
                typ: u(undefined, a(r('AdditionalAttributeType'))),
            },
            {
                json: 'AncillaryKeywords',
                js: 'AncillaryKeywords',
                typ: u(undefined, a('')),
            },
            {
                json: 'ArchiveAndDistributionInformation',
                js: 'ArchiveAndDistributionInformation',
                typ: u(undefined, r('ArchiveAndDistributionInformationType')),
            },
            {
                json: 'AssociatedDOIs',
                js: 'AssociatedDOIs',
                typ: u(undefined, a(r('AssociatedDoiType'))),
            },
            {
                json: 'CollectionCitations',
                js: 'CollectionCitations',
                typ: u(undefined, a(r('ResourceCitationType'))),
            },
            {
                json: 'CollectionDataType',
                js: 'CollectionDataType',
                typ: u(undefined, r('CollectionDataTypeEnum')),
            },
            {
                json: 'CollectionProgress',
                js: 'CollectionProgress',
                typ: r('CollectionProgressEnum'),
            },
            {
                json: 'ContactGroups',
                js: 'ContactGroups',
                typ: u(undefined, a(r('ContactGroupType'))),
            },
            {
                json: 'ContactPersons',
                js: 'ContactPersons',
                typ: u(undefined, a(r('ContactPersonType'))),
            },
            { json: 'DataCenters', js: 'DataCenters', typ: a(r('DataCenterType')) },
            {
                json: 'DataDates',
                js: 'DataDates',
                typ: u(undefined, a(r('DateType'))),
            },
            { json: 'DataLanguage', js: 'DataLanguage', typ: u(undefined, '') },
            {
                json: 'DataMaturity',
                js: 'DataMaturity',
                typ: u(undefined, r('DataMaturity')),
            },
            {
                json: 'DirectDistributionInformation',
                js: 'DirectDistributionInformation',
                typ: u(undefined, r('DirectDistributionInformationType')),
            },
            {
                json: 'DirectoryNames',
                js: 'DirectoryNames',
                typ: u(undefined, a(r('DirectoryNameType'))),
            },
            { json: 'DOI', js: 'DOI', typ: r('DoiType') },
            { json: 'EntryTitle', js: 'EntryTitle', typ: '' },
            {
                json: 'FileNamingConvention',
                js: 'FileNamingConvention',
                typ: u(undefined, r('FileNamingConventionType')),
            },
            {
                json: 'ISOTopicCategories',
                js: 'ISOTopicCategories',
                typ: u(undefined, a('')),
            },
            {
                json: 'LocationKeywords',
                js: 'LocationKeywords',
                typ: u(undefined, a(r('LocationKeywordType'))),
            },
            {
                json: 'MetadataAssociations',
                js: 'MetadataAssociations',
                typ: u(undefined, a(r('MetadataAssociationType'))),
            },
            {
                json: 'MetadataDates',
                js: 'MetadataDates',
                typ: u(undefined, a(r('DateType'))),
            },
            {
                json: 'MetadataLanguage',
                js: 'MetadataLanguage',
                typ: u(undefined, ''),
            },
            {
                json: 'MetadataSpecification',
                js: 'MetadataSpecification',
                typ: r('MetadataSpecificationType'),
            },
            {
                json: 'OtherIdentifiers',
                js: 'OtherIdentifiers',
                typ: u(undefined, a(r('OtherIdentifierType'))),
            },
            {
                json: 'PaleoTemporalCoverages',
                js: 'PaleoTemporalCoverages',
                typ: u(undefined, a(r('PaleoTemporalCoverageType'))),
            },
            { json: 'Platforms', js: 'Platforms', typ: a(r('PlatformType')) },
            {
                json: 'ProcessingLevel',
                js: 'ProcessingLevel',
                typ: r('ProcessingLevelType'),
            },
            {
                json: 'Projects',
                js: 'Projects',
                typ: u(undefined, a(r('ProjectType'))),
            },
            {
                json: 'PublicationReferences',
                js: 'PublicationReferences',
                typ: u(undefined, a(r('PublicationReferenceType'))),
            },
            { json: 'Purpose', js: 'Purpose', typ: u(undefined, '') },
            { json: 'Quality', js: 'Quality', typ: u(undefined, '') },
            {
                json: 'RelatedUrls',
                js: 'RelatedUrls',
                typ: u(undefined, a(r('RelatedURLType'))),
            },
            {
                json: 'ScienceKeywords',
                js: 'ScienceKeywords',
                typ: a(r('ScienceKeywordType')),
            },
            { json: 'ShortName', js: 'ShortName', typ: '' },
            {
                json: 'SpatialExtent',
                js: 'SpatialExtent',
                typ: r('SpatialExtentType'),
            },
            {
                json: 'SpatialInformation',
                js: 'SpatialInformation',
                typ: u(undefined, r('SpatialInformationType')),
            },
            {
                json: 'SpatialKeywords',
                js: 'SpatialKeywords',
                typ: u(undefined, a('')),
            },
            {
                json: 'StandardProduct',
                js: 'StandardProduct',
                typ: u(undefined, true),
            },
            {
                json: 'TemporalExtents',
                js: 'TemporalExtents',
                typ: a(r('TemporalExtentType')),
            },
            {
                json: 'TemporalKeywords',
                js: 'TemporalKeywords',
                typ: u(undefined, a('')),
            },
            {
                json: 'TilingIdentificationSystems',
                js: 'TilingIdentificationSystems',
                typ: u(undefined, a(r('TilingIdentificationSystemType'))),
            },
            {
                json: 'UseConstraints',
                js: 'UseConstraints',
                typ: u(undefined, r('UseConstraintsType')),
            },
            { json: 'Version', js: 'Version', typ: '' },
            {
                json: 'VersionDescription',
                js: 'VersionDescription',
                typ: u(undefined, ''),
            },
        ],
        false
    ),
    AccessConstraintsType: o(
        [
            { json: 'Description', js: 'Description', typ: '' },
            { json: 'Value', js: 'Value', typ: u(undefined, 3.14) },
        ],
        false
    ),
    AdditionalAttributeType: o(
        [
            { json: 'DataType', js: 'DataType', typ: r('DataTypeEnum') },
            { json: 'Description', js: 'Description', typ: '' },
            { json: 'Group', js: 'Group', typ: u(undefined, '') },
            {
                json: 'MeasurementResolution',
                js: 'MeasurementResolution',
                typ: u(undefined, ''),
            },
            { json: 'Name', js: 'Name', typ: '' },
            {
                json: 'ParameterRangeBegin',
                js: 'ParameterRangeBegin',
                typ: u(undefined, ''),
            },
            {
                json: 'ParameterRangeEnd',
                js: 'ParameterRangeEnd',
                typ: u(undefined, ''),
            },
            {
                json: 'ParameterUnitsOfMeasure',
                js: 'ParameterUnitsOfMeasure',
                typ: u(undefined, ''),
            },
            {
                json: 'ParameterValueAccuracy',
                js: 'ParameterValueAccuracy',
                typ: u(undefined, ''),
            },
            { json: 'UpdateDate', js: 'UpdateDate', typ: u(undefined, Date) },
            { json: 'Value', js: 'Value', typ: u(undefined, '') },
            {
                json: 'ValueAccuracyExplanation',
                js: 'ValueAccuracyExplanation',
                typ: u(undefined, ''),
            },
        ],
        false
    ),
    ArchiveAndDistributionInformationType: o(
        [
            {
                json: 'FileArchiveInformation',
                js: 'FileArchiveInformation',
                typ: u(undefined, a(r('FileArchiveInformationType'))),
            },
            {
                json: 'FileDistributionInformation',
                js: 'FileDistributionInformation',
                typ: u(undefined, a(r('FileDistributionInformationType'))),
            },
        ],
        false
    ),
    FileArchiveInformationType: o(
        [
            {
                json: 'AverageFileSize',
                js: 'AverageFileSize',
                typ: u(undefined, 3.14),
            },
            {
                json: 'AverageFileSizeUnit',
                js: 'AverageFileSizeUnit',
                typ: u(undefined, r('ArchiveDistributionUnitEnum')),
            },
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'Format', js: 'Format', typ: '' },
            {
                json: 'FormatDescription',
                js: 'FormatDescription',
                typ: u(undefined, ''),
            },
            {
                json: 'FormatType',
                js: 'FormatType',
                typ: u(undefined, r('ArchiveDistributionFormatTypeEnum')),
            },
            {
                json: 'TotalCollectionFileSize',
                js: 'TotalCollectionFileSize',
                typ: u(undefined, 3.14),
            },
            {
                json: 'TotalCollectionFileSizeUnit',
                js: 'TotalCollectionFileSizeUnit',
                typ: u(undefined, r('ArchiveDistributionUnitEnum')),
            },
            {
                json: 'TotalCollectionFileSizeBeginDate',
                js: 'TotalCollectionFileSizeBeginDate',
                typ: u(undefined, Date),
            },
        ],
        false
    ),
    FileDistributionInformationType: o(
        [
            {
                json: 'AverageFileSize',
                js: 'AverageFileSize',
                typ: u(undefined, 3.14),
            },
            {
                json: 'AverageFileSizeUnit',
                js: 'AverageFileSizeUnit',
                typ: u(undefined, r('ArchiveDistributionUnitEnum')),
            },
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'Fees', js: 'Fees', typ: u(undefined, '') },
            { json: 'Format', js: 'Format', typ: '' },
            {
                json: 'FormatDescription',
                js: 'FormatDescription',
                typ: u(undefined, ''),
            },
            {
                json: 'FormatType',
                js: 'FormatType',
                typ: u(undefined, r('ArchiveDistributionFormatTypeEnum')),
            },
            { json: 'Media', js: 'Media', typ: u(undefined, a('')) },
            {
                json: 'TotalCollectionFileSize',
                js: 'TotalCollectionFileSize',
                typ: u(undefined, 3.14),
            },
            {
                json: 'TotalCollectionFileSizeUnit',
                js: 'TotalCollectionFileSizeUnit',
                typ: u(undefined, r('ArchiveDistributionUnitEnum')),
            },
            {
                json: 'TotalCollectionFileSizeBeginDate',
                js: 'TotalCollectionFileSizeBeginDate',
                typ: u(undefined, Date),
            },
        ],
        false
    ),
    AssociatedDoiType: o(
        [
            { json: 'Authority', js: 'Authority', typ: u(undefined, '') },
            { json: 'DOI', js: 'DOI', typ: '' },
            { json: 'Title', js: 'Title', typ: u(undefined, '') },
            {
                json: 'Type',
                js: 'Type',
                typ: u(undefined, r('AssociatedDoiTypeType')),
            },
            {
                json: 'DescriptionOfOtherType',
                js: 'DescriptionOfOtherType',
                typ: u(undefined, ''),
            },
        ],
        false
    ),
    ResourceCitationType: o(
        [
            { json: 'Creator', js: 'Creator', typ: u(undefined, '') },
            {
                json: 'DataPresentationForm',
                js: 'DataPresentationForm',
                typ: u(undefined, ''),
            },
            { json: 'Editor', js: 'Editor', typ: u(undefined, '') },
            {
                json: 'IssueIdentification',
                js: 'IssueIdentification',
                typ: u(undefined, ''),
            },
            {
                json: 'OnlineResource',
                js: 'OnlineResource',
                typ: u(undefined, r('OnlineResourceType')),
            },
            {
                json: 'OtherCitationDetails',
                js: 'OtherCitationDetails',
                typ: u(undefined, ''),
            },
            { json: 'Publisher', js: 'Publisher', typ: u(undefined, '') },
            { json: 'ReleaseDate', js: 'ReleaseDate', typ: u(undefined, Date) },
            { json: 'ReleasePlace', js: 'ReleasePlace', typ: u(undefined, '') },
            { json: 'SeriesName', js: 'SeriesName', typ: u(undefined, '') },
            { json: 'Title', js: 'Title', typ: u(undefined, '') },
            { json: 'Version', js: 'Version', typ: u(undefined, '') },
        ],
        false
    ),
    OnlineResourceType: o(
        [
            {
                json: 'ApplicationProfile',
                js: 'ApplicationProfile',
                typ: u(undefined, ''),
            },
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'Function', js: 'Function', typ: u(undefined, '') },
            { json: 'Linkage', js: 'Linkage', typ: '' },
            { json: 'MimeType', js: 'MimeType', typ: u(undefined, '') },
            { json: 'Name', js: 'Name', typ: u(undefined, '') },
            { json: 'Protocol', js: 'Protocol', typ: u(undefined, '') },
        ],
        false
    ),
    ContactGroupType: o(
        [
            {
                json: 'ContactInformation',
                js: 'ContactInformation',
                typ: u(undefined, r('ContactInformationType')),
            },
            { json: 'GroupName', js: 'GroupName', typ: '' },
            {
                json: 'NonDataCenterAffiliation',
                js: 'NonDataCenterAffiliation',
                typ: u(undefined, ''),
            },
            { json: 'Roles', js: 'Roles', typ: a(r('DataContactRoleEnum')) },
            { json: 'Uuid', js: 'Uuid', typ: u(undefined, '') },
        ],
        false
    ),
    ContactInformationType: o(
        [
            {
                json: 'Addresses',
                js: 'Addresses',
                typ: u(undefined, a(r('AddressType'))),
            },
            {
                json: 'ContactInstruction',
                js: 'ContactInstruction',
                typ: u(undefined, ''),
            },
            {
                json: 'ContactMechanisms',
                js: 'ContactMechanisms',
                typ: u(undefined, a(r('ContactMechanismType'))),
            },
            {
                json: 'RelatedUrls',
                js: 'RelatedUrls',
                typ: u(undefined, a(r('RelatedURLType'))),
            },
            { json: 'ServiceHours', js: 'ServiceHours', typ: u(undefined, '') },
        ],
        false
    ),
    AddressType: o(
        [
            { json: 'City', js: 'City', typ: u(undefined, '') },
            { json: 'Country', js: 'Country', typ: u(undefined, '') },
            { json: 'PostalCode', js: 'PostalCode', typ: u(undefined, '') },
            { json: 'StateProvince', js: 'StateProvince', typ: u(undefined, '') },
            {
                json: 'StreetAddresses',
                js: 'StreetAddresses',
                typ: u(undefined, a('')),
            },
        ],
        false
    ),
    ContactMechanismType: o(
        [
            { json: 'Type', js: 'Type', typ: r('ContactMechanismTypeEnum') },
            { json: 'Value', js: 'Value', typ: '' },
        ],
        false
    ),
    RelatedURLType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'GetData', js: 'GetData', typ: u(undefined, r('GetDataType')) },
            {
                json: 'GetService',
                js: 'GetService',
                typ: u(undefined, r('GetServiceType')),
            },
            { json: 'Subtype', js: 'Subtype', typ: u(undefined, '') },
            { json: 'Type', js: 'Type', typ: '' },
            { json: 'URL', js: 'URL', typ: '' },
            { json: 'URLContentType', js: 'URLContentType', typ: '' },
        ],
        false
    ),
    GetDataType: o(
        [
            { json: 'Checksum', js: 'Checksum', typ: u(undefined, '') },
            { json: 'Fees', js: 'Fees', typ: u(undefined, '') },
            { json: 'Format', js: 'Format', typ: '' },
            { json: 'MimeType', js: 'MimeType', typ: u(undefined, '') },
            { json: 'Size', js: 'Size', typ: 3.14 },
            { json: 'Unit', js: 'Unit', typ: r('GetDataUnit') },
        ],
        false
    ),
    GetServiceType: o(
        [
            { json: 'DataID', js: 'DataID', typ: '' },
            { json: 'DataType', js: 'DataType', typ: '' },
            {
                json: 'Format',
                js: 'Format',
                typ: u(undefined, r('GetServiceTypeFormatEnum')),
            },
            { json: 'FullName', js: 'FullName', typ: '' },
            { json: 'MimeType', js: 'MimeType', typ: r('URLMIMETypeEnum') },
            { json: 'Protocol', js: 'Protocol', typ: r('Protocol') },
            { json: 'URI', js: 'URI', typ: u(undefined, a('')) },
        ],
        false
    ),
    ContactPersonType: o(
        [
            {
                json: 'ContactInformation',
                js: 'ContactInformation',
                typ: u(undefined, r('ContactInformationType')),
            },
            { json: 'FirstName', js: 'FirstName', typ: u(undefined, '') },
            { json: 'LastName', js: 'LastName', typ: '' },
            { json: 'MiddleName', js: 'MiddleName', typ: u(undefined, '') },
            {
                json: 'NonDataCenterAffiliation',
                js: 'NonDataCenterAffiliation',
                typ: u(undefined, ''),
            },
            { json: 'Roles', js: 'Roles', typ: a(r('DataContactRoleEnum')) },
            { json: 'Uuid', js: 'Uuid', typ: u(undefined, '') },
        ],
        'any'
    ),
    DoiType: o(
        [
            { json: 'Authority', js: 'Authority', typ: u(undefined, '') },
            { json: 'DOI', js: 'DOI', typ: u(undefined, '') },
            {
                json: 'PreviousVersion',
                js: 'PreviousVersion',
                typ: u(undefined, r('PreviousVersionType')),
            },
            { json: 'Explanation', js: 'Explanation', typ: u(undefined, '') },
            {
                json: 'MissingReason',
                js: 'MissingReason',
                typ: u(undefined, r('MissingReason')),
            },
        ],
        false
    ),
    PreviousVersionType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'DOI', js: 'DOI', typ: '' },
            { json: 'Published', js: 'Published', typ: u(undefined, Date) },
            { json: 'Version', js: 'Version', typ: u(undefined, '') },
        ],
        false
    ),
    DataCenterType: o(
        [
            {
                json: 'ContactGroups',
                js: 'ContactGroups',
                typ: u(undefined, a(r('ContactGroupType'))),
            },
            {
                json: 'ContactInformation',
                js: 'ContactInformation',
                typ: u(undefined, r('ContactInformationType')),
            },
            {
                json: 'ContactPersons',
                js: 'ContactPersons',
                typ: u(undefined, a(r('ContactPersonType'))),
            },
            { json: 'LongName', js: 'LongName', typ: u(undefined, '') },
            { json: 'Roles', js: 'Roles', typ: a(r('DataCenterRoleEnum')) },
            { json: 'ShortName', js: 'ShortName', typ: '' },
            { json: 'Uuid', js: 'Uuid', typ: u(undefined, '') },
        ],
        false
    ),
    DateType: o(
        [
            { json: 'Date', js: 'Date', typ: Date },
            { json: 'Type', js: 'Type', typ: r('LineageDateEnum') },
        ],
        false
    ),
    DirectDistributionInformationType: o(
        [
            {
                json: 'Region',
                js: 'Region',
                typ: r('DirectDistributionInformationRegionEnum'),
            },
            {
                json: 'S3BucketAndObjectPrefixNames',
                js: 'S3BucketAndObjectPrefixNames',
                typ: u(undefined, a('')),
            },
            {
                json: 'S3CredentialsAPIDocumentationURL',
                js: 'S3CredentialsAPIDocumentationURL',
                typ: '',
            },
            {
                json: 'S3CredentialsAPIEndpoint',
                js: 'S3CredentialsAPIEndpoint',
                typ: '',
            },
        ],
        false
    ),
    DirectoryNameType: o(
        [
            { json: 'LongName', js: 'LongName', typ: u(undefined, '') },
            { json: 'ShortName', js: 'ShortName', typ: '' },
        ],
        false
    ),
    FileNamingConventionType: o(
        [
            { json: 'Convention', js: 'Convention', typ: '' },
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
        ],
        false
    ),
    LocationKeywordType: o(
        [
            { json: 'Category', js: 'Category', typ: '' },
            {
                json: 'DetailedLocation',
                js: 'DetailedLocation',
                typ: u(undefined, ''),
            },
            { json: 'Subregion1', js: 'Subregion1', typ: u(undefined, '') },
            { json: 'Subregion2', js: 'Subregion2', typ: u(undefined, '') },
            { json: 'Subregion3', js: 'Subregion3', typ: u(undefined, '') },
            { json: 'Type', js: 'Type', typ: u(undefined, '') },
        ],
        false
    ),
    MetadataAssociationType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'EntryId', js: 'EntryId', typ: '' },
            {
                json: 'Type',
                js: 'Type',
                typ: u(undefined, r('MetadataAssociateTypeEnum')),
            },
            { json: 'Version', js: 'Version', typ: u(undefined, '') },
        ],
        false
    ),
    MetadataSpecificationType: o(
        [
            { json: 'Name', js: 'Name', typ: r('Name') },
            { json: 'URL', js: 'URL', typ: r('URL') },
            { json: 'Version', js: 'Version', typ: r('Version') },
        ],
        false
    ),
    OtherIdentifierType: o(
        [
            { json: 'Identifier', js: 'Identifier', typ: '' },
            { json: 'Type', js: 'Type', typ: r('OtherIdentifierTypeType') },
            {
                json: 'DescriptionOfOtherType',
                js: 'DescriptionOfOtherType',
                typ: u(undefined, ''),
            },
        ],
        false
    ),
    PaleoTemporalCoverageType: o(
        [
            {
                json: 'ChronostratigraphicUnits',
                js: 'ChronostratigraphicUnits',
                typ: u(undefined, a(r('ChronostratigraphicUnitType'))),
            },
            { json: 'EndDate', js: 'EndDate', typ: u(undefined, '') },
            { json: 'StartDate', js: 'StartDate', typ: u(undefined, '') },
        ],
        false
    ),
    ChronostratigraphicUnitType: o(
        [
            {
                json: 'DetailedClassification',
                js: 'DetailedClassification',
                typ: u(undefined, ''),
            },
            { json: 'Eon', js: 'Eon', typ: '' },
            { json: 'Epoch', js: 'Epoch', typ: u(undefined, '') },
            { json: 'Era', js: 'Era', typ: u(undefined, '') },
            { json: 'Period', js: 'Period', typ: u(undefined, '') },
            { json: 'Stage', js: 'Stage', typ: u(undefined, '') },
        ],
        false
    ),
    PlatformType: o(
        [
            {
                json: 'Characteristics',
                js: 'Characteristics',
                typ: u(undefined, a(r('CharacteristicType'))),
            },
            {
                json: 'Instruments',
                js: 'Instruments',
                typ: u(undefined, a(r('InstrumentType'))),
            },
            { json: 'LongName', js: 'LongName', typ: u(undefined, '') },
            { json: 'ShortName', js: 'ShortName', typ: '' },
            { json: 'Type', js: 'Type', typ: u(undefined, '') },
        ],
        false
    ),
    CharacteristicType: o(
        [
            { json: 'DataType', js: 'DataType', typ: r('DataTypeEnum') },
            { json: 'Description', js: 'Description', typ: '' },
            { json: 'Name', js: 'Name', typ: '' },
            { json: 'Unit', js: 'Unit', typ: '' },
            { json: 'Value', js: 'Value', typ: '' },
        ],
        false
    ),
    InstrumentType: o(
        [
            {
                json: 'Characteristics',
                js: 'Characteristics',
                typ: u(undefined, a(r('CharacteristicType'))),
            },
            {
                json: 'ComposedOf',
                js: 'ComposedOf',
                typ: u(undefined, a(r('InstrumentChildType'))),
            },
            { json: 'LongName', js: 'LongName', typ: u(undefined, '') },
            {
                json: 'NumberOfInstruments',
                js: 'NumberOfInstruments',
                typ: u(undefined, 0),
            },
            {
                json: 'OperationalModes',
                js: 'OperationalModes',
                typ: u(undefined, a('')),
            },
            { json: 'ShortName', js: 'ShortName', typ: '' },
            { json: 'Technique', js: 'Technique', typ: u(undefined, '') },
        ],
        false
    ),
    InstrumentChildType: o(
        [
            {
                json: 'Characteristics',
                js: 'Characteristics',
                typ: u(undefined, a(r('CharacteristicType'))),
            },
            { json: 'LongName', js: 'LongName', typ: u(undefined, '') },
            { json: 'ShortName', js: 'ShortName', typ: '' },
            { json: 'Technique', js: 'Technique', typ: u(undefined, '') },
        ],
        false
    ),
    ProcessingLevelType: o(
        [
            { json: 'Id', js: 'Id', typ: '' },
            {
                json: 'ProcessingLevelDescription',
                js: 'ProcessingLevelDescription',
                typ: u(undefined, ''),
            },
        ],
        false
    ),
    ProjectType: o(
        [
            { json: 'Campaigns', js: 'Campaigns', typ: u(undefined, a('')) },
            { json: 'EndDate', js: 'EndDate', typ: u(undefined, Date) },
            { json: 'LongName', js: 'LongName', typ: u(undefined, '') },
            { json: 'ShortName', js: 'ShortName', typ: '' },
            { json: 'StartDate', js: 'StartDate', typ: u(undefined, Date) },
        ],
        false
    ),
    PublicationReferenceType: o(
        [
            { json: 'Author', js: 'Author', typ: u(undefined, '') },
            { json: 'DOI', js: 'DOI', typ: u(undefined, r('DoiDoiType')) },
            { json: 'Edition', js: 'Edition', typ: u(undefined, '') },
            { json: 'ISBN', js: 'ISBN', typ: u(undefined, '') },
            { json: 'Issue', js: 'Issue', typ: u(undefined, '') },
            {
                json: 'OnlineResource',
                js: 'OnlineResource',
                typ: u(undefined, r('OnlineResourceType')),
            },
            {
                json: 'OtherReferenceDetails',
                js: 'OtherReferenceDetails',
                typ: u(undefined, ''),
            },
            { json: 'Pages', js: 'Pages', typ: u(undefined, '') },
            {
                json: 'PublicationDate',
                js: 'PublicationDate',
                typ: u(undefined, Date),
            },
            {
                json: 'PublicationPlace',
                js: 'PublicationPlace',
                typ: u(undefined, ''),
            },
            { json: 'Publisher', js: 'Publisher', typ: u(undefined, '') },
            { json: 'ReportNumber', js: 'ReportNumber', typ: u(undefined, '') },
            { json: 'Series', js: 'Series', typ: u(undefined, '') },
            { json: 'Title', js: 'Title', typ: u(undefined, '') },
            { json: 'Volume', js: 'Volume', typ: u(undefined, '') },
        ],
        false
    ),
    DoiDoiType: o(
        [
            { json: 'Authority', js: 'Authority', typ: u(undefined, '') },
            { json: 'DOI', js: 'DOI', typ: '' },
        ],
        false
    ),
    ScienceKeywordType: o(
        [
            { json: 'Category', js: 'Category', typ: '' },
            {
                json: 'DetailedVariable',
                js: 'DetailedVariable',
                typ: u(undefined, ''),
            },
            { json: 'Term', js: 'Term', typ: '' },
            { json: 'Topic', js: 'Topic', typ: '' },
            { json: 'VariableLevel1', js: 'VariableLevel1', typ: u(undefined, '') },
            { json: 'VariableLevel2', js: 'VariableLevel2', typ: u(undefined, '') },
            { json: 'VariableLevel3', js: 'VariableLevel3', typ: u(undefined, '') },
        ],
        false
    ),
    SpatialExtentType: o(
        [
            {
                json: 'GranuleSpatialRepresentation',
                js: 'GranuleSpatialRepresentation',
                typ: r('GranuleSpatialRepresentationEnum'),
            },
            {
                json: 'HorizontalSpatialDomain',
                js: 'HorizontalSpatialDomain',
                typ: u(undefined, r('HorizontalSpatialDomainType')),
            },
            {
                json: 'OrbitParameters',
                js: 'OrbitParameters',
                typ: u(undefined, r('OrbitParametersType')),
            },
            {
                json: 'SpatialCoverageType',
                js: 'SpatialCoverageType',
                typ: u(undefined, r('SpatialCoverageTypeEnum')),
            },
            {
                json: 'VerticalSpatialDomains',
                js: 'VerticalSpatialDomains',
                typ: u(undefined, a(r('VerticalSpatialDomainType'))),
            },
        ],
        false
    ),
    HorizontalSpatialDomainType: o(
        [
            { json: 'Geometry', js: 'Geometry', typ: r('GeometryType') },
            {
                json: 'ResolutionAndCoordinateSystem',
                js: 'ResolutionAndCoordinateSystem',
                typ: u(undefined, r('ResolutionAndCoordinateSystemType')),
            },
            { json: 'ZoneIdentifier', js: 'ZoneIdentifier', typ: u(undefined, '') },
        ],
        false
    ),
    GeometryType: o(
        [
            {
                json: 'BoundingRectangles',
                js: 'BoundingRectangles',
                typ: u(undefined, a(r('BoundingRectangleType'))),
            },
            {
                json: 'CoordinateSystem',
                js: 'CoordinateSystem',
                typ: r('CoordinateSystemEnum'),
            },
            {
                json: 'GPolygons',
                js: 'GPolygons',
                typ: u(undefined, a(r('GPolygonType'))),
            },
            { json: 'Lines', js: 'Lines', typ: u(undefined, a(r('LineType'))) },
            { json: 'Points', js: 'Points', typ: u(undefined, a(r('PointType'))) },
        ],
        false
    ),
    BoundingRectangleType: o(
        [
            {
                json: 'EastBoundingCoordinate',
                js: 'EastBoundingCoordinate',
                typ: 3.14,
            },
            {
                json: 'NorthBoundingCoordinate',
                js: 'NorthBoundingCoordinate',
                typ: 3.14,
            },
            {
                json: 'SouthBoundingCoordinate',
                js: 'SouthBoundingCoordinate',
                typ: 3.14,
            },
            {
                json: 'WestBoundingCoordinate',
                js: 'WestBoundingCoordinate',
                typ: 3.14,
            },
        ],
        false
    ),
    GPolygonType: o(
        [
            { json: 'Boundary', js: 'Boundary', typ: r('BoundaryType') },
            {
                json: 'ExclusiveZone',
                js: 'ExclusiveZone',
                typ: u(undefined, r('ExclusiveZoneType')),
            },
        ],
        false
    ),
    BoundaryType: o(
        [{ json: 'Points', js: 'Points', typ: a(r('PointType')) }],
        false
    ),
    PointType: o(
        [
            { json: 'Latitude', js: 'Latitude', typ: 3.14 },
            { json: 'Longitude', js: 'Longitude', typ: 3.14 },
        ],
        false
    ),
    ExclusiveZoneType: o(
        [{ json: 'Boundaries', js: 'Boundaries', typ: a(r('BoundaryType')) }],
        false
    ),
    LineType: o([{ json: 'Points', js: 'Points', typ: a(r('PointType')) }], false),
    ResolutionAndCoordinateSystemType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            {
                json: 'GeodeticModel',
                js: 'GeodeticModel',
                typ: u(undefined, r('GeodeticModelType')),
            },
            {
                json: 'HorizontalDataResolution',
                js: 'HorizontalDataResolution',
                typ: u(undefined, r('HorizontalDataResolutionType')),
            },
            {
                json: 'LocalCoordinateSystem',
                js: 'LocalCoordinateSystem',
                typ: u(undefined, r('LocalCoordinateSystemType')),
            },
        ],
        false
    ),
    GeodeticModelType: o(
        [
            {
                json: 'DenominatorOfFlatteningRatio',
                js: 'DenominatorOfFlatteningRatio',
                typ: u(undefined, 3.14),
            },
            { json: 'EllipsoidName', js: 'EllipsoidName', typ: u(undefined, '') },
            {
                json: 'HorizontalDatumName',
                js: 'HorizontalDatumName',
                typ: u(undefined, ''),
            },
            { json: 'SemiMajorAxis', js: 'SemiMajorAxis', typ: u(undefined, 3.14) },
        ],
        false
    ),
    HorizontalDataResolutionType: o(
        [
            {
                json: 'GenericResolutions',
                js: 'GenericResolutions',
                typ: u(undefined, a(r('HorizontalDataGenericResolutionType'))),
            },
            {
                json: 'GriddedRangeResolutions',
                js: 'GriddedRangeResolutions',
                typ: u(undefined, a(r('HorizontalDataResolutionGriddedRangeType'))),
            },
            {
                json: 'GriddedResolutions',
                js: 'GriddedResolutions',
                typ: u(undefined, a(r('HorizontalDataResolutionGriddedType'))),
            },
            {
                json: 'NonGriddedRangeResolutions',
                js: 'NonGriddedRangeResolutions',
                typ: u(
                    undefined,
                    a(r('HorizontalDataResolutionNonGriddedRangeType'))
                ),
            },
            {
                json: 'NonGriddedResolutions',
                js: 'NonGriddedResolutions',
                typ: u(undefined, a(r('HorizontalDataResolutionNonGriddedType'))),
            },
            {
                json: 'PointResolution',
                js: 'PointResolution',
                typ: u(undefined, r('HorizontalDataResolutionPointType')),
            },
            {
                json: 'VariesResolution',
                js: 'VariesResolution',
                typ: u(undefined, r('HorizontalDataResolutionVariesType')),
            },
        ],
        false
    ),
    HorizontalDataGenericResolutionType: o(
        [
            { json: 'Unit', js: 'Unit', typ: r('HorizontalDataResolutionUnitEnum') },
            { json: 'XDimension', js: 'XDimension', typ: u(undefined, 3.14) },
            { json: 'YDimension', js: 'YDimension', typ: u(undefined, 3.14) },
        ],
        false
    ),
    HorizontalDataResolutionGriddedRangeType: o(
        [
            {
                json: 'MaximumXDimension',
                js: 'MaximumXDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'MaximumYDimension',
                js: 'MaximumYDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'MinimumXDimension',
                js: 'MinimumXDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'MinimumYDimension',
                js: 'MinimumYDimension',
                typ: u(undefined, 3.14),
            },
            { json: 'Unit', js: 'Unit', typ: r('HorizontalDataResolutionUnitEnum') },
        ],
        false
    ),
    HorizontalDataResolutionGriddedType: o(
        [
            { json: 'Unit', js: 'Unit', typ: r('HorizontalDataResolutionUnitEnum') },
            { json: 'XDimension', js: 'XDimension', typ: u(undefined, 3.14) },
            { json: 'YDimension', js: 'YDimension', typ: u(undefined, 3.14) },
        ],
        false
    ),
    HorizontalDataResolutionNonGriddedRangeType: o(
        [
            {
                json: 'MaximumXDimension',
                js: 'MaximumXDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'MaximumYDimension',
                js: 'MaximumYDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'MinimumXDimension',
                js: 'MinimumXDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'MinimumYDimension',
                js: 'MinimumYDimension',
                typ: u(undefined, 3.14),
            },
            {
                json: 'ScanDirection',
                js: 'ScanDirection',
                typ: u(undefined, r('HorizontalResolutionScanDirectionType')),
            },
            { json: 'Unit', js: 'Unit', typ: r('HorizontalDataResolutionUnitEnum') },
            {
                json: 'ViewingAngleType',
                js: 'ViewingAngleType',
                typ: u(undefined, r('HorizontalResolutionViewingAngleType')),
            },
        ],
        false
    ),
    HorizontalDataResolutionNonGriddedType: o(
        [
            {
                json: 'ScanDirection',
                js: 'ScanDirection',
                typ: u(undefined, r('HorizontalResolutionScanDirectionType')),
            },
            { json: 'Unit', js: 'Unit', typ: r('HorizontalDataResolutionUnitEnum') },
            {
                json: 'ViewingAngleType',
                js: 'ViewingAngleType',
                typ: u(undefined, r('HorizontalResolutionViewingAngleType')),
            },
            { json: 'XDimension', js: 'XDimension', typ: u(undefined, 3.14) },
            { json: 'YDimension', js: 'YDimension', typ: u(undefined, 3.14) },
        ],
        false
    ),
    LocalCoordinateSystemType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            {
                json: 'GeoReferenceInformation',
                js: 'GeoReferenceInformation',
                typ: u(undefined, ''),
            },
        ],
        false
    ),
    OrbitParametersType: o(
        [
            { json: 'InclinationAngle', js: 'InclinationAngle', typ: 3.14 },
            {
                json: 'InclinationAngleUnit',
                js: 'InclinationAngleUnit',
                typ: r('EUnit'),
            },
            { json: 'NumberOfOrbits', js: 'NumberOfOrbits', typ: 3.14 },
            { json: 'OrbitPeriod', js: 'OrbitPeriod', typ: 3.14 },
            {
                json: 'OrbitPeriodUnit',
                js: 'OrbitPeriodUnit',
                typ: r('OrbitPeriodUnit'),
            },
            {
                json: 'StartCircularLatitude',
                js: 'StartCircularLatitude',
                typ: u(undefined, 3.14),
            },
            {
                json: 'StartCircularLatitudeUnit',
                js: 'StartCircularLatitudeUnit',
                typ: u(undefined, r('EUnit')),
            },
            { json: 'SwathWidth', js: 'SwathWidth', typ: u(undefined, 3.14) },
            {
                json: 'SwathWidthUnit',
                js: 'SwathWidthUnit',
                typ: u(undefined, r('FootprintUnit')),
            },
            {
                json: 'Footprints',
                js: 'Footprints',
                typ: u(undefined, a(r('FootprintType'))),
            },
        ],
        false
    ),
    FootprintType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            { json: 'Footprint', js: 'Footprint', typ: 3.14 },
            { json: 'FootprintUnit', js: 'FootprintUnit', typ: r('FootprintUnit') },
        ],
        false
    ),
    VerticalSpatialDomainType: o(
        [
            { json: 'Type', js: 'Type', typ: r('VerticalSpatialDomainTypeEnum') },
            { json: 'Value', js: 'Value', typ: '' },
        ],
        false
    ),
    SpatialInformationType: o(
        [
            { json: 'SpatialCoverageType', js: 'SpatialCoverageType', typ: '' },
            {
                json: 'VerticalCoordinateSystem',
                js: 'VerticalCoordinateSystem',
                typ: u(undefined, r('VerticalCoordinateSystemType')),
            },
        ],
        false
    ),
    VerticalCoordinateSystemType: o(
        [
            {
                json: 'AltitudeSystemDefinition',
                js: 'AltitudeSystemDefinition',
                typ: u(undefined, r('AltitudeSystemDefinitionType')),
            },
            {
                json: 'DepthSystemDefinition',
                js: 'DepthSystemDefinition',
                typ: u(undefined, r('DepthSystemDefinitionType')),
            },
        ],
        false
    ),
    AltitudeSystemDefinitionType: o(
        [
            { json: 'DatumName', js: 'DatumName', typ: u(undefined, '') },
            {
                json: 'DistanceUnits',
                js: 'DistanceUnits',
                typ: u(undefined, r('AltitudeDistanceUnitsEnum')),
            },
            { json: 'Resolutions', js: 'Resolutions', typ: u(undefined, a(3.14)) },
        ],
        false
    ),
    DepthSystemDefinitionType: o(
        [
            { json: 'DatumName', js: 'DatumName', typ: u(undefined, '') },
            {
                json: 'DistanceUnits',
                js: 'DistanceUnits',
                typ: u(undefined, r('DepthDistanceUnitsEnum')),
            },
            { json: 'Resolutions', js: 'Resolutions', typ: u(undefined, a(3.14)) },
        ],
        false
    ),
    TemporalExtentType: o(
        [
            {
                json: 'EndsAtPresentFlag',
                js: 'EndsAtPresentFlag',
                typ: u(undefined, true),
            },
            {
                json: 'PeriodicDateTimes',
                js: 'PeriodicDateTimes',
                typ: u(undefined, a(r('PeriodicDateTimeType'))),
            },
            {
                json: 'PrecisionOfSeconds',
                js: 'PrecisionOfSeconds',
                typ: u(undefined, 0),
            },
            {
                json: 'RangeDateTimes',
                js: 'RangeDateTimes',
                typ: u(undefined, a(r('RangeDateTimeType'))),
            },
            {
                json: 'SingleDateTimes',
                js: 'SingleDateTimes',
                typ: u(undefined, a(Date)),
            },
            {
                json: 'TemporalResolution',
                js: 'TemporalResolution',
                typ: u(undefined, r('TemporalResolutionType')),
            },
        ],
        false
    ),
    PeriodicDateTimeType: o(
        [
            { json: 'DurationUnit', js: 'DurationUnit', typ: r('DurationUnitEnum') },
            { json: 'DurationValue', js: 'DurationValue', typ: 0 },
            { json: 'EndDate', js: 'EndDate', typ: Date },
            { json: 'Name', js: 'Name', typ: '' },
            {
                json: 'PeriodCycleDurationUnit',
                js: 'PeriodCycleDurationUnit',
                typ: r('DurationUnitEnum'),
            },
            {
                json: 'PeriodCycleDurationValue',
                js: 'PeriodCycleDurationValue',
                typ: 0,
            },
            { json: 'StartDate', js: 'StartDate', typ: Date },
        ],
        false
    ),
    RangeDateTimeType: o(
        [
            { json: 'BeginningDateTime', js: 'BeginningDateTime', typ: Date },
            { json: 'EndingDateTime', js: 'EndingDateTime', typ: u(undefined, Date) },
        ],
        false
    ),
    TemporalResolutionType: o(
        [
            { json: 'Unit', js: 'Unit', typ: r('TemporalResolutionTypeUnit') },
            { json: 'Value', js: 'Value', typ: u(undefined, 3.14) },
        ],
        false
    ),
    TilingIdentificationSystemType: o(
        [
            {
                json: 'Coordinate1',
                js: 'Coordinate1',
                typ: r('TilingCoordinateType'),
            },
            {
                json: 'Coordinate2',
                js: 'Coordinate2',
                typ: r('TilingCoordinateType'),
            },
            {
                json: 'TilingIdentificationSystemName',
                js: 'TilingIdentificationSystemName',
                typ: r('TilingIdentificationSystemName'),
            },
        ],
        false
    ),
    TilingCoordinateType: o(
        [
            {
                json: 'MaximumValue',
                js: 'MaximumValue',
                typ: u(undefined, u(3.14, '')),
            },
            {
                json: 'MinimumValue',
                js: 'MinimumValue',
                typ: u(undefined, u(3.14, '')),
            },
        ],
        false
    ),
    UseConstraintsType: o(
        [
            { json: 'Description', js: 'Description', typ: u(undefined, '') },
            {
                json: 'EULAIdentifiers',
                js: 'EULAIdentifiers',
                typ: u(undefined, a('')),
            },
            {
                json: 'FreeAndOpenData',
                js: 'FreeAndOpenData',
                typ: u(undefined, true),
            },
            {
                json: 'LicenseURL',
                js: 'LicenseURL',
                typ: u(undefined, r('OnlineResourceType')),
            },
            { json: 'LicenseText', js: 'LicenseText', typ: u(undefined, '') },
        ],
        false
    ),
    DataTypeEnum: [
        'BOOLEAN',
        'DATE',
        'DATE_STRING',
        'DATETIME',
        'DATETIME_STRING',
        'FLOAT',
        'INT',
        'STRING',
        'TIME',
        'TIME_STRING',
    ],
    ArchiveDistributionUnitEnum: ['GB', 'KB', 'MB', 'NA', 'PB', 'TB'],
    ArchiveDistributionFormatTypeEnum: ['Native', 'Supported'],
    AssociatedDoiTypeType: [
        'Child Dataset',
        'Collaborative/Other Agency',
        'Field Campaign',
        'Other',
        'Parent Dataset',
        'Related Dataset',
    ],
    CollectionDataTypeEnum: [
        'EXPEDITED',
        'LOW_LATENCY',
        'NEAR_REAL_TIME',
        'OTHER',
        'SCIENCE_QUALITY',
    ],
    CollectionProgressEnum: [
        'ACTIVE',
        'COMPLETE',
        'DEPRECATED',
        'NOT APPLICABLE',
        'NOT PROVIDED',
        'PLANNED',
    ],
    ContactMechanismTypeEnum: [
        'Direct Line',
        'Email',
        'Facebook',
        'Fax',
        'Mobile',
        'Modem',
        'Other',
        'Primary',
        'TDD/TTY Phone',
        'Telephone',
        'Twitter',
        'U.S. toll free',
    ],
    GetDataUnit: ['GB', 'KB', 'MB', 'PB', 'TB'],
    GetServiceTypeFormatEnum: [
        'ascii',
        'binary',
        'BUFR',
        'geotiff',
        'GRIB',
        'HDF4',
        'HDF5',
        'HDF-EOS4',
        'HDF-EOS5',
        'jpeg',
        'kml',
        'Not provided',
        'png',
        'tiff',
    ],
    URLMIMETypeEnum: [
        'application/gml+xml',
        'application/json',
        'application/octet-stream',
        'application/opensearchdescription+xml',
        'application/pdf',
        'application/vnd.google-earth.kml+xml',
        'application/vnd.google-earth.kmz',
        'application/x-hdf',
        'application/xml',
        'application/x-netcdf',
        'application/x-vnd.iso.19139-2+xml',
        'application/xhdf5',
        'image/bmp',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'image/vnd.collada+xml',
        'Not provided',
        'text/csv',
        'text/html',
        'text/plain',
        'text/xml',
    ],
    Protocol: ['FTP', 'FTPS', 'HTTP', 'HTTPS', 'Not provided'],
    DataContactRoleEnum: [
        'Data Center Contact',
        'Investigator',
        'Metadata Author',
        'Science Contact',
        'Science Software Development',
        'Technical Contact',
        'User Services',
    ],
    MissingReason: ['Not Applicable', 'Unknown'],
    DataCenterRoleEnum: ['ARCHIVER', 'DISTRIBUTOR', 'ORIGINATOR', 'PROCESSOR'],
    LineageDateEnum: ['CREATE', 'DELETE', 'REVIEW', 'UPDATE'],
    DataMaturity: [
        'Beta',
        'Provisional',
        'Stage 1 Validation',
        'Stage 2 Validation',
        'Stage 3 Validation',
        'Stage 4 Validation',
        'Validated',
    ],
    DirectDistributionInformationRegionEnum: [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
    ],
    MetadataAssociateTypeEnum: [
        'CHILD',
        'DEPENDENT',
        'INPUT',
        'LARGER CITATION WORKS',
        'PARENT',
        'RELATED',
        'SCIENCE ASSOCIATED',
    ],
    Name: ['UMM-C'],
    URL: ['https://cdn.earthdata.nasa.gov/umm/collection/v1.18.1'],
    Version: ['1.18.1'],
    OtherIdentifierTypeType: ['ArchiveSetsNumber', 'Other'],
    GranuleSpatialRepresentationEnum: [
        'CARTESIAN',
        'GEODETIC',
        'NO_SPATIAL',
        'ORBIT',
    ],
    CoordinateSystemEnum: ['CARTESIAN', 'GEODETIC'],
    HorizontalDataResolutionUnitEnum: [
        'Decimal Degrees',
        'Kilometers',
        'Meters',
        'Nautical Miles',
        'Not provided',
        'Statute Miles',
    ],
    HorizontalResolutionScanDirectionType: ['Along Track', 'Cross Track'],
    HorizontalResolutionViewingAngleType: ['At Nadir', 'Scan Extremes'],
    HorizontalDataResolutionPointType: ['Point'],
    HorizontalDataResolutionVariesType: ['Varies'],
    FootprintUnit: ['Kilometer', 'Meter'],
    EUnit: ['Degree'],
    OrbitPeriodUnit: ['Decimal Minute'],
    SpatialCoverageTypeEnum: [
        'EARTH/GLOBAL',
        'HORIZONTAL',
        'HORIZONTAL_ORBITAL',
        'HORIZONTAL_VERTICAL',
        'HORIZONTAL_VERTICAL_ORBITAL',
        'LUNAR',
        'ORBITAL',
        'ORBITAL_VERTICAL',
        'VERTICAL',
    ],
    VerticalSpatialDomainTypeEnum: [
        'Atmosphere Layer',
        'Maximum Altitude',
        'Maximum Depth',
        'Minimum Altitude',
        'Minimum Depth',
    ],
    AltitudeDistanceUnitsEnum: ['HectoPascals', 'Kilometers', 'Millibars'],
    DepthDistanceUnitsEnum: [
        'Fathoms',
        'Feet',
        'HectoPascals',
        'Meters',
        'Millibars',
    ],
    DurationUnitEnum: ['DAY', 'MONTH', 'YEAR'],
    TemporalResolutionTypeUnit: [
        'Constant',
        'Day',
        'Diurnal',
        'Hour',
        'Minute',
        'Month',
        'Second',
        'Varies',
        'Week',
        'Year',
    ],
    TilingIdentificationSystemName: [
        'CALIPSO',
        'MODIS Tile EASE',
        'MODIS Tile SIN',
        'Military Grid Reference System',
        'MISR',
        'WELD Alaska Tile',
        'WELD CONUS Tile',
        'WRS-1',
        'WRS-2',
    ],
}
