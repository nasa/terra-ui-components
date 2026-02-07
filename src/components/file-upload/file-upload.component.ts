import { property, query, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './file-upload.styles.js'
import type { CSSResultGroup } from 'lit'

interface FileWithPreview extends File {
    preview?: string
}

/**
 * @summary File upload fields allow visitors to attach one or multiple files to be submitted with a form.
 * @documentation https://terra-ui.netlify.app/components/file-upload
 * @status stable
 * @since 1.0
 *
 * @slot - Custom content to display inside the drop zone.
 *
 * @event terra-change - Emitted when files are selected or removed.
 * @event terra-focus - Emitted when the control gains focus.
 * @event terra-blur - Emitted when the control loses focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart dropzone - The drop zone area.
 * @csspart file-input - The hidden file input element.
 * @csspart file-list - The container for file previews.
 * @csspart file-item - Individual file preview item.
 * @csspart file-thumbnail - The file thumbnail image.
 * @csspart file-name - The file name text.
 * @csspart change-link - The "Change files" link.
 *
 * @cssproperty --terra-file-upload-* - All file upload design tokens from horizon.css are supported.
 */
export default class TerraFileUpload extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('.file-upload__input') fileInput: HTMLInputElement
    @query('.file-upload__dropzone') dropzone: HTMLElement

    @state() private files: FileWithPreview[] = []
    @state() private isDragging = false
    @state() private hasFocus = false

    /** The file upload's label. */
    @property() label = 'Upload'

    /** The file upload's help text. */
    @property({ attribute: 'help-text' }) helpText = ''

    /** The name of the file input, submitted as a name/value pair with form data. */
    @property() name = ''

    /** Allows multiple files to be selected. */
    @property({ type: Boolean, reflect: true }) multiple = false

    /** Disables the file upload. */
    @property({ type: Boolean, reflect: true }) disabled = false

    /** Makes the file upload a required field. */
    @property({ type: Boolean, reflect: true }) required = false

    /** Accepted file types (e.g., "image/*", ".pdf", "image/png,image/jpeg"). */
    @property() accept = ''

    /** Maximum file size in bytes. */
    @property({ type: Number, attribute: 'max-file-size' }) maxFileSize?: number

    /** Maximum number of files allowed when multiple is enabled. */
    @property({ type: Number, attribute: 'max-files' }) maxFiles?: number

    connectedCallback() {
        super.connectedCallback()
    }

    firstUpdated() {
        this.setupDragAndDrop()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.cleanupDragAndDrop()
        // Clean up object URLs
        this.files.forEach(file => {
            if (file.preview && file.preview.startsWith('blob:')) {
                URL.revokeObjectURL(file.preview)
            }
        })
    }

    private setupDragAndDrop() {
        if (this.dropzone) {
            this.dropzone.addEventListener('dragover', this.handleDragOver)
            this.dropzone.addEventListener('dragleave', this.handleDragLeave)
            this.dropzone.addEventListener('drop', this.handleDrop)
        }
    }

    private cleanupDragAndDrop() {
        if (this.dropzone) {
            this.dropzone.removeEventListener('dragover', this.handleDragOver)
            this.dropzone.removeEventListener('dragleave', this.handleDragLeave)
            this.dropzone.removeEventListener('drop', this.handleDrop)
        }
    }

    private handleDragOver = (event: DragEvent) => {
        if (this.disabled) return
        event.preventDefault()
        event.stopPropagation()
        this.isDragging = true
    }

    private handleDragLeave = (event: DragEvent) => {
        if (this.disabled) return
        event.preventDefault()
        event.stopPropagation()
        this.isDragging = false
    }

    private handleDrop = (event: DragEvent) => {
        if (this.disabled) return
        event.preventDefault()
        event.stopPropagation()
        this.isDragging = false

        const droppedFiles = event.dataTransfer?.files
        if (droppedFiles && droppedFiles.length > 0) {
            this.handleFiles(Array.from(droppedFiles))
        }
    }

    private handleFileInputChange = (event: Event) => {
        const input = event.target as HTMLInputElement
        if (input.files && input.files.length > 0) {
            this.handleFiles(Array.from(input.files))
        }
    }

    private handleFiles(newFiles: File[]) {
        let filesToAdd = newFiles

        // Check max files limit
        if (this.multiple && this.maxFiles) {
            const remaining = this.maxFiles - this.files.length
            if (remaining <= 0) {
                return
            }
            filesToAdd = filesToAdd.slice(0, remaining)
        } else if (!this.multiple) {
            filesToAdd = [filesToAdd[0]]
        }

        // Check file size
        if (this.maxFileSize) {
            filesToAdd = filesToAdd.filter(file => file.size <= this.maxFileSize!)
        }

        // Generate previews for image files
        const filesWithPreviews: FileWithPreview[] = filesToAdd.map(file => {
            const fileWithPreview = file as FileWithPreview
            if (file.type.startsWith('image/')) {
                fileWithPreview.preview = URL.createObjectURL(file)
            }
            return fileWithPreview
        })

        if (this.multiple) {
            this.files = [...this.files, ...filesWithPreviews]
        } else {
            // Clean up old previews
            this.files.forEach(file => {
                if (file.preview && file.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(file.preview)
                }
            })
            this.files = filesWithPreviews
        }

        this.emit('terra-change')
    }

    private handleClick = () => {
        if (!this.disabled) {
            this.fileInput.click()
        }
    }

    private handleChangeFiles = () => {
        this.handleClick()
    }

    private handleFocus = () => {
        this.hasFocus = true
        this.emit('terra-focus')
    }

    private handleBlur = () => {
        this.hasFocus = false
        this.emit('terra-blur')
    }

    /** Gets the current files. */
    getFiles(): File[] {
        return [...this.files]
    }

    /** Clears all selected files. */
    clearFiles() {
        this.files.forEach(file => {
            if (file.preview && file.preview.startsWith('blob:')) {
                URL.revokeObjectURL(file.preview)
            }
        })
        this.files = []
        if (this.fileInput) {
            this.fileInput.value = ''
        }
        this.emit('terra-change')
    }

    render() {
        const hasFiles = this.files.length > 0
        const fileCount = this.files.length

        return html`
            <div class="file-upload-wrapper">
                ${this.label
                    ? html`
                          <label for="file-input" class="file-upload__label">
                              ${this.label}
                              ${this.required
                                  ? html`<span class="file-upload__required-indicator"
                                        >*</span
                                    >`
                                  : ''}
                          </label>
                      `
                    : ''}
                ${hasFiles
                    ? html`
                          <div class="file-upload__preview">
                              <div class="file-upload__preview-header">
                                  <strong class="file-upload__file-count"
                                      >${fileCount}
                                      ${fileCount === 1 ? 'file' : 'files'}
                                      selected</strong
                                  >
                                  <button
                                      type="button"
                                      class="file-upload__change-link"
                                      @click=${this.handleChangeFiles}
                                      ?disabled=${this.disabled}
                                  >
                                      Change files
                                  </button>
                              </div>
                              <div class="file-upload__file-list">
                                  ${this.files.map(
                                      file => html`
                                          <div
                                              class="file-upload__file-item"
                                              part="file-item"
                                          >
                                              ${file.preview
                                                  ? html`
                                                        <img
                                                            part="file-thumbnail"
                                                            class="file-upload__thumbnail"
                                                            src=${file.preview}
                                                            alt=${file.name}
                                                        />
                                                    `
                                                  : html`
                                                        <div
                                                            class="file-upload__thumbnail file-upload__thumbnail--placeholder"
                                                        >
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                                    stroke="currentColor"
                                                                    stroke-width="2"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                                <path
                                                                    d="M14 2V8H20"
                                                                    stroke="currentColor"
                                                                    stroke-width="2"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    `}
                                              <span
                                                  part="file-name"
                                                  class="file-upload__file-name"
                                                  >${file.name}</span
                                              >
                                          </div>
                                      `
                                  )}
                              </div>
                          </div>
                      `
                    : html`
                          <div
                              part="dropzone"
                              class=${classMap({
                                  'file-upload__dropzone': true,
                                  'file-upload__dropzone--dragging': this.isDragging,
                                  'file-upload__dropzone--focused': this.hasFocus,
                                  'file-upload__dropzone--disabled': this.disabled,
                              })}
                              @click=${this.handleClick}
                              @keydown=${(e: KeyboardEvent) => {
                                  if (
                                      (e.key === 'Enter' || e.key === ' ') &&
                                      !this.disabled
                                  ) {
                                      e.preventDefault()
                                      this.handleClick()
                                  }
                              }}
                              @focus=${this.handleFocus}
                              @blur=${this.handleBlur}
                              tabindex=${this.disabled ? '-1' : '0'}
                              role="button"
                              aria-label="Upload files"
                          >
                              <slot>
                                  <span class="file-upload__dropzone-text">
                                      Drag files here or
                                      <button
                                          type="button"
                                          class="file-upload__browse-link"
                                          @click=${(e: Event) => {
                                              e.stopPropagation()
                                              this.handleClick()
                                          }}
                                      >
                                          choose from folder
                                      </button>
                                  </span>
                              </slot>
                          </div>
                      `}

                <input
                    part="file-input"
                    class="file-upload__input"
                    id="file-input"
                    type="file"
                    name=${ifDefined(this.name || undefined)}
                    ?multiple=${this.multiple}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    accept=${ifDefined(this.accept || undefined)}
                    @change=${this.handleFileInputChange}
                    tabindex="-1"
                />

                ${this.helpText
                    ? html`<div class="file-upload__help-text">${this.helpText}</div>`
                    : ''}
            </div>
        `
    }
}
