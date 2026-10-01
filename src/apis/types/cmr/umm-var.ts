// generated dynamically using Quicktype from UMM v1.9.0
// https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/browse/variable/v1.9.0/
export interface UmmVar {
    /**
     * Any additional identifiers of a variable.
     */
    AdditionalIdentifiers?: AdditionalIdentifierType[]
    /**
     * Specify data type of a variable. These types can be either: uint8, uint16, etc.
     */
    DataType?: DataTypeEnum
    /**
     * The definition of the variable.
     */
    Definition: string
    /**
     * A variable consists of one or more dimensions. An example of a dimension name is 'XDim'.
     * An example of a dimension size is '1200'. Variables are rarely one dimensional.
     */
    Dimensions?: DimensionType[]
    /**
     * The fill value of the variable in the data file. It is generally a value which falls
     * outside the valid range. For example, if the valid range is '0, 360', the fill value may
     * be '-1'. The fill value type is data provider-defined. For example, 'Out of Valid Range'.
     */
    FillValues?: FillValueType[]
    /**
     * This element describes the x and y dimension ranges for this variable. Typically these
     * values are 2 latitude and longitude ranges, but they don't necessarily have to be.
     */
    IndexRanges?: IndexRangesType
    /**
     * Describes a store (zarr) where a variable has been separated from its original data files
     * and saved as its own entity.
     */
    InstanceInformation?: InstanceInformationType
    /**
     * The expanded or long name related to the variable Name.
     */
    LongName: string
    /**
     * The measurement information of a variable.
     */
    MeasurementIdentifiers?: MeasurementIdentifierType[]
    /**
     * Requires the client, or user, to add in schema information into every variable record. It
     * includes the schema's name, version, and URL location. The information is controlled
     * through enumerations at the end of this schema.
     */
    MetadataSpecification: MetadataSpecificationType
    /**
     * The name of a variable.
     */
    Name: string
    /**
     * The offset is the value which is either added to or subtracted from all values in the
     * stored data field in order to obtain the original values. May be used together with
     * Scale. An example of an offset is '0.49'.
     */
    Offset?: number
    /**
     * A described URL associated with the a web resource, or interface. e.g., the home page for
     * the variable provider.
     */
    RelatedURLs?: RelatedURLType[]
    /**
     * The sampling information of a variable.
     */
    SamplingIdentifiers?: SamplingIdentifierType[]
    /**
     * The scale is the numerical factor by which all values in the stored data field are
     * multiplied in order to obtain the original values. May be used together with Offset. An
     * example of a scale factor is '0.002'
     */
    Scale?: number
    /**
     * Controlled Science Keywords describing the measurements/variables. The controlled
     * vocabulary for Science Keywords is maintained in the Keyword Management System (KMS). The
     * valid values can be found at the KMS website:
     * https://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords?format=csv.
     */
    ScienceKeywords?: ScienceKeywordType[]
    /**
     * The set information of a variable. The variable is grouped within a set. The set is
     * defined by the name, type, size and index. For example, Name: 'Data_Fields', Type:
     * 'General', Size: '15', Index: '7' for the case of the variable named 'LST_Day_1km'.
     */
    Sets?: SetType[]
    /**
     * This is the more formal or scientific name, .e.g., the CF Standard Name.
     */
    StandardName?: string
    /**
     * The units associated with a variable.
     */
    Units?: string
    /**
     * Valid ranges of variable data values.
     */
    ValidRanges?: ValidRangeType[]
    /**
     * Specifies the sub type of a variable.
     */
    VariableSubType?: VariableSubTypeEnum
    /**
     * Specify basic type of a variable.
     */
    VariableType?: VariableTypeEnum
}

/**
 * The elements of this section apply to an additional identifier.
 */
export interface AdditionalIdentifierType {
    /**
     * This element describes to a person or machine what the identifier is called. e.g., if the
     * identifier is 1057.2345/asfb then the Description should be DOI or Digital Object
     * Identifier.
     */
    Description?: string
    /**
     * The actual identifier.
     */
    Identifier: string
}

/**
 * Specify data type of a variable. These types can be either: uint8, uint16, etc.
 *
 * This element is used to identify the data type of the variable.
 */
