const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src', 'app'));

let changed = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('`${BASE_URL}')) {
        content = content.replace(/\`\$\{BASE_URL\}/g, '`/api-proxy');
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Done. Updated ${changed} files.`);
