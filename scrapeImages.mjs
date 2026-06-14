import fs from 'fs';
import path from 'path';
import { GROCERY_DATA } from './src/data/mockProducts.js';

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchImage(name) {
  try {
    const query = encodeURIComponent(name + ' pack product india 400x400');
    // Using simple user agent to get the classic basic HTML layout from google images, which embeds URLs securely
    const res = await fetch(`https://www.google.com/search?tbm=isch&q=${query}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const text = await res.text();
    // Look for the encrypted-tbn0.gstatic.com image URLs
    const matches = text.match(/https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[A-Za-z0-9\-_]+/g);
    if (matches && matches.length > 1) {
      // The first one is usually the Google logo or noise, second or third is the actual product
       return matches[1]; 
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log("Starting Google Images Scraper for 106 items...");
  let mockContent = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'mockProducts.js'), 'utf8');

  let count = 0;
  for (const item of GROCERY_DATA) {
    const url = await fetchImage(item.name + ' ' + (item.brand || ''));
    if (url) {
       // Replace in file content
       // We use a regex that matches the exact id's image to update it
       const regex = new RegExp(`(id:\\s*"${item.id}"[\\s\\S]*?image:\\s*")[^"]+(")`);
       mockContent = mockContent.replace(regex, `$1${url}$2`);
       console.log(`[${count+1}/106] ✅ ${item.name} -> ${url}`);
    } else {
       console.log(`[${count+1}/106] ❌ ${item.name}`);
    }
    count++;
    await delay(300); // 300ms delay to avoid 429 Too Many Requests
  }
  
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'mockProducts.js'), mockContent, 'utf8');
  console.log("Done updating mockProducts.js!");
}

run();
