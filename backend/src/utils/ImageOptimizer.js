const sharp = require('sharp');

class ImageOptimizer {
  /**
   * Optimize image before uploading to Cloudinary
   * @param {Buffer} buffer - Image buffer
   * @param {Object} options - Optimization options
   * @returns {Promise<Buffer>} Optimized image buffer
   */
  static async optimize(buffer, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 85,
      format = 'jpeg'
    } = options;

    try {
      let image = sharp(buffer);
      
      // Get metadata to check dimensions
      const metadata = await image.metadata();
      
      // Resize if image is too large
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        image = image.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Convert and compress
      if (format === 'jpeg' || format === 'jpg') {
        image = image.jpeg({ quality, progressive: true });
      } else if (format === 'png') {
        image = image.png({ quality, compressionLevel: 9 });
      } else if (format === 'webp') {
        image = image.webp({ quality });
      }

      return await image.toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      // Return original buffer if optimization fails
      return buffer;
    }
  }

  /**
   * Optimize product image with preset dimensions
   */
  static async optimizeProductImage(buffer) {
    return this.optimize(buffer, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 85,
      format: 'jpeg'
    });
  }

  /**
   * Optimize thumbnail
   */
  static async optimizeThumbnail(buffer) {
    return this.optimize(buffer, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 80,
      format: 'jpeg'
    });
  }

  /**
   * Optimize avatar image
   */
  static async optimizeAvatar(buffer) {
    return this.optimize(buffer, {
      maxWidth: 500,
      maxHeight: 500,
      quality: 85,
      format: 'jpeg'
    });
  }

  /**
   * Get image info without optimization
   */
  static async getImageInfo(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      return null;
    }
  }
}

module.exports = ImageOptimizer;
