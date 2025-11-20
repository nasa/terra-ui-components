---
meta:
    title: File Upload
    description: File upload fields allow visitors to attach one or multiple files to be submitted with a form.
layout: component
sidebarSection: Elements
---

# File Upload

File upload fields allow visitors to attach one or multiple files to be submitted with a form.

## Examples

### Basic File Upload

```html:preview
<terra-file-upload label="Upload"></terra-file-upload>
```

### With Help Text

```html:preview
<terra-file-upload
  label="Upload"
  help-text="Accepts all image formats."></terra-file-upload>
```

### Multiple Files

```html:preview
<terra-file-upload
  label="Upload"
  multiple
  help-text="Accepts all image formats."></terra-file-upload>
```

### With File Type Restrictions

```html:preview
<terra-file-upload
  label="Upload Images"
  accept="image/*"
  help-text="Accepts all image formats."></terra-file-upload>
```

### Required Field

```html:preview
<terra-file-upload
  label="Upload"
  required
  help-text="Accepts all image formats."></terra-file-upload>
```

### Disabled State

```html:preview
<terra-file-upload
  label="Upload"
  disabled
  help-text="Accepts all image formats."></terra-file-upload>
```

### With Maximum File Size

```html:preview
<terra-file-upload
  label="Upload"
  max-file-size="5242880"
  help-text="Maximum file size: 5MB. Accepts all image formats."></terra-file-upload>
```

### With Maximum Number of Files

```html:preview
<terra-file-upload
  label="Upload"
  multiple
  max-files="3"
  help-text="Maximum 3 files. Accepts all image formats."></terra-file-upload>
```

### Form Integration

```html:preview
<form id="upload-form">
  <terra-file-upload
    name="files"
    label="Upload"
    required
    multiple
    accept="image/*"
    help-text="Accepts all image formats."></terra-file-upload>
  <br>
  <terra-button type="submit">Submit</terra-button>
</form>
```

## Usage

Use file upload fields when files are required as part of a form submission for an application, contest entry, etc. The field can support single or multiple file uploads with drag and drop, or by clicking/tapping to open a native file browser. Using one file per field is recommended when each file has a distinct purpose, to make it clear for NASA team members who are receiving and reviewing form submissions.

## Best Practices

-   **Labels**: Always include a clear and concise label for each file upload field.
-   **Help text**: Use the `help-text` attribute to clearly explain which file formats are allowed and any size or quantity restrictions.
-   **File types**: Unless totally necessary, it is recommended to accept multiple file formats to avoid unnecessary software requirements for users.
-   **File size**: Be careful when requesting large files, as some visitors might have limited connectivity or data plans. Use the `max-file-size` attribute to set reasonable limits.
-   **Multiple files**: Use the `multiple` attribute when users need to upload several related files. Consider using the `max-files` attribute to limit the number of files.
-   **Single vs. multiple**: Using one file per field is recommended when each file has a distinct purpose, to make it clear for NASA team members who are receiving and reviewing form submissions.
-   **Progressive enhancement**: This field should be used as a progressive enhancement of the standard HTML field. The browser-default input field should be the fallback if any issues occur with this custom field.

## Accessibility

-   The `terra-file-upload` component is built with accessibility in mind, using native `<input type="file">` under the hood.
-   Labels are properly associated with the file input using the `for` attribute.
-   Required fields are indicated with an asterisk.
-   Help text is provided below the file upload field for additional context.
-   The component supports keyboard navigation (Tab to focus, Enter/Space to activate).
-   Focus states are clearly visible with a focus ring.
-   Screen readers are properly notified of file selections.

[component-metadata:terra-file-upload]
