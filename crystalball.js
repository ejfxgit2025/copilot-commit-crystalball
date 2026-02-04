#!/usr/bin/env node

/**
 * crystalball.js - GitHub Copilot Commit Risk Analyzer
 * Fixed version using gh copilot -p (prompt mode) for Windows CMD
 */

const { execSync } = require('child_process');
const { exit } = require('process');

// Colors for terminal output
const COLORS = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function print(color, emoji, message) {
    console.log(`${color}${emoji ? emoji + ' ' : ''}${message}${COLORS.reset}`);
}

function runCommand(command, errorMessage) {
    try {
        return execSync(command, { 
            encoding: 'utf8', 
            stdio: 'pipe',
            shell: true,
            windowsHide: true
        }).trim();
    } catch (error) {
        if (errorMessage) {
            print(COLORS.red, '❌', `${errorMessage}: ${error.message}`);
        }
        throw error;
    }
}

function escapeForCmd(text) {
    // Escape double quotes and backslashes for Windows CMD
    return text
        .replace(/\\/g, '\\\\')  // Escape backslashes
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/\r\n/g, '\n')  // Normalize line endings
        .replace(/\n/g, '\\n')   // Escape newlines
        .replace(/\t/g, '\\t');  // Escape tabs
}

function checkPrerequisites() {
    const required = ['git', 'gh'];
    for (const cmd of required) {
        try {
            execSync(`where ${cmd}`, { 
                stdio: 'ignore', 
                shell: true,
                windowsHide: true 
            });
        } catch {
            print(COLORS.red, '❌', `${cmd} is not installed or not in PATH`);
            print(COLORS.yellow, '💡', `Install ${cmd} and try again`);
            exit(1);
        }
    }
}

function getGitInfo() {
    try {
        // Check if we're in a git repo
        runCommand('git rev-parse --is-inside-work-tree', 'Not in Git repository');
        
        // Check for staged files
        const stagedFiles = runCommand('git diff --cached --name-only');
        if (!stagedFiles || stagedFiles.trim() === '') {
            return { hasStagedChanges: false };
        }
        
        // Get detailed info
        const fileList = stagedFiles.split('\n').filter(f => f.trim());
        const diff = runCommand('git diff --cached');
        
        // Get recent commits (handle case with no commits yet)
        let recentCommits = '';
        try {
            recentCommits = runCommand('git log --oneline -5 2>nul || echo "No commit history yet"');
        } catch {
            recentCommits = 'No commit history yet';
        }
        
        return {
            hasStagedChanges: true,
            fileCount: fileList.length,
            fileList: fileList.join(', '),
            diff: diff,
            recentCommits: recentCommits
        };
    } catch (error) {
        print(COLORS.red, '❌', 'Git repository error');
        exit(1);
    }
}

function buildPrompt(gitInfo) {
    // Build a concise but informative prompt
    let prompt = `Analyze these staged git changes for potential risks, issues, and improvements.\n\n`;
    
    prompt += `CHANGED FILES (${gitInfo.fileCount}): ${gitInfo.fileList}\n\n`;
    prompt += `STAGED DIFF:\n\`\`\`diff\n${gitInfo.diff.substring(0, 3000)}\n\`\`\`\n\n`;
    
    if (gitInfo.recentCommits && gitInfo.recentCommits !== 'No commit history yet') {
        prompt += `RECENT COMMITS:\n${gitInfo.recentCommits}\n\n`;
    }
    
    prompt += `Please provide a brief analysis covering:\n`;
    prompt += `1. Potential risks or bugs\n`;
    prompt += `2. Security concerns\n`;
    prompt += `3. Code quality issues\n`;
    prompt += `4. Suggestions for improvement\n`;
    
    return prompt;
}

