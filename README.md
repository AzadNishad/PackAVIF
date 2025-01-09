# Pack AVIF

Convert images to AVIF format with optimized compression while maintaining high quality. This package provides an easy-to-use interface for converting both single images and entire directories of images to the AVIF format.

## Features

- High-quality AVIF conversion using Sharp
- Configurable quality and compression settings
- Batch processing for directories
- Detailed conversion statistics
- Support for JPG, JPEG, and PNG input formats
- Promise-based async/await API
- Recursive directory processing
- Progress tracking for batch operations

## Installation

```bash
npm install packavif
```

## Usage

### Converting a Single Image

```javascript
import { AvifConverter } from 'packavif';

// Initialize with default options
const converter = new AvifConverter();

// Convert a single image
try {
  const result = await converter.convertImage('input.jpg', 'output.avif');
  console.log('Conversion successful:', result);
  console.log(`Compression ratio: ${result.compressionRatio.toFixed(2)}%`);
} catch (error) {
  console.error('Conversion failed:', error);
}
```

### Converting a Directory of Images

```javascript
// Convert all images in a directory
const results = await converter.convertDirectory(
  'input-directory',
  'output-directory',
  '**/*.{jpg,jpeg,png}'  // Optional glob pattern
);

// Print summary
const totalSaved = results.reduce((acc, r) => acc + (r.inputSize - r.outputSize), 0);
console.log(`Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
```

### Custom Configuration

```javascript
const converter = new AvifConverter({
  quality: 80,              // 1-100 (default: 80)
  speed: 5,                 // 0-8, lower is slower but better quality (default: 5)
  chromaSubsampling: '4:4:4' // '4:4:4' or '4:2:0' (default: '4:4:4')
});
```

## API Reference

### Class: AvifConverter

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| quality | number | 80 | AVIF quality (1-100) |
| speed | number | 5 | Encoding speed (0-8) |
| chromaSubsampling | string | '4:4:4' | Chroma subsampling ratio |

#### Methods

##### `convertImage(inputPath: string, outputPath: string): Promise<ConversionResult>`

Converts a single image to AVIF format.

Returns an object with:
- `inputPath`: Original image path
- `outputPath`: Converted image path
- `inputSize`: Original file size in bytes
- `outputSize`: Converted file size in bytes
- `compressionRatio`: Percentage of size reduction
- `duration`: Processing time in seconds

##### `convertDirectory(inputDir: string, outputDir: string, pattern?: string): Promise<ConversionResult[]>`

Converts all matching images in a directory to AVIF format.

Parameters:
- `inputDir`: Source directory path
- `outputDir`: Destination directory path
- `pattern`: Optional glob pattern (default: `**/*.{jpg,jpeg,png}`)

Returns an array of ConversionResult objects.

## Performance Tips

1. **Quality Settings**: 
   - Use quality 80-90 for high-quality images
   - Use quality 60-75 for web optimization
   - Use quality 40-60 for thumbnail generation

2. **Speed Settings**:
   - Use speed 0-3 for maximum quality
   - Use speed 4-6 for balanced results
   - Use speed 7-8 for fastest conversion

3. **Memory Usage**:
   - Process large batches in smaller chunks
   - Monitor memory usage when processing many files

## Requirements

- Node.js 14.x or higher
- Sharp dependencies (automatically installed)

## Common Issues

1. **Installation Fails**:
   ```bash
   # If Sharp installation fails, try:
   npm install --platform=linux --arch=x64 sharp
   ```

2. **Memory Issues**:
   ```javascript
   // Limit concurrent processing:
   const converter = new AvifConverter({
     maxConcurrency: 4  // Process 4 files at a time
   });
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Sharp](https://sharp.pixelplumbing.com/)
- Uses [glob](https://github.com/isaacs/node-glob) for file matching