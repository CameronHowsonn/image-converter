# Image Converter Script

This Node.js script converts all images in a specified directory to WebP format, moves the original files to an `old` directory, and places the converted WebP images in a `webp` directory.

# Requirements

- Node.js (version 20 or later)
- TypeScript
- `pnpm` / `yarn` / `npm`

# Installation

1. Clone the repository or download the script files.
2. Navigate to the project directory and install the required dependencies:
3. `pnpm install` / `yarn install` / `npm install`

# Usage

- `node dist/index.js path=<your-directory-path>`

#### Optionally you can also pass in `oldOuput` and `output` arguments for where the script should save the images. These default to `old` and `webp` if not provided. There is also a `quality` argument, which allow for greater compression of images in exchange for quality.

- `node dist/index.js path=<your-directory-path> oldOutput=<old-output-folder-name> output=<output-folder-name> quality=<quality>`

For example:
`node dist/index.js path=src/dir/images oldOutput=backup output=converted quality=90`

# Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- TIFF (.tiff)
