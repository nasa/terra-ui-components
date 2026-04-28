import React from 'react'
import TerraSiteHeader from '@nasa-terra/components/dist/react/site-header/index.js'
import TerraSiteNavigation from '@nasa-terra/components/dist/react/site-navigation/index.js'
import TerraDropdown from '@nasa-terra/components/dist/react/dropdown/index.js'
import TerraButton from '@nasa-terra/components/dist/react/button/index.js'
import TerraMenu from '@nasa-terra/components/dist/react/menu/index.js'
import TerraMenuItem from '@nasa-terra/components/dist/react/menu-item/index.js'
import TerraIcon from '@nasa-terra/components/dist/react/icon/index.js'
import Link from 'next/link'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <TerraSiteHeader siteName="Terra UI Demo">
                <div
                    slot="right"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--terra-spacing-small)',
                    }}
                >
                    <TerraDropdown placement="bottom-start" distance={3} hover>
                        <TerraButton
                            slot="trigger"
                            size="medium"
                            variant="text"
                            caret
                        >
                            Navigation
                        </TerraButton>
                        <TerraMenu role="menu">
                            <TerraMenuItem value="home">
                                <Link href="/">Home</Link>
                            </TerraMenuItem>
                            <TerraMenuItem value="kitchen-sink">
                                <Link href="/kitchen-sink">Kitchen Sink</Link>
                            </TerraMenuItem>
                        </TerraMenu>
                    </TerraDropdown>
                    <button
                        type="button"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--terra-color-spacesuit-white)',
                            cursor: 'pointer',
                            padding: 'var(--terra-spacing-2x-small)',
                        }}
                        aria-label="Search"
                    >
                        <TerraIcon
                            name="solid-magnifying-glass"
                            library="heroicons"
                        />
                    </button>
                </div>
            </TerraSiteHeader>
            <main
                style={{
                    padding: 'var(--terra-spacing-large)',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                {children}
            </main>
        </>
    )
}
