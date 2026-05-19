// generated dynamically using Quicktype from UMM v1.6.7
// https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/browse/granule/v1.6.7
export interface UmmG {
    AccessConstraints?: AccessConstraintsType
    AdditionalAttributes?: AdditionalAttributeType[]
    CloudCover?: number
    CollectionReference: CollectionReferenceType
    DataGranule?: DataGranuleType
    GranuleUR: string
    GridMappingNames?: string[]
    InputGranules?: string[]
    MeasuredParameters?: MeasuredParameterType[]
    MetadataSpecification: MetadataSpecificationType
    NativeProjectionNames?: ProjectionNameType[]
    OrbitCalculatedSpatialDomains?: OrbitCalculatedSpatialDomainType[]
    PGEVersionClass?: PGEVersionClassType
    Platforms?: PlatformType[]
    Projects?: ProjectType[]
    ProviderDates: ProviderDateType[]
    RelatedUrls?: RelatedURLType[]
    SpatialExtent?: SpatialExtentType
    TemporalExtent?: TemporalExtentType
    TilingIdentificationSystem?: TilingIdentificationSystemType
}

export interface AccessConstraintsType {
    Description?: string
    Value: number
}

export interface AdditionalAttributeType {
    Name: string
    Values: string[]
}

export interface CollectionReferenceType {
    ShortName?: string
    Version?: string
    EntryTitle?: string
}

export interface DataGranuleType {
    ArchiveAndDistributionInformation?: ArchiveAndDistributionInformationType[]
    DayNightFlag: DayNightFlag
    Identifiers?: IdentifierType[]
    ProductionDateTime: Date
    ReprocessingActual?: string
    ReprocessingPlanned?: string
}

export interface ArchiveAndDistributionInformationType {
    Checksum?: ChecksumType
    Files?: FileType[]
    Format?: string
    MimeType?: MIMETypeEnum
    Name: string
    Size?: number
    SizeInBytes?: number
    SizeUnit?: FileSizeUnitEnum
    FormatType?: FormatType
}

export interface ChecksumType {
    Algorithm: Algorithm
    Value: string
}

export enum Algorithm {
    Adler32 = 'Adler-32',
    BSDChecksum = 'BSD checksum',
    Fletcher32 = 'Fletcher-32',
    Fletcher64 = 'Fletcher-64',
    Md5 = 'MD5',
    POSIX = 'POSIX',
    SHA1 = 'SHA-1',
    SHA2 = 'SHA-2',
    SHA256 = 'SHA-256',
    SHA384 = 'SHA-384',
    SHA512 = 'SHA-512',
    Sm3 = 'SM3',
    Sysv = 'SYSV',
}

export interface FileType {
    Checksum?: ChecksumType
    Format?: string
    FormatType?: FormatType
    MimeType?: MIMETypeEnum
    Name: string
    Size?: number
    SizeInBytes?: number
    SizeUnit?: FileSizeUnitEnum
}

export enum FormatType {
    Na = 'NA',
    Native = 'Native',
    Supported = 'Supported',
}

