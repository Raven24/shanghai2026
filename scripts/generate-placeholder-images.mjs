#!/usr/bin/env node

/**
 * Generate placeholder images with gradients
 * Creates 8 test images in 3 aspect ratios: 4:5 (portrait), 16:9 (landscape), 1:1 (square)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(__dirname);

// Define image variants
const variants = [
  {
    name: '1',
    aspect: '4:5',
    width: 480,
    height: 600,
    gradient: [0xff6b6b, 0xff8e53, 0xffd93d],
  },
  {
    name: '2',
    aspect: '4:5',
    width: 480,
    height: 600,
    gradient: [0x4ecdc4, 0x44a08d, 0x087e8b],
  },
  {
    name: '3',
    aspect: '4:5',
    width: 480,
    height: 600,
    gradient: [0xa8edea, 0xfed6e3, 0xff7b7b],
  },
  {
    name: '4',
    aspect: '16:9',
    width: 960,
    height: 540,
    gradient: [0xf8b500, 0xff6348, 0xff0000],
  },
  {
    name: '5',
    aspect: '16:9',
    width: 960,
    height: 540,
    gradient: [0x667eea, 0x764ba2, 0xf093fb],
  },
  {
    name: '1-sq',
    aspect: '1:1',
    width: 400,
    height: 400,
    gradient: [0x00b4d8, 0x0096c7, 0x00b4d8],
  },
  {
    name: '2-sq',
    aspect: '1:1',
    width: 400,
    height: 400,
    gradient: [0xfdffb6, 0xffd60a, 0xffc300],
  },
  {
    name: '3-sq',
    aspect: '1:1',
    width: 400,
    height: 400,
    gradient: [0xe74c3c, 0xc0392b, 0x8b0000],
  },
];

// Create gradient SVG and convert to image
async function generateImage(variant) {
  const [c1, c2, c3] = variant.gradient;
  
  const svg = `
    <svg width="${variant.width}" height="${variant.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${c1.toString(16).padStart(6, '0')};stop-opacity:1" />
          <stop offset="50%" style="stop-color:#${c2.toString(16).padStart(6, '0')};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${c3.toString(16).padStart(6, '0')};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${variant.width}" height="${variant.height}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-size="48" font-family="system-ui, sans-serif" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.3">
        Placeholder ${variant.aspect}
      </text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

// Main function
async function main() {
  console.log('📸 Generating placeholder images...\n');
  
  // Create directories if they don't exist
  const postDir = path.join(projectRoot, 'src/content/posts');
  const sammlungenDir = path.join(projectRoot, 'src/content/sammlungen');
  
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });
  if (!fs.existsSync(sammlungenDir)) fs.mkdirSync(sammlungenDir, { recursive: true });
  
  // Generate images
  for (const variant of variants) {
    try {
      const svgBuffer = await generateImage(variant);
      const outputPath = path.join(projectRoot, `_placeholder-${variant.name}.jpg`);
      
      await sharp(svgBuffer)
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath);
      
      console.log(`✅ Created: _placeholder-${variant.name}.jpg (${variant.width}x${variant.height}, ${variant.aspect})`);
    } catch (err) {
      console.error(`❌ Failed to create _placeholder-${variant.name}.jpg:`, err.message);
    }
  }
  
  console.log('\n✨ Placeholder images generated in project root!');
  console.log('📝 Use these files in content/sammlungen/*.md and content/posts/*/index.md');
}

main().catch(console.error);
