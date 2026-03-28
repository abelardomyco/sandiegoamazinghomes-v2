# SDAH photos to use

Images from **sandiegoamazinghomes.com** and from **Instagram @sandiegoamazinghomes**, all in this folder.

## Source 1: Website (2025-02-15)

Extracted from the home and about-us pages:

| File | Notes |
|------|--------|
| cropped-SDAH-web-banner.png | Site banner / hero |
| Rosa-010.jpg, Rosa-010-150x150.jpg, Rosa-010-767x1024.jpg | Rosamelia |
| DSC_0625_2-1024x536.jpg, DSC_0634-1024x695.jpg | Property/listing |
| Screen-Shot-2021-10-01-*.png, Screen-Shot-2025-01-03-*.png | Screenshots |
| 39fde8e6-*.jpg, f584dfa5-*.jpg | Uploads (2024) |
| Abelardo-photo-686x1024-1.jpeg | About page |

## Source 2: Instagram @sandiegoamazinghomes (2025-02-15)

Downloaded with **Instaloader** (Python). Filenames are date-based, e.g.:

- `2022-07-02_19-51-12_UTC.jpg` — single image post
- `2019-11-10_22-00-55_UTC_1.jpg`, `_2.jpg`, … — carousel post
- `2023-06-30_23-57-18_UTC_profile_pic.jpg` — profile picture

Roughly 60 image files from the profile (posts + profile pic). Instaloader metadata (`.json.xz`, `.txt`) was removed so only image files remain.

## Blog hero (`/blog`)

Put the sunset shot here with **`sunset` in the filename** (any case). The blog page picks the newest matching file by modification time. If nothing matches, a gradient placeholder is used instead.

## Usage in the app

Use paths like `/images/sdah photos to use/filename.ext`. Spaces are valid; if you need a URL-encoded path, use `%20` for the space.