export enum MIMETypeEnum {
    ApplicationGMLXML = 'application/gml+xml',
    ApplicationGzip = 'application/gzip',
    ApplicationJSON = 'application/json',
    ApplicationOctetStream = 'application/octet-stream',
    ApplicationPDF = 'application/pdf',
    ApplicationTar = 'application/tar',
    ApplicationTarGzip = 'application/tar+gzip',
    ApplicationTarZip = 'application/tar+zip',
    ApplicationVndGoogleEarthKmlXML = 'application/vnd.google-earth.kml+xml',
    ApplicationVndGoogleEarthKmz = 'application/vnd.google-earth.kmz',
    ApplicationVndOpendapDap4DmrppXML = 'application/vnd.opendap.dap4.dmrpp+xml',
    ApplicationXHdf = 'application/x-hdf',
    ApplicationXHdf5 = 'application/x-hdf5',
    ApplicationXHdfeos = 'application/x-hdfeos',
    ApplicationXML = 'application/xml',
    ApplicationXNetcdf = 'application/x-netcdf',
    ApplicationZip = 'application/zip',
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

export enum FileSizeUnitEnum {
    GB = 'GB',
    KB = 'KB',
    MB = 'MB',
    Na = 'NA',
    Pb = 'PB',
    TB = 'TB',
}

export enum DayNightFlag {
    Both = 'Both',
    Day = 'Day',
    Night = 'Night',
    Unspecified = 'Unspecified',
}

export interface IdentifierType {
    Identifier: string
    IdentifierName?: string
    IdentifierType: IdentifierTypeEnum
}

export enum IdentifierTypeEnum {
    Crid = 'CRID',
    FeatureID = 'FeatureId',
    LocalVersionID = 'LocalVersionId',
    Other = 'Other',
    ProducerGranuleID = 'ProducerGranuleId',
}

export interface MeasuredParameterType {
    ParameterName: string
    QAFlags?: QAFlagsType
    QAStats?: QAStatsType
}

export interface QAFlagsType {
    AutomaticQualityFlag?: AutomaticQualityFlag
    AutomaticQualityFlagExplanation?: string
    OperationalQualityFlag?: OperationalQualityFlag
    OperationalQualityFlagExplanation?: string
    ScienceQualityFlag?: ScienceQualityFlag
    ScienceQualityFlagExplanation?: string
}

export enum AutomaticQualityFlag {
    Failed = 'Failed',
    Passed = 'Passed',
    Suspect = 'Suspect',
    Undetermined = 'Undetermined',
}

export enum OperationalQualityFlag {
    BeingInvestigated = 'Being Investigated',
    Failed = 'Failed',
    InferredFailed = 'Inferred Failed',
    InferredPassed = 'Inferred Passed',
    NotInvestigated = 'Not Investigated',
    Passed = 'Passed',
    Suspect = 'Suspect',
    Undetermined = 'Undetermined',
}

export enum ScienceQualityFlag {
    BeingInvestigated = 'Being Investigated',
    Failed = 'Failed',
    Hold = 'Hold',
    InferredFailed = 'Inferred Failed',
    InferredPassed = 'Inferred Passed',
    NotInvestigated = 'Not Investigated',
    Passed = 'Passed',
    Suspect = 'Suspect',
    Undetermined = 'Undetermined',
}

export interface QAStatsType {
    QAPercentCloudCover?: number
    QAPercentInterpolatedData?: number
    QAPercentMissingData?: number
    QAPercentOutOfBoundsData?: number
}

export interface MetadataSpecificationType {
    Name: 'UMM-G'
    URL: 'https://cdn.earthdata.nasa.gov/umm/granule/v1.6.6'
    Version: '1.6.6'
}

export enum ProjectionNameType {
    AlbersEqualAreaConic = 'Albers Equal Area Conic',
    CanadianAlbersEqualAreaConic = 'Canadian Albers Equal Area Conic',
    Cylindrical = 'Cylindrical',
    EASEGrid20NPolar = 'EASE Grid 2.0 N. Polar',
    Geographic = 'Geographic',
    LambertAzimuthalEqualArea = 'Lambert Azimuthal Equal Area',
    LambertConformalConic = 'Lambert Conformal Conic',
    LambertEqualArea = 'Lambert Equal Area',
    MODISSinusoidalSystem = 'MODIS Sinusoidal System',
    Mercator = 'Mercator',
    MilitaryGridReference = 'Military Grid Reference',
    NAD83UTMZone17N = 'NAD83 / UTM zone 17N',
    NSIDCEASEGridGlobal = 'NSIDC EASE Grid Global',
    NSIDCEASEGridNorthAndSouthLambertEA = 'NSIDC EASE Grid North and South (Lambert EA)',
    PlateCarree = 'Plate Carree',
    PolarStereographic = 'Polar Stereographic',
    Sinusoidal = 'Sinusoidal',
    SpaceObliqueMercator = 'Space Oblique Mercator',
    SphericalMercator = 'Spherical Mercator',
    StatePlaneCoordinates = 'State Plane Coordinates',
    TransverseMercator = 'Transverse Mercator',
    UTMNorthernHemisphere = 'UTM Northern Hemisphere',
    UTMSouthernHemisphere = 'UTM Southern Hemisphere',
    UniversalTransverseMercator = 'Universal Transverse Mercator',
    WELDAlbersEqualArea = 'WELD Albers Equal Area',
}

export interface OrbitCalculatedSpatialDomainType {
    BeginOrbitNumber?: number
    EndOrbitNumber?: number
    EquatorCrossingDateTime?: Date
    EquatorCrossingLongitude?: number
    OrbitalModelName?: string
    OrbitNumber?: number
}

export interface PGEVersionClassType {
    PGEName?: string
    PGEVersion: string
}

export interface PlatformType {
    Instruments?: InstrumentType[]
    ShortName: string
}

export interface InstrumentType {
    Characteristics?: CharacteristicType[]
    ComposedOf?: InstrumentType[]
    OperationalModes?: string[]
    ShortName: string
}

export interface CharacteristicType {
    Name: string
    Value: string
}

export interface ProjectType {
    Campaigns?: string[]
    ShortName: string
}

export interface ProviderDateType {
    Date: Date
    Type: ProviderDateTypeEnum
}

export enum ProviderDateTypeEnum {
    Create = 'Create',
    Delete = 'Delete',
    Insert = 'Insert',
    Update = 'Update',
}

export interface RelatedURLType {
    Description?: string
    Format?: string
    MimeType?: MIMETypeEnum
    Size?: number
    SizeUnit?: FileSizeUnitEnum
    Subtype?: RelatedURLSubTypeEnum
    Type: RelatedURLTypeEnum
    URL: string
}

export enum RelatedURLSubTypeEnum {
    AlgorithmDocumentation = 'ALGORITHM DOCUMENTATION',
    AlgorithmTheoreticalBasisDocumentAtbd = 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)',
    Anomalies = 'ANOMALIES',
    Appears = 'APPEARS',
    BrowseImageSource = 'BROWSE IMAGE SOURCE',
    CaseStudy = 'CASE STUDY',
    DMR = 'DMR++',
    DMRMissingData = 'DMR++ MISSING DATA',
    DataCitationPolicy = 'DATA CITATION POLICY',
    DataCollectionBundle = 'DATA COLLECTION BUNDLE',
    DataQuality = 'DATA QUALITY',
    DataRecipe = 'DATA RECIPE',
    DataTree = 'DATA TREE',
    DatacastURL = 'DATACAST URL',
    DeliverablesChecklist = 'DELIVERABLES CHECKLIST',
    DirectDownload = 'DIRECT DOWNLOAD',
    EarthdataSearch = 'Earthdata Search',
    EosdisDataPool = 'EOSDIS DATA POOL',
    GeneralDocumentation = 'GENERAL DOCUMENTATION',
    Giovanni = 'GIOVANNI',
    GoLIVEPortal = 'GoLIVE Portal',
    GradsDataServerGds = 'GRADS DATA SERVER (GDS)',
    HowTo = 'HOW-TO',
    IceBridgePortal = 'IceBridge Portal',
    ImportantNotice = 'IMPORTANT NOTICE',
    InstrumentSensorCalibrationDocumentation = 'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION',
    Laads = 'LAADS',
    Lance = 'LANCE',
    LiveAccessServerLas = 'LIVE ACCESS SERVER (LAS)',
    Map = 'MAP',
    MapService = 'MAP SERVICE',
    MapViewer = 'MAP VIEWER',
    MicroArticle = 'MICRO ARTICLE',
    Mirador = 'MIRADOR',
    MobileApp = 'MOBILE APP',
    Modaps = 'MODAPS',
    NoaaClass = 'NOAA CLASS',
    Nomads = 'NOMADS',
    OpenSearch = 'OpenSearch',
    OpendapData = 'OPENDAP DATA',
    Order = 'Order',
    PiDocumentation = 'PI DOCUMENTATION',
    Portal = 'PORTAL',
    ProcessingHistory = 'PROCESSING HISTORY',
    ProductHistory = 'PRODUCT HISTORY',
    ProductQualityAssessment = 'PRODUCT QUALITY ASSESSMENT',
    ProductUsage = 'PRODUCT USAGE',
    ProductionHistory = 'PRODUCTION HISTORY',
    Publications = 'PUBLICATIONS',
    ReadMe = 'READ-ME',
    RequirementsAndDesign = 'REQUIREMENTS AND DESIGN',
    ScienceDataProductSoftwareDocumentation = 'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION',
    ScienceDataProductValidation = 'SCIENCE DATA PRODUCT VALIDATION',
    ServiceChaining = 'SERVICE CHAINING',
    SimpleSubsetWizardSsw = 'SIMPLE SUBSET WIZARD (SSW)',
    Subscribe = 'Subscribe',
    Subsetter = 'SUBSETTER',
    TabularDataStreamTds = 'TABULAR DATA STREAM (TDS)',
    ThreddsData = 'THREDDS DATA',
    UserFeedbackPage = 'USER FEEDBACK PAGE',
    UserSGuide = "USER'S GUIDE",
    UsgsEarthExplorer = 'USGS EARTH EXPLORER',
    Vertex = 'VERTEX',
    VirtualCollection = 'VIRTUAL COLLECTION',
    WebCoverageServiceWcs = 'WEB COVERAGE SERVICE (WCS)',
    WebFeatureServiceWfs = 'WEB FEATURE SERVICE (WFS)',
    WebMapServiceWms = 'WEB MAP SERVICE (WMS)',
    WebMapTileServiceWmts = 'WEB MAP TILE SERVICE (WMTS)',
    Worldview = 'WORLDVIEW',
}

