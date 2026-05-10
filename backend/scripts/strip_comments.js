const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'js');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove full line comments (lines that start with optional whitespace and //)
    content = content.replace(/^\s*\/\/.*(?:\r\n|\n)?/gm, '');
    
    // Remove inline comments. Negative lookbehind for ":" to avoid stripping "http://"
    content = content.replace(/(?<!:)\s*\/\/.*$/gm, '');

    // Remove multi-line comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    fs.writeFileSync(filePath, content);
});

console.log('Successfully removed comments from all JS files:', files.join(', '));
