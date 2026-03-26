#!/usr/bin/env node

/**
 * GitaMind Setup Validator
 * Checks if all required environment variables and configurations are set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 GitaMind Setup Validator\n');
console.log('=' .repeat(50));

let allGood = true;

// Check server .env
console.log('\n📁 Server Configuration:');
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(serverEnvPath)) {
  const serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
  const hasMongoUri = serverEnv.includes('MONGODB_URI');
  const hasJwtSecret = serverEnv.includes('JWT_SECRET');
  
  console.log(`  ✓ server/.env exists`);
  console.log(`  ${hasMongoUri ? '✓' : '✗'} MONGODB_URI configured`);
  console.log(`  ${hasJwtSecret ? '✓' : '✗'} JWT_SECRET configured`);
  
  if (!hasMongoUri || !hasJwtSecret) allGood = false;
} else {
  console.log('  ✗ server/.env not found');
  allGood = false;
}

// Check client .env files
console.log('\n📁 Client Configuration:');
const clientEnvPath = path.join(__dirname, 'client', '.env');
const clientEnvProdPath = path.join(__dirname, 'client', '.env.production');

if (fs.existsSync(clientEnvPath)) {
  console.log('  ✓ client/.env exists');
} else {
  console.log('  ✗ client/.env not found');
  allGood = false;
}

if (fs.existsSync(clientEnvProdPath)) {
  const clientEnvProd = fs.readFileSync(clientEnvProdPath, 'utf8');
  const hasRenderUrl = clientEnvProd.includes('gitamind-api.onrender.com');
  console.log(`  ✓ client/.env.production exists`);
  console.log(`  ${hasRenderUrl ? '✓' : '✗'} Points to production API (onrender.com)`);
  
  if (!hasRenderUrl) allGood = false;
} else {
  console.log('  ✗ client/.env.production not found');
  allGood = false;
}

// Check server.js CORS configuration
console.log('\n🔐 CORS Configuration:');
const serverPath = path.join(__dirname, 'server', 'server.js');
if (fs.existsSync(serverPath)) {
  const serverCode = fs.readFileSync(serverPath, 'utf8');
  const hasCorsFunction = serverCode.includes('origin: function');
  const hasVercelUrl = serverCode.includes('vercel.app');
  
  console.log(`  ${hasCorsFunction ? '✓' : '✗'} CORS origin handler configured`);
  console.log(`  ${hasVercelUrl ? '✓' : '✗'} Vercel domain whitelisted`);
  
  if (!hasCorsFunction || !hasVercelUrl) allGood = false;
} else {
  console.log('  ✗ server.js not found');
  allGood = false;
}

// Check API configuration
console.log('\n🌐 API Configuration:');
const apiPath = path.join(__dirname, 'client', 'src', 'services', 'api.js');
if (fs.existsSync(apiPath)) {
  const apiCode = fs.readFileSync(apiPath, 'utf8');
  const hasViteApiUrl = apiCode.includes('VITE_API_URL');
  
  console.log(`  ✓ client/src/services/api.js exists`);
  console.log(`  ${hasViteApiUrl ? '✓' : '✗'} Uses VITE_API_URL environment variable`);
  
  if (!hasViteApiUrl) allGood = false;
} else {
  console.log('  ✗ client/src/services/api.js not found');
  allGood = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('\n✅ All checks passed! Your setup looks good.\n');
  console.log('Next steps:');
  console.log('  1. Ensure MongoDB is running');
  console.log('  2. Start server: cd server && npm run dev');
  console.log('  3. Start client: cd client && npm run dev');
  console.log('  4. Visit http://localhost:5173\n');
} else {
  console.log('\n⚠️  Some checks failed. Please review the issues above.\n');
  console.log('See DEPLOYMENT.md for detailed instructions.\n');
}

process.exit(allGood ? 0 : 1);
