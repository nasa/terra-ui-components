import Head from 'next/head'
import Layout from './components/Layout'
import TerraAlert from '@nasa-terra/components/dist/react/alert/index.js'
import TerraAvatar from '@nasa-terra/components/dist/react/avatar/index.js'
import TerraButton from '@nasa-terra/components/dist/react/button/index.js'
import TerraCaption from '@nasa-terra/components/dist/react/caption/index.js'
import TerraCheckbox from '@nasa-terra/components/dist/react/checkbox/index.js'
import TerraChip from '@nasa-terra/components/dist/react/chip/index.js'
import TerraDatePicker from '@nasa-terra/components/dist/react/date-picker/index.js'
import TerraFileUpload from '@nasa-terra/components/dist/react/file-upload/index.js'
import TerraIcon from '@nasa-terra/components/dist/react/icon/index.js'
import TerraInput from '@nasa-terra/components/dist/react/input/index.js'
import TerraLoader from '@nasa-terra/components/dist/react/loader/index.js'
import TerraOption from '@nasa-terra/components/dist/react/option/index.js'
import TerraPagination from '@nasa-terra/components/dist/react/pagination/index.js'
import TerraRadio from '@nasa-terra/components/dist/react/radio/index.js'
import TerraScrollHint from '@nasa-terra/components/dist/react/scroll-hint/index.js'
import TerraSelect from '@nasa-terra/components/dist/react/select/index.js'
import TerraSlider from '@nasa-terra/components/dist/react/slider/index.js'
import TerraStatusIndicator from '@nasa-terra/components/dist/react/status-indicator/index.js'
import TerraTag from '@nasa-terra/components/dist/react/tag/index.js'
import TerraTextarea from '@nasa-terra/components/dist/react/textarea/index.js'
import TerraToggle from '@nasa-terra/components/dist/react/toggle/index.js'

