import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

export class AvifConverter {
  constructor(options = {}) {
    this.quality = options.quality || 80;
    this.speed = options.speed || 5; // 0-8, lower is slower but better quality
    this.chromaSubsampling = options.chromaSubsampling || '4:4:4';
  }

  /**
   * Convert a single image to AVIF format
   * @param {string} inputPath - Path to input image
   * @param {string} outputPath - Path for output AVIF image
   * @returns {Promise<Object>} Statistics about the conversion
   */
  async convertImage(inputPath, outputPath) {
    const startTime = process.hrtime();
    
    try {
      const inputStats = await fs.stat(inputPath);
      const inputSize = inputStats.size;

      await sharp(inputPath)
        .avif({
          quality: this.quality,
          speed: this.speed,
          chromaSubsampling: this.chromaSubsampling
        })
        .toFile(outputPath);

      const outputStats = await fs.stat(outputPath);
      const outputSize = outputStats.size;
      
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds + nanoseconds / 1e9;

      return {
        inputPath,
        outputPath,
        inputSize,
        outputSize,
        compressionRatio: (1 - (outputSize / inputSize)) * 100,
        duration
      };
    } catch (error) {
      throw new Error(`Error converting ${inputPath}: ${error.message}`);
    }
  }

  /**
   * Convert multiple images in a directory
   * @param {string} inputDir - Input directory path
   * @param {string} outputDir - Output directory path
   * @param {string} pattern - Glob pattern for input files
   * @returns {Promise<Array>} Array of conversion statistics
   */
  async convertDirectory(inputDir, outputDir, pattern = '**/*.{jpg,jpeg,png}') {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      
      const files = await glob(pattern, { cwd: inputDir });
      const results = [];

      for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(
          outputDir,
          file.replace(/\.[^/.]+$/, '.avif')
        );
        
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        const result = await this.convertImage(inputPath, outputPath);
        results.push(result);
      }

      return results;
    } catch (error) {
      throw new Error(`Error converting directory: ${error.message}`);
    }
  }
}