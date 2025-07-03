#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Customizing template...');

const projectName = process.argv[2];

try {
    // Example: Rename android package folders or update more files
    execSync(`npx react-native-rename ${projectName} --skipGit`, { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Failed during post-init script:', error.message);
}