export default function KitchenSink() {
    return (
        <>
            <Head>
                <title>Kitchen Sink - Terra UI Demo</title>
                <meta
                    name="description"
                    content="Examples of Terra UI Elements components"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: 'var(--terra-spacing-large)' }}>
                        Kitchen Sink
                    </h1>
                    <p
                        style={{
                            marginBottom: 'var(--terra-spacing-large)',
                            color: 'var(--terra-color-carbon-40)',
                        }}
                    >
                        This page showcases all Terra UI Elements components.
                    </p>

                    {/* Alerts */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Alerts
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraAlert variant="primary" open>
                                <TerraIcon
                                    slot="icon"
                                    name="solid-information-circle"
                                    library="heroicons"
                                />
                                <strong>Primary Alert</strong>
                                <br />
                                This is a primary alert with an icon.
                            </TerraAlert>
                            <TerraAlert variant="success" open>
                                <TerraIcon
                                    slot="icon"
                                    name="solid-check-circle"
                                    library="heroicons"
                                />
                                <strong>Success Alert</strong>
                                <br />
                                Operation completed successfully.
                            </TerraAlert>
                            <TerraAlert variant="warning" open>
                                <TerraIcon
                                    slot="icon"
                                    name="solid-exclamation-triangle"
                                    library="heroicons"
                                />
                                <strong>Warning Alert</strong>
                                <br />
                                Please review your settings.
                            </TerraAlert>
                            <TerraAlert variant="danger" open>
                                <TerraIcon
                                    slot="icon"
                                    name="solid-x-circle"
                                    library="heroicons"
                                />
                                <strong>Danger Alert</strong>
                                <br />
                                An error has occurred.
                            </TerraAlert>
                        </div>
                    </section>

                    {/* Avatars */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Avatars
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-medium)',
                                alignItems: 'center',
                            }}
                        >
                            <TerraAvatar label="Default avatar" />
                            <TerraAvatar
                                initials="JD"
                                label="Avatar with initials: JD"
                            />
                            <TerraAvatar
                                image="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                                label="Avatar with image"
                            />
                            <TerraAvatar label="Avatar with icon">
                                <TerraIcon slot="icon" name="asteroid" />
                            </TerraAvatar>
                        </div>
                    </section>

                    {/* Buttons */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Buttons
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraButton variant="default">Default</TerraButton>
                            <TerraButton variant="primary">Primary</TerraButton>
                            <TerraButton variant="success">Success</TerraButton>
                            <TerraButton variant="warning">Warning</TerraButton>
                            <TerraButton variant="danger">Danger</TerraButton>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-small)',
                                marginTop: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraButton variant="primary" size="small">
                                Small
                            </TerraButton>
                            <TerraButton variant="primary" size="medium">
                                Medium
                            </TerraButton>
                            <TerraButton variant="primary" size="large">
                                Large
                            </TerraButton>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-small)',
                                marginTop: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraButton variant="primary" disabled>
                                Disabled
                            </TerraButton>
                            <TerraButton variant="primary" loading>
                                Loading
                            </TerraButton>
                        </div>
                    </section>

                    {/* Captions */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Captions
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraCaption>
                                This is a caption that describes an image or provides
                                additional context.
                            </TerraCaption>
                            <TerraCaption>
                                Caption with credit: Image Credit: NASA/JPL-Caltech
                            </TerraCaption>
                        </div>
                    </section>

                    {/* Checkboxes */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Checkboxes
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraCheckbox>Unchecked</TerraCheckbox>
                            <TerraCheckbox checked>Checked</TerraCheckbox>
                            <TerraCheckbox disabled>Disabled</TerraCheckbox>
                            <TerraCheckbox checked disabled>
                                Checked Disabled
                            </TerraCheckbox>
                        </div>
                    </section>

                    {/* Chips */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Chips
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraChip size="small">Small Chip</TerraChip>
                            <TerraChip size="medium">Medium Chip</TerraChip>
                            <TerraChip size="large">Large Chip</TerraChip>
                            <TerraChip
                                size="medium"
                                closeable
                                onTerra-remove={() => alert('Chip removed!')}
                            >
                                Closeable Chip
                            </TerraChip>
                        </div>
                    </section>

                    {/* Date Pickers */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Date Pickers
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraDatePicker
                                label="Single Date"
                                helpText="Select a single date"
                            />
                            <TerraDatePicker
                                label="Date Range"
                                range
                                helpText="Select a date range"
                            />
                            <TerraDatePicker
                                label="With Min/Max"
                                minDate="2024-01-01"
                                maxDate="2024-12-31"
                                helpText="Date must be in 2024"
                            />
                        </div>
                    </section>

                    {/* File Upload */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            File Upload
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraFileUpload
                                label="Single File Upload"
                                helpText="Upload a single file"
                            />
                            <TerraFileUpload
                                label="Multiple Files"
                                multiple
                                helpText="Upload multiple files"
                            />
                            <TerraFileUpload
                                label="Images Only"
                                accept="image/*"
                                helpText="Accepts all image formats"
                            />
                            <TerraFileUpload
                                label="Required"
                                required
                                helpText="This field is required"
                            />
                        </div>
                    </section>

                    {/* Icons */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Icons
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-medium)',
                                alignItems: 'center',
                            }}
                        >
                            <TerraIcon name="magnifying-glass" library="heroicons" />
                            <TerraIcon
                                name="solid-check-circle"
                                library="heroicons"
                            />
                            <TerraIcon name="solid-x-circle" library="heroicons" />
                            <TerraIcon
                                name="solid-information-circle"
                                library="heroicons"
                            />
                            <TerraIcon
                                name="solid-exclamation-triangle"
                                library="heroicons"
                            />
                            <TerraIcon name="nasa-logo" fontSize="3rem" />
                        </div>
                    </section>

                    {/* Inputs */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Inputs
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraInput
                                label="Text Input"
                                placeholder="Enter text..."
                            />
                            <TerraInput
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                            />
                            <TerraInput
                                label="Number"
                                type="number"
                                placeholder="Enter a number"
                            />
                            <TerraInput
                                label="Required"
                                required
                                placeholder="This field is required"
                            />
                            <TerraInput
                                label="With Help Text"
                                helpText="This is helpful information"
                            />
                        </div>
                    </section>

                    {/* Loaders */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Loaders
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraLoader variant="small" percent="33" />
                            <TerraLoader variant="large" percent="66" />
                            <TerraLoader variant="orbit" percent="90" />
                        </div>
                    </section>

                    {/* Options */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Options
                        </h2>
                        <TerraSelect label="Select with Options">
                            <TerraOption value="">Choose an option</TerraOption>
                            <TerraOption value="option1">Option 1</TerraOption>
                            <TerraOption value="option2">Option 2</TerraOption>
                            <TerraOption value="option3">Option 3</TerraOption>
                        </TerraSelect>
                    </section>

                    {/* Pagination */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Pagination
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraPagination centered current={10} total={20} />
                            <TerraPagination current={5} total={20} />
                        </div>
                    </section>

                    {/* Radio Buttons */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Radio Buttons
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraRadio value="option1" checked>
                                Option 1
                            </TerraRadio>
                            <TerraRadio value="option2">Option 2</TerraRadio>
                            <TerraRadio value="option3" disabled>
                                Disabled
                            </TerraRadio>
                        </div>
                    </section>

                    {/* Scroll Hint */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Scroll Hint
                        </h2>
                        <div
                            style={{
                                position: 'relative',
                                height: '200px',
                                border: '1px solid var(--terra-color-carbon-20)',
                                borderRadius: 'var(--terra-border-radius-medium)',
                                padding: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <p>
                                Scroll hint will appear in the bottom left after 3
                                seconds of inactivity.
                            </p>
                            <TerraScrollHint />
                        </div>
                    </section>

                    {/* Select */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Select
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraSelect label="Single Select">
                                <TerraOption value="">Choose an option</TerraOption>
                                <TerraOption value="1">Option 1</TerraOption>
                                <TerraOption value="2">Option 2</TerraOption>
                                <TerraOption value="3">Option 3</TerraOption>
                            </TerraSelect>
                            <TerraSelect label="Multiple Select" multiple>
                                <TerraOption value="1">Option 1</TerraOption>
                                <TerraOption value="2">Option 2</TerraOption>
                                <TerraOption value="3">Option 3</TerraOption>
                            </TerraSelect>
                        </div>
                    </section>

                    {/* Sliders */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Sliders
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraSlider
                                label="Single Value"
                                min={0}
                                max={100}
                                value={50}
                            />
                            <TerraSlider
                                label="Range"
                                mode="range"
                                min={0}
                                max={1000}
                                step={10}
                                startValue={200}
                                endValue={800}
                            />
                            <TerraSlider
                                label="With Tooltips"
                                min={0}
                                max={100}
                                step={5}
                                value={25}
                                hasTooltips
                            />
                        </div>
                    </section>

                    {/* Status Indicators */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Status Indicators
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraStatusIndicator variant="active">
                                Active Mission
                            </TerraStatusIndicator>
                            <TerraStatusIndicator variant="completed">
                                Completed Mission
                            </TerraStatusIndicator>
                            <TerraStatusIndicator variant="testing">
                                Testing
                            </TerraStatusIndicator>
                            <TerraStatusIndicator variant="future">
                                Future Mission
                            </TerraStatusIndicator>
                        </div>
                    </section>

                    {/* Tags */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Tags
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraTag variant="topic" size="small">
                                Atmosphere
                            </TerraTag>
                            <TerraTag variant="topic" size="medium">
                                Ocean
                            </TerraTag>
                            <TerraTag variant="topic" size="large">
                                Land
                            </TerraTag>
                            <TerraTag
                                variant="content"
                                size="medium"
                                icon="document-text"
                            >
                                Document
                            </TerraTag>
                            <TerraTag variant="urgent" size="medium">
                                Urgent
                            </TerraTag>
                        </div>
                    </section>

                    {/* Textarea */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Textarea
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraTextarea
                                label="Basic Textarea"
                                rows={4}
                                placeholder="Enter text..."
                            />
                            <TerraTextarea
                                label="With Help Text"
                                rows={4}
                                helpText="This is helpful information"
                            />
                            <TerraTextarea label="Required" rows={4} required />
                        </div>
                    </section>

                    {/* Toggle */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>
                            Toggle
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--terra-spacing-small)',
                            }}
                        >
                            <TerraToggle>Unchecked Toggle</TerraToggle>
                            <TerraToggle checked>Checked Toggle</TerraToggle>
                            <TerraToggle disabled>Disabled Toggle</TerraToggle>
                            <TerraToggle checked disabled>
                                Checked Disabled
                            </TerraToggle>
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    )
}