function callCopilot(prompt) {
    print(COLORS.blue, '🤖', 'Consulting GitHub Copilot...');
    
    try {
        // Test if Copilot CLI is available
        try {
            runCommand('gh copilot --help 2>nul', null);
        } catch {
            print(COLORS.yellow, '⚠️', 'GitHub Copilot CLI might not be configured');
            print(COLORS.yellow, '💡', 'Run: gh auth login && gh extension install github/gh-copilot');
            return null;
        }
        
        // Escape the prompt for Windows CMD
        const escapedPrompt = escapeForCmd(prompt);
        
        // Use gh copilot -p with the escaped prompt
        // Note: We're using 2>nul to suppress stderr noise
        const command = `gh copilot -p "${escapedPrompt}" 2>nul`;
        
        print(COLORS.magenta, '🌀', 'Analyzing with AI (this may take 10-20 seconds)...');
        
        const startTime = Date.now();
        const response = runCommand(command, 'Failed to call GitHub Copilot');
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (!response || response.trim() === '') {
            // Try alternative method if first attempt fails
            return tryAlternativeMethod(prompt);
        }
        
        print(COLORS.green, '✅', `Analysis completed in ${elapsedTime}s`);
        return response;
        
    } catch (error) {
        print(COLORS.red, '❌', `Copilot execution failed: ${error.message}`);
        print(COLORS.yellow, '💡', 'Make sure GitHub Copilot CLI is installed: gh extension install github/gh-copilot');
        return null;
    }
}

function tryAlternativeMethod(prompt) {
    // Alternative: Write to temp file and use with -p
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    
    try {
        const tempFile = path.join(os.tmpdir(), `crystalball_${Date.now()}.txt`);
        fs.writeFileSync(tempFile, prompt, 'utf8');
        
        // Read file and pass to copilot
        const fileContent = fs.readFileSync(tempFile, 'utf8');
        const escapedContent = escapeForCmd(fileContent);
        const response = runCommand(`gh copilot -p "${escapedContent}" 2>nul`, null);
        
        // Clean up
        try { fs.unlinkSync(tempFile); } catch {}
        
        return response;
    } catch (error) {
        print(COLORS.red, '❌', 'Alternative method also failed');
        return null;
    }
}

function displayHeader() {
    console.clear();
    console.log(COLORS.cyan + '='.repeat(60) + COLORS.reset);
    print(COLORS.cyan + COLORS.bold, '🔮', 'GitHub Copilot Commit Crystal Ball');
    console.log(COLORS.cyan + '='.repeat(60) + COLORS.reset);
    print(COLORS.cyan, '', 'Analyzing staged changes for risks and issues\n');
}

function main() {
    displayHeader();
    
    // Step 1: Check prerequisites
    print(COLORS.blue, '🔍', 'Checking prerequisites...');
    checkPrerequisites();
    
    // Step 2: Get git information
    print(COLORS.blue, '📊', 'Checking Git repository...');
    const gitInfo = getGitInfo();
    
    if (!gitInfo.hasStagedChanges) {
        print(COLORS.yellow, '⚠️', 'No staged changes found');
        print(COLORS.yellow, '💡', 'Stage your changes first: git add <files>');
        print(COLORS.yellow, '💡', 'Then run: node crystalball.js');
        exit(0);
    }
    
    print(COLORS.green, '✅', `Found ${gitInfo.fileCount} staged file(s): ${gitInfo.fileList}`);
    
    // Step 3: Build prompt
    print(COLORS.blue, '📝', 'Building analysis prompt...');
    const prompt = buildPrompt(gitInfo);
    
    // Step 4: Call Copilot
    const analysis = callCopilot(prompt);
    
    // Step 5: Display results
    console.log('\n' + COLORS.cyan + '='.repeat(60) + COLORS.reset);
    print(COLORS.cyan + COLORS.bold, '📋', 'COPILOT ANALYSIS RESULTS');
    console.log(COLORS.cyan + '='.repeat(60) + COLORS.reset + '\n');
    
    if (analysis && analysis.trim() !== '') {
        console.log(analysis);
        console.log('\n' + COLORS.cyan + '='.repeat(60) + COLORS.reset);
        print(COLORS.green, '✅', 'Analysis complete!');
        print(COLORS.yellow, '💡', 'Review suggestions before committing.');
    } else {
        print(COLORS.yellow, '⚠️', 'Could not get analysis from Copilot');
        print(COLORS.yellow, '💡', 'Try running manually:');
        console.log(COLORS.cyan + '  git diff --cached | gh copilot explain' + COLORS.reset);
        console.log(COLORS.cyan + '  OR' + COLORS.reset);
        console.log(COLORS.cyan + '  gh copilot -p "Analyze my git changes"' + COLORS.reset);
    }
    
    console.log(); // Empty line at end
}

// Run with error handling
try {
    main();
} catch (error) {
    print(COLORS.red, '💥', `Script failed: ${error.message}`);
    exit(1);
}