#!/usr/bin/env node

const { execSync } = require('child_process');
const files = process.argv.slice(2);

const filesToLint = files.filter(f =>
    !f.endsWith('eslint.config.js') &&
    !f.endsWith('.config.js') &&
    !f.includes('node_modules')
);

if (filesToLint.length === 0) process.exit(0);

const backendFiles = filesToLint.filter(f => f.startsWith('backend/'));
const frontendFiles = filesToLint.filter(f => f.startsWith('lrt-frontend/'));

if (backendFiles.length)
    execSync(`cd backend && npx eslint ${backendFiles.map(f => `"../${f}"`).join(' ')} --ext .js,.ts,.jsx,.tsx`, { stdio: 'inherit' });

if (frontendFiles.length)
    execSync(`cd lrt-frontend && npx eslint ${frontendFiles.map(f => `"../${f}"`).join(' ')} --ext .js,.ts,.vue`, { stdio: 'inherit' });