export enum DataTypeEnum {
    Byte = 'byte',
    Char8 = 'char8',
    Double = 'double',
    Float = 'float',
    Float32 = 'float32',
    Float64 = 'float64',
    Int = 'int',
    Int16 = 'int16',
    Int32 = 'int32',
    Int64 = 'int64',
    Int8 = 'int8',
    Long = 'long',
    Other = 'OTHER',
    Short = 'short',
    String = 'string',
    Ubyte = 'ubyte',
    Uchar = 'uchar',
    Uchar8 = 'uchar8',
    Uint = 'uint',
    Uint16 = 'uint16',
    Uint32 = 'uint32',
    Uint64 = 'uint64',
    Uint8 = 'uint8',
    Ushort = 'ushort',
}

/**
 * A variable consists of one or more dimensions. An example of a dimension name is 'XDim'.
 * An example of a dimension size is '1200'. Variables are rarely one dimensional.
 */
export interface DimensionType {
    /**
     * The name of the dimension of the variable represented in the data field. For example,
     * 'XDim.
     */
    Name: string
    Size: number | 'Varies'
    /**
     * The type of the dimension of the variable represented in the data field. For example, if
     * the dimension has a special meaning, i.e., a latitude, longitude, pressure, height (or
     * depth) or time, then the type should be set to either 'LATITUDE_DIMENSION',
     * 'LONGITUDE_DIMENSION', 'PRESSURE_DIMENSION', 'HEIGHT_DIMENSION', 'DEPTH_DIMENSION' or
     * 'TIME_DIMENSION', otherwise it should be set to 'OTHER'.
     */
    Type: DimensionTypeEnum
}

/**
 * A value to designate that the dimension size of a variable in each granule is not
 * uniform, but that it varies across granules.
 */

/**
 * The type of the dimension of the variable represented in the data field. For example, if
 * the dimension has a special meaning, i.e., a latitude, longitude, pressure, height (or
 * depth) or time, then the type should be set to either 'LATITUDE_DIMENSION',
 * 'LONGITUDE_DIMENSION', 'PRESSURE_DIMENSION', 'HEIGHT_DIMENSION', 'DEPTH_DIMENSION' or
 * 'TIME_DIMENSION', otherwise it should be set to 'OTHER'.
 */
export enum DimensionTypeEnum {
    AlongTrackDimension = 'ALONG_TRACK_DIMENSION',
    CrossTrackDimension = 'CROSS_TRACK_DIMENSION',
    DepthDimension = 'DEPTH_DIMENSION',
    HeightDimension = 'HEIGHT_DIMENSION',
    LatitudeDimension = 'LATITUDE_DIMENSION',
    LongitudeDimension = 'LONGITUDE_DIMENSION',
    Other = 'OTHER',
    PressureDimension = 'PRESSURE_DIMENSION',
    TimeDimension = 'TIME_DIMENSION',
}

/**
 * The fill value, fill value type and fill value description of the variable in the data
 * file. The fill value is generally a value which falls outside the valid range. For
 * example, if the valid range is '0, 360', the fill value may be '-1'. The elements of this
 * section apply to the fill value of a variable.
 */
export interface FillValueType {
    /**
     * Description of the fill value of the variable in the data file.
     */
    Description?: string
    /**
     * Type of the fill value of the variable in the data file.
     */
    Type: FillValueTypeEnum
    /**
     * The fill value of the variable in the data file.
     */
    Value: number
}

/**
 * Type of the fill value of the variable in the data file.
 */
export enum FillValueTypeEnum {
    AncillaryFillvalue = 'ANCILLARY_FILLVALUE',
    Other = 'OTHER',
    QualityFillvalue = 'QUALITY_FILLVALUE',
    ScienceFillvalue = 'SCIENCE_FILLVALUE',
}

/**
 * This element describes the x and y dimension ranges for this variable. Typically these
 * values are 2 latitude and longitude ranges, but they don't necessarily have to be.
 *
 * The index ranges consist of a LatRange and a LonRange.
 */
export interface IndexRangesType {
    /**
     * The LatRange consists of an index range for latitude.
     */
    LatRange: number[]
    /**
     * The LonRange consists of an index range for longitude.
     */
    LonRange: number[]
}

/**
 * Describes a store (zarr) where a variable has been separated from its original data files
 * and saved as its own entity.
 *
 * This object describes a store for a variable instance. A variable instance is when the
 * variable is extracted from the original data files and stored somewhere.
 */
export interface InstanceInformationType {
    /**
     * Description of the chunking strategy for the store. Chunking information such as the
     * chunk sizes should be documented.
     */
    ChunkingInformation?: string
    /**
     * Brief description of the store or any other useful information about the store.
     */
    Description?: string
    /**
     * This element allows end users to get direct access to data products that are stored in
     * the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end
     * point and a documentation URL as well as bucket prefix names and an AWS region.
     */
    DirectDistributionInformation?: DirectDistributionInformationType
    /**
     * Describes the format of the URL's data content so that users and applications know how to
     * read and use the content. At this point in time, an industry standard mime-type does not
     * exist, so a mime-type element will not be included. The controlled vocabulary for formats
     * is maintained in the Keyword Management System (KMS):
     * https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/DataFormat
     */
    Format: string
    /**
     * The internet location of the variable instance store.
     */
    URL: string
}

/**
 * This element allows end users to get direct access to data products that are stored in
 * the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end
 * point and a documentation URL as well as bucket prefix names and an AWS region.
 */
export interface DirectDistributionInformationType {
    /**
     * Defines the possible values for the Amazon Web Service US Regions where the data product
     * resides.
     */
    Region: DirectDistributionInformationRegionEnum
    /**
     * Defines the possible values for the Amazon Web Service US S3 bucket and/or object prefix
     * names.
     */
    S3BucketAndObjectPrefixNames?: string[]
    /**
     * Defines the URL where the credential documentation are stored.
     */
    S3CredentialsAPIDocumentationURL: string
    /**
     * Defines the URL where the credentials are stored.
     */
    S3CredentialsAPIEndpoint: string
}

/**
 * Defines the possible values for the Amazon Web Service US Regions where the data product
 * resides.
 */
export enum DirectDistributionInformationRegionEnum {
    UsEast1 = 'us-east-1',
    UsEast2 = 'us-east-2',
    UsWest1 = 'us-west-1',
    UsWest2 = 'us-west-2',
}

/**
 * The elements of this section allow authors to provide community sourced words or phrases
 * to further describe the variable data.
 */
export interface MeasurementIdentifierType {
    /**
     * This element describes the context/medium within which the measurement was made.
     */
    MeasurementContextMedium: string
    /**
     * This element contains the URI for the context/medium.
     */
    MeasurementContextMediumURI?: string
    /**
     * This element describes the object which was measured.
     */
    MeasurementObject: string
    /**
     * This element contains the URI for the object which was measured.
     */
    MeasurementObjectURI?: string
    /**
     * This element contains the quantity or quantities which was/were measured.
     */
    MeasurementQuantities?: MeasurementQuantityType[]
}

/**
 * The elements of this section apply to a measurement name. The measurement name is
 * structured according to the form defined by Scott Peckham. This is: <object>_<quantity>.
 */
export interface MeasurementQuantityType {
    /**
     * This element contains the URI for the quantity which was measured.
     */
    MeasurementQuantityURI?: string
    /**
     * This element describes the value for the quantity which was measured.
     */
    Value?: string
}

/**
 * Requires the client, or user, to add in schema information into every variable record. It
 * includes the schema's name, version, and URL location. The information is controlled
 * through enumerations at the end of this schema.
 *
 * This object requires any metadata record that is validated by this schema to provide
 * information about the schema.
 */
export interface MetadataSpecificationType {
    /**
     * This element represents the name of the schema.
     */
    Name: 'UMM-Var'
    /**
     * This element represents the URL where the schema lives. The schema can be downloaded.
     */
    URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0'
    /**
     * This element represents the version of the schema.
     */
    Version: '1.9.0'
}

/**
 * This element represents the name of the schema.
 */

/**
 * This element represents the URL where the schema lives. The schema can be downloaded.
 */

/**
 * This element represents the version of the schema.
 */

/**
 * Represents Internet sites that contain information related to the data, as well as
 * related Internet sites such as project home pages, variable colormaps, metadata
 * extensions, etc.
 */
