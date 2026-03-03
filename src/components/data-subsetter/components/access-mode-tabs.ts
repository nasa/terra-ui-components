import { html } from 'lit'

type Props = {
    mode: 'original' | 'subset'
    onModeChange: (mode: 'original' | 'subset') => void
}

export function accessModeTabs({ mode, onModeChange }: Props) {
    return html`
        <div class="mode-selection">
            <div class="mode-options">
                <label class="mode-option ${mode === 'original' ? 'selected' : ''}">
                    <input
                        type="radio"
                        name="data-access-mode"
                        value="original"
                        .checked=${mode === 'original'}
                        @change=${() => onModeChange('original')}
                    />
                    <div class="mode-content">
                        <div class="mode-title">Get Original Files</div>
                        <div class="mode-description">
                            Filter file links directly from the archive.
                        </div>
                    </div>
                </label>

                <label class="mode-option ${mode === 'subset' ? 'selected' : ''}">
                    <input
                        type="radio"
                        name="data-access-mode"
                        value="subset"
                        .checked=${mode === 'subset'}
                        @change=${() => onModeChange('subset')}
                    />
                    <div class="mode-content">
                        <div class="mode-title">Subset Data</div>
                        <div class="mode-description">
                            Subset the data to your specific needs.
                        </div>
                    </div>
                </label>
            </div>
        </div>
    `
}
