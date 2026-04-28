import React, { useState, useRef } from 'react'
import Head from 'next/head'
import Layout from './components/Layout'
import TerraInput from '@nasa-terra/components/dist/react/input/index.js'
import TerraTextarea from '@nasa-terra/components/dist/react/textarea/index.js'
import TerraSelect from '@nasa-terra/components/dist/react/select/index.js'
import TerraOption from '@nasa-terra/components/dist/react/option/index.js'
import TerraCheckbox from '@nasa-terra/components/dist/react/checkbox/index.js'
import TerraRadioGroup from '@nasa-terra/components/dist/react/radio-group/index.js'
import TerraRadio from '@nasa-terra/components/dist/react/radio/index.js'
import TerraDatePicker from '@nasa-terra/components/dist/react/date-picker/index.js'
import TerraButton from '@nasa-terra/components/dist/react/button/index.js'

export default function Home() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = formRef.current
        if (!form) return

        // Check form validity
        if (!form.checkValidity()) {
            form.reportValidity()
            setIsSubmitting(false)
            return
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Show success toast
        try {
            // Wait for custom elements to be defined
            await customElements.whenDefined('terra-toast')
            const TerraToastClass = customElements.get('terra-toast') as any
            if (TerraToastClass && TerraToastClass.notify) {
                await TerraToastClass.notify(
                    'Your collection was created!',
                    'success',
                    'solid-check-circle'
                )
            }
        } catch (err) {
            console.error('Failed to show toast:', err)
        }

        setIsSubmitting(false)
    }

    return (
        <>
            <Head>
                <title>Create CMR Collection - Terra UI Demo</title>
                <meta
                    name="description"
                    content="Example form using Terra UI components"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: 'var(--terra-spacing-large)' }}>
                        Create NASA CMR Collection
                    </h1>
                    <p
                        style={{
                            marginBottom: 'var(--terra-spacing-large)',
                            color: 'var(--terra-color-carbon-40)',
                        }}
                    >
                        This form demonstrates various Terra UI form components with
                        validation.
                    </p>

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--terra-spacing-medium)',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraInput
                                label="Collection Name"
                                name="collectionName"
                                required
                                placeholder="Enter collection name"
                                helpText="A unique name for your collection"
                            />

                            <TerraInput
                                label="Short Name"
                                name="shortName"
                                required
                                placeholder="Enter short name"
                                helpText="A short identifier for the collection"
                            />
                        </div>

                        <TerraInput
                            label="DOI"
                            name="doi"
                            type="url"
                            placeholder="https://doi.org/10.1234/example"
                            helpText="Digital Object Identifier (optional)"
                        />

                        <TerraSelect
                            label="Collection Type"
                            name="collectionType"
                            required
                            helpText="Select the type of collection"
                        >
                            <TerraOption value="">Choose a type</TerraOption>
                            <TerraOption value="dataset">Dataset</TerraOption>
                            <TerraOption value="service">Service</TerraOption>
                            <TerraOption value="tool">Tool</TerraOption>
                            <TerraOption value="document">Document</TerraOption>
                        </TerraSelect>

                        <TerraTextarea
                            label="Description"
                            name="description"
                            rows={5}
                            required
                            placeholder="Describe the collection..."
                            helpText="Provide a detailed description of the collection"
                        />

                        <TerraDatePicker
                            label="Temporal Coverage Start"
                            name="temporalStart"
                            required
                            helpText="Start date of the temporal coverage"
                        />

                        <TerraDatePicker
                            label="Temporal Coverage End"
                            name="temporalEnd"
                            helpText="End date of the temporal coverage (optional)"
                        />

                        <TerraRadioGroup
                            label="Data Format"
                            name="dataFormat"
                            required
                            defaultValue="netcdf"
                        >
                            <TerraRadio value="netcdf">NetCDF</TerraRadio>
                            <TerraRadio value="hdf">HDF</TerraRadio>
                            <TerraRadio value="geotiff">GeoTIFF</TerraRadio>
                            <TerraRadio value="json">JSON</TerraRadio>
                        </TerraRadioGroup>

                        <div>
                            <TerraCheckbox name="publicAccess" defaultChecked>
                                Make collection publicly accessible
                            </TerraCheckbox>
                        </div>

                        <div>
                            <TerraCheckbox name="notifications">
                                Subscribe to collection updates
                            </TerraCheckbox>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--terra-spacing-small)',
                                marginTop: 'var(--terra-spacing-medium)',
                            }}
                        >
                            <TerraButton
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Collection'}
                            </TerraButton>
                            <TerraButton type="reset" variant="default">
                                Reset
                            </TerraButton>
                        </div>
                    </form>
                </div>
            </Layout>
        </>
    )
}