export enum RelatedURLTypeEnum {
    DownloadSoftware = 'DOWNLOAD SOFTWARE',
    ExtendedMetadata = 'EXTENDED METADATA',
    GetData = 'GET DATA',
    GetDataViaDirectAccess = 'GET DATA VIA DIRECT ACCESS',
    GetRelatedVisualization = 'GET RELATED VISUALIZATION',
    GotoWebTool = 'GOTO WEB TOOL',
    ProjectHomePage = 'PROJECT HOME PAGE',
    UseServiceAPI = 'USE SERVICE API',
    ViewRelatedInformation = 'VIEW RELATED INFORMATION',
}

export interface SpatialExtentType {
    GranuleLocalities?: string[]
    HorizontalSpatialDomain?: HorizontalSpatialDomainType
    VerticalSpatialDomains?: VerticalSpatialDomainType[]
}

export interface HorizontalSpatialDomainType {
    Geometry?: GeometryType
    Orbit?: OrbitType
    Track?: TrackType
    ZoneIdentifier?: string
}

export interface GeometryType {
    BoundingRectangles?: BoundingRectangleType[]
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

export interface OrbitType {
    AscendingCrossing: number
    EndDirection: OrbitDirectionTypeEnum
    EndLatitude: number
    StartDirection: OrbitDirectionTypeEnum
    StartLatitude: number
}

export enum OrbitDirectionTypeEnum {
    A = 'A',
    D = 'D',
}

export interface TrackType {
    Cycle: number
    Passes?: TrackPassTileType[]
}

export interface TrackPassTileType {
    Pass: number
    Tiles?: string[]
}

export interface VerticalSpatialDomainType {
    MaximumValue?: string
    MinimumValue?: string
    Type: VerticalSpatialDomainTypeEnum
    Unit?: Unit
    Value?: string
}

export enum VerticalSpatialDomainTypeEnum {
    Altitude = 'Altitude',
    AtmosphereLayer = 'Atmosphere Layer',
    Depth = 'Depth',
    Pressure = 'Pressure',
}

export enum Unit {
    Atmosphere = 'Atmosphere',
    Fathoms = 'Fathoms',
    Feet = 'Feet',
    HectoPascals = 'HectoPascals',
    InchesOfMercury = 'InchesOfMercury',
    InchesOfWater = 'InchesOfWater',
    Kilometers = 'Kilometers',
    Meters = 'Meters',
    Millibars = 'Millibars',
    PoundsPerSquareInch = 'PoundsPerSquareInch',
}

export interface TemporalExtentType {
    RangeDateTime?: RangeDateTimeType
    SingleDateTime?: Date
}

export interface RangeDateTimeType {
    BeginningDateTime: Date
    EndingDateTime?: Date
}

export interface TilingIdentificationSystemType {
    Coordinate1: TilingCoordinateType
    Coordinate2: TilingCoordinateType
    TilingIdentificationSystemName: TilingIdentificationSystemNameEnum
}

export interface TilingCoordinateType {
    MaximumValue?: number
    MinimumValue: number
}

export enum TilingIdentificationSystemNameEnum {
    Calipso = 'CALIPSO',
    MODISTileEASE = 'MODIS Tile EASE',
    MODISTileSIN = 'MODIS Tile SIN',
    Misr = 'MISR',
    SMAPTileEASE = 'SMAP Tile EASE',
    WELDAlaskaTile = 'WELD Alaska Tile',
    WELDCONUSTile = 'WELD CONUS Tile',
    Wrs1 = 'WRS-1',
    Wrs2 = 'WRS-2',
}
