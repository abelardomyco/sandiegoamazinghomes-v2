# Baja Section: La Escondida Vista + Logo (2025-02-15)

## What was done

- **La Escondida vista image** from The Baja Land Company gallery is used in the "Interested in Baja California land or property?" section on the San Diego Amazing Homes home page.
- **Baja Land Company logo** is placed to the right of the "Visit The Baja Land Company" button in that section.

## Assets

- **Image:** Copied from `thebajalandcompany/public/images/gallery/Copy of La Escondida vista.jpg` to `sandiegoamazinghomes/public/images/la-escondida-vista.jpg`.
- **Logo:** Copied from `thebajalandcompany/public/images/logo.png` to `sandiegoamazinghomes/public/images/baja-land-logo.png`.

## Code

- **File:** `sandiegoamazinghomes/app/page.js`
- Section: Baja California callout (last section before footer).
- Layout: Heading and description first; then La Escondida vista image (under the description); then a row with the CTA button and the logo. Image uses `object-cover object-right` so the left black edge is cropped and the visible image starts at the content. Logo is larger (min-w 180px, flex-1 up to 280px, height 48px) to fill the width to the right of the button.

## Notes

- Logo is used only in this Baja section (and was excluded from the main gallery per earlier rules).
- To refresh the image or logo, re-copy from the Baja Land project and overwrite the files in `public/images/`.
