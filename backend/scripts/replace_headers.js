const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace <h2 class="teacher">Admin Panel</h2>\n<p class="sidebar-subtitle">Teacher Portal</p>
    content = content.replace(/<h2 class="teacher">Admin Panel<\/h2>\s*<p class="sidebar-subtitle">Teacher Portal<\/p>/g, '<h2>Teacher Portal</h2>');
    
    // Replace <h2 class="teacher">Teacher Portal</h2>
    content = content.replace(/<h2 class="teacher">Teacher Portal<\/h2>/g, '<h2>Teacher Portal</h2>');
    
    // Replace <h2>Admin Panel</h2>
    content = content.replace(/<h2>Admin Panel<\/h2>\s*<p class="sidebar-subtitle">Teacher Portal<\/p>/g, '<h2>Teacher Portal</h2>');
    
    fs.writeFileSync(filePath, content);
});
console.log('Replaced sidebar headers in HTML files.');
