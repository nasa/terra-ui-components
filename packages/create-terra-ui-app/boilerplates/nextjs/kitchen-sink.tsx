import React from 'react'
import Head from 'next/head'
import Layout from './components/Layout'
import TerraBadge from '@nasa-terra/components/dist/react/badge/index.js'
import TerraChip from '@nasa-terra/components/dist/react/chip/index.js'
import TerraTag from '@nasa-terra/components/dist/react/tag/index.js'
import TerraCaption from '@nasa-terra/components/dist/react/caption/index.js'
import TerraButton from '@nasa-terra/components/dist/react/button/index.js'
import TerraIcon from '@nasa-terra/components/dist/react/icon/index.js'
import TerraAlert from '@nasa-terra/components/dist/react/alert/index.js'

export default function KitchenSink() {
    return (
        <>
            <Head>
                <title>Kitchen Sink - Terra UI Demo</title>
                <meta name="description" content="Examples of Terra UI Elements components" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: 'var(--terra-spacing-large)' }}>Kitchen Sink</h1>
                    <p style={{ marginBottom: 'var(--terra-spacing-large)', color: 'var(--terra-color-carbon-40)' }}>
                        This page showcases various Terra UI Elements components.
                    </p>

                    {/* Badges */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Badges</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)', alignItems: 'center' }}>
                            <TerraBadge variant="primary">Primary</TerraBadge>
                            <TerraBadge variant="success">Success</TerraBadge>
                            <TerraBadge variant="neutral">Neutral</TerraBadge>
                            <TerraBadge variant="warning">Warning</TerraBadge>
                            <TerraBadge variant="danger">Danger</TerraBadge>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)', alignItems: 'center', marginTop: 'var(--terra-spacing-small)' }}>
                            <TerraBadge variant="primary" pill>Pill Primary</TerraBadge>
                            <TerraBadge variant="success" pill>Pill Success</TerraBadge>
                            <TerraBadge variant="warning" pill pulse>Pulsing</TerraBadge>
                        </div>
                    </section>

                    {/* Chips */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Chips</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)' }}>
                            <TerraChip size="small">Small Chip</TerraChip>
                            <TerraChip size="medium">Medium Chip</TerraChip>
                            <TerraChip size="large">Large Chip</TerraChip>
                            <TerraChip size="medium" closeable onTerraRemove={() => alert('Chip removed!')}>
                                Closeable Chip
                            </TerraChip>
                        </div>
                    </section>

                    {/* Tags */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Tags</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)' }}>
                            <TerraTag type="topic" size="small">Atmosphere</TerraTag>
                            <TerraTag type="topic" size="medium">Ocean</TerraTag>
                            <TerraTag type="topic" size="large">Land</TerraTag>
                            <TerraTag type="content" size="medium" icon="document-text">
                                Document
                            </TerraTag>
                            <TerraTag type="urgent" size="medium">Urgent</TerraTag>
                        </div>
                    </section>

                    {/* Buttons */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Buttons</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)' }}>
                            <TerraButton variant="default">Default</TerraButton>
                            <TerraButton variant="primary">Primary</TerraButton>
                            <TerraButton variant="success">Success</TerraButton>
                            <TerraButton variant="warning">Warning</TerraButton>
                            <TerraButton variant="danger">Danger</TerraButton>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)', marginTop: 'var(--terra-spacing-small)' }}>
                            <TerraButton variant="primary" size="small">Small</TerraButton>
                            <TerraButton variant="primary" size="medium">Medium</TerraButton>
                            <TerraButton variant="primary" size="large">Large</TerraButton>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-small)', marginTop: 'var(--terra-spacing-small)' }}>
                            <TerraButton variant="primary" disabled>Disabled</TerraButton>
                            <TerraButton variant="primary" loading>Loading</TerraButton>
                        </div>
                    </section>

                    {/* Icons */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Icons</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--terra-spacing-medium)', alignItems: 'center' }}>
                            <TerraIcon name="magnifying-glass" library="heroicons" />
                            <TerraIcon name="solid-check-circle" library="heroicons" />
                            <TerraIcon name="solid-x-circle" library="heroicons" />
                            <TerraIcon name="solid-information-circle" library="heroicons" />
                            <TerraIcon name="solid-exclamation-triangle" library="heroicons" />
                            <TerraIcon name="nasa-logo" fontSize="3rem" />
                        </div>
                    </section>

                    {/* Alerts */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Alerts</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--terra-spacing-medium)' }}>
                            <TerraAlert variant="primary" open>
                                <TerraIcon slot="icon" name="solid-information-circle" library="heroicons" />
                                <strong>Primary Alert</strong>
                                <br />
                                This is a primary alert with an icon.
                            </TerraAlert>
                            <TerraAlert variant="success" open>
                                <TerraIcon slot="icon" name="solid-check-circle" library="heroicons" />
                                <strong>Success Alert</strong>
                                <br />
                                Operation completed successfully.
                            </TerraAlert>
                            <TerraAlert variant="warning" open>
                                <TerraIcon slot="icon" name="solid-exclamation-triangle" library="heroicons" />
                                <strong>Warning Alert</strong>
                                <br />
                                Please review your settings.
                            </TerraAlert>
                            <TerraAlert variant="danger" open>
                                <TerraIcon slot="icon" name="solid-x-circle" library="heroicons" />
                                <strong>Danger Alert</strong>
                                <br />
                                An error has occurred.
                            </TerraAlert>
                        </div>
                    </section>

                    {/* Captions */}
                    <section style={{ marginBottom: 'var(--terra-spacing-x-large)' }}>
                        <h2 style={{ marginBottom: 'var(--terra-spacing-medium)' }}>Captions</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--terra-spacing-small)' }}>
                            <TerraCaption>This is a default caption</TerraCaption>
                            <TerraCaption variant="primary">This is a primary caption</TerraCaption>
                            <TerraCaption variant="success">This is a success caption</TerraCaption>
                            <TerraCaption variant="warning">This is a warning caption</TerraCaption>
                            <TerraCaption variant="danger">This is a danger caption</TerraCaption>
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    )
}