export interface RelatedURLType {
    /**
     * Description of the web resource at this URL.
     */
    Description?: string
    /**
     * Describes the organization of the data content so that users and applications know how to
     * read and use the content. The controlled vocabulary for formats is maintained in the
     * Keyword Management System (KMS):
     * https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/DataFormat?gtm_scheme=DataFormat
     */
    Format?: string
    /**
     * The multi-purpose internet mail extensions indicates the nature and format of the data
     * that is accessed through the URL. The controlled vocabulary for MimeTypes is maintained
     * in the Keyword Management System (KMS):
     * https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/MimeType?gtm_scheme=MimeType
     */
    MimeType?: string
    /**
     * A keyword describing the subtype of the online resource to this resource. This further
     * helps the GUI to know what to do with this resource. (e.g., 'MEDIA', 'BROWSE', 'OPENDAP',
     * 'OPENSEARCH', 'GITC', etc. ). The valid values are contained in the KMS System and are
     * dependent on the Type:
     * https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096
     */
    Subtype?: string
    /**
     * A keyword describing the type of the online resource to this resource. This helps the GUI
     * to know what to do with this resource. (e.g., 'COLORMAP', 'GET VISUALIZATION'). The valid
     * values are contained in the KMS System and are dependent on the URLContentType:
     * https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096
     */
    Type: string
    /**
     * The URL for the relevant web page (e.g., the URL of the responsible organization's home
     * page, the URL of the colormap server, etc.).
     */
    URL: string
    /**
     * A keyword describing the distinct content type of the online resource to this resource.
     * (e.g., 'DATACENTER URL', 'DATA CONTACT URL', 'Visualization URL'). The valid values are
     * contained in the KMS System:
     * https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096
     */
    URLContentType: string
}

/**
 * The elements of this section apply to a measurement.
 */
export interface SamplingIdentifierType {
    /**
     * The measurement conditions of the variable. For example, 'Sampled Particle Size Range: 90
     * - 600 nm'.
     */
    MeasurementConditions: string
    /**
     * The reporting conditions of the variable. The conditions over which the measurements of
     * the variable are valid. For example, 'STP: 1013 mb and 273 K'.
     */
    ReportingConditions?: string
    /**
     * The name of the sampling method used for the measurement. For example, 'radiometric
     * detection within the visible and infra-red ranges of the electromagnetic spectrum.
     */
    SamplingMethod: string
}

/**
 * Enables specification of Earth science keywords related to the collection.  The Earth
 * Science keywords are chosen from a controlled keyword hierarchy maintained in the Keyword
 * Management System (KMS). The valid values can be found at the KMS website:
 * https://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords?format=csv.
 */
export interface ScienceKeywordType {
    Category: string
    DetailedVariable?: string
    Term: string
    Topic: string
    VariableLevel1?: string
    VariableLevel2?: string
    VariableLevel3?: string
}

/**
 * The elements of this section apply to variable sets.
 */
export interface SetType {
    /**
     * This element specifies the index value within the set for this variable, For example, if
     * this varible is the third variable in the set, the index value should be set to '3'.
     */
    Index: number
    /**
     * This element enables specification of set name. For example, 'Data_Fields'.
     */
    Name: string
    /**
     * This element specifies the number of variables in the set. For example, if the number of
     * variables in the set is fifteen, the size should be set to '15'.
     */
    Size: number
    /**
     * This element enables specification of set type. For example, if the variables have been
     * grouped together based on a particular theme, such as wavelength, then the type should be
     * set to that theme, otherwise it should be set to 'General'.
     */
    Type: string
}

/**
 * Valid range data value of a variable: minimum and maximum values. For example, '-100,
 * 5000'.
 */
export interface ValidRangeType {
    /**
     * This element can be used to specify a code system identifier meaning. For example, 'Open
     * Shrubland' corresponds to '7'.
     */
    CodeSystemIdentifierMeaning?: string[]
    /**
     * The code system identifier value is the textual or numerical value assigned to each
     * meaning.
     */
    CodeSystemIdentifierValue?: string[]
    /**
     * Maximum data value of a variable. For example, '5000'.
     */
    Max?: number
    /**
     * Minimum data value of a variable. For example, '-100'.
     */
    Min?: number
}

/**
 * Specifies the sub type of a variable.
 *
 * This element is used to further classify the variable. If a variable does not contain
 * this field, it will be assumed to be a science vector.
 */
export enum VariableSubTypeEnum {
    Latitude = 'LATITUDE',
    Longitude = 'LONGITUDE',
    Other = 'OTHER',
    ScienceArray = 'SCIENCE_ARRAY',
    ScienceEventflag = 'SCIENCE_EVENTFLAG',
    ScienceScalar = 'SCIENCE_SCALAR',
    ScienceVector = 'SCIENCE_VECTOR',
    Time = 'TIME',
}

/**
 * Specify basic type of a variable.
 *
 * This element is used to classify the variable. If a variable does not contain this field,
 * it will be assumed to be a science variable.
 */
export enum VariableTypeEnum {
    AncillaryVariable = 'ANCILLARY_VARIABLE',
    Coordinate = 'COORDINATE',
    Other = 'OTHER',
    QualityVariable = 'QUALITY_VARIABLE',
    ScienceVariable = 'SCIENCE_VARIABLE',
}
