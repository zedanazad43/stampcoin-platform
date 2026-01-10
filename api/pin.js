/**
 * Serverless IPFS Pinning Endpoint
 * 
 * This function accepts POST requests to pin images and metadata to nft.storage
 * and optionally to Pinata. Compatible with Vercel, Netlify, and other serverless platforms.
 * 
 * Environment Variables Required:
 * - NFT_STORAGE_API_KEY: API key for nft.storage
 * - PINATA_API_KEY: API key for Pinata (optional)
 * - PINATA_SECRET_API_KEY: Secret API key for Pinata (optional, use with PINATA_API_KEY)
 * - PINATA_JWT: JWT token for Pinata (optional, alternative to API key/secret)
 */

const https = require('https');
const http = require('http');

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Make an HTTPS request
 */
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'http:' ? http : https;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: body });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Pin to nft.storage
 */
async function pinToNFTStorage(fileData, fileName, apiKey) {
  const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
  const fileBuffer = Buffer.from(fileData, 'base64');
  
  const formData = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
    'Content-Type: application/octet-stream',
    '',
    fileBuffer.toString('binary'),
    `--${boundary}--`
  ].join('\r\n');

  const options = {
    hostname: 'api.nft.storage',
    port: 443,
    path: '/upload',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(formData)
    }
  };

  return makeRequest(options, formData);
}

/**
 * Pin to Pinata
 */
async function pinToPinata(fileData, fileName, auth) {
  const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
  const fileBuffer = Buffer.from(fileData, 'base64');
  
  const metadata = JSON.stringify({
    name: fileName,
    keyvalues: {
      timestamp: new Date().toISOString()
    }
  });

  const formData = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
    'Content-Type: application/octet-stream',
    '',
    fileBuffer.toString('binary'),
    `--${boundary}`,
    'Content-Disposition: form-data; name="pinataMetadata"',
    'Content-Type: application/json',
    '',
    metadata,
    `--${boundary}--`
  ].join('\r\n');

  const headers = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(formData)
  };

  // Support both JWT and API key/secret authentication
  if (auth.jwt) {
    headers['Authorization'] = `Bearer ${auth.jwt}`;
  } else if (auth.apiKey && auth.secretApiKey) {
    headers['pinata_api_key'] = auth.apiKey;
    headers['pinata_secret_api_key'] = auth.secretApiKey;
  }

  const options = {
    hostname: 'api.pinata.cloud',
    port: 443,
    path: '/pinning/pinFileToIPFS',
    method: 'POST',
    headers
  };

  return makeRequest(options, formData);
}

/**
 * Validate request body
 */
function validateRequest(body) {
  if (!body) {
    throw new Error('Request body is required');
  }

  if (!body.file) {
    throw new Error('File data is required (base64 encoded)');
  }

  if (!body.fileName) {
    throw new Error('File name is required');
  }

  // Check file size
  const fileSize = Buffer.from(body.file, 'base64').length;
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Validate base64
  if (!/^[A-Za-z0-9+/=]+$/.test(body.file)) {
    throw new Error('Invalid base64 encoded file data');
  }

  return true;
}

/**
 * Main handler function
 */
async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    // Parse request body
    let body;
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else {
      body = req.body;
    }

    // Validate request
    validateRequest(body);

    const { file, fileName, metadata } = body;
    const results = {};

    // Check for required environment variables
    const nftStorageKey = process.env.NFT_STORAGE_API_KEY;
    if (!nftStorageKey) {
      throw new Error('NFT_STORAGE_API_KEY environment variable is not set');
    }

    // Pin to nft.storage (required)
    console.log('Pinning to nft.storage...');
    const nftStorageResult = await pinToNFTStorage(file, fileName, nftStorageKey);
    results.nftStorage = {
      success: true,
      data: nftStorageResult.body
    };

    // Pin to Pinata (optional)
    const pinataJwt = process.env.PINATA_JWT;
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

    if (pinataJwt || (pinataApiKey && pinataSecretKey)) {
      try {
        console.log('Pinning to Pinata...');
        const pinataAuth = pinataJwt 
          ? { jwt: pinataJwt }
          : { apiKey: pinataApiKey, secretApiKey: pinataSecretKey };
        
        const pinataResult = await pinToPinata(file, fileName, pinataAuth);
        results.pinata = {
          success: true,
          data: pinataResult.body
        };
      } catch (pinataError) {
        console.error('Pinata error:', pinataError);
        results.pinata = {
          success: false,
          error: pinataError.message
        };
      }
    } else {
      results.pinata = {
        success: false,
        message: 'Pinata credentials not configured (optional)'
      };
    }

    // Include metadata if provided
    if (metadata) {
      results.metadata = metadata;
    }

    res.status(200).json({
      success: true,
      message: 'File pinned successfully',
      results
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Export for different serverless platforms
module.exports = handler;
module.exports.handler = handler;

// For local testing
if (require.main === module) {
  const express = require('express');
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.post('/api/pin', handler);
  app.options('/api/pin', handler);
  
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Test server running on http://localhost:${port}`);
    console.log(`POST to http://localhost:${port}/api/pin to test`);
  });
}
