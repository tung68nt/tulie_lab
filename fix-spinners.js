const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./client/src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanged = false;

    // Pattern for matching: <div className="... animate-spin ... border-t-transparent ..." />
    // or <div className="... animate-spin ..."></div>
    const regex = /<div\s+className=["'](?:[^"']*)animate-spin(?:[^"']*)["'][^>]*>(?:<\/div>)?/g;
    
    // Also match self-closing 
    // <div className="..." />
    const selfClosingRegex = /<div\s+className=["'](?:[^"']*)animate-spin(?:[^"']*)["'][^>]*\/>/g;

    let match;
    let modifiedContent = content;

    while ((match = regex.exec(content)) !== null) {
        if (match[0].includes('border-')) {
            // Found a div spinner
            const fullMatch = match[0];
            
            // Extract sizing classes
            let wClass = 'w-8';
            let hClass = 'h-8';
            let colorClass = 'text-primary';
            let otherClasses = [];

            const wMatch = fullMatch.match(/w-(\d+|full|screen)/);
            if (wMatch) wClass = wMatch[0];
            
            const hMatch = fullMatch.match(/h-(\d+|full|screen)/);
            if (hMatch) hClass = hMatch[0];

            if (fullMatch.includes('border-muted-foreground')) colorClass = 'text-muted-foreground';
            else if (fullMatch.includes('border-zinc-900') || fullMatch.includes('border-foreground')) colorClass = 'text-foreground';
            else if (fullMatch.includes('border-current')) colorClass = 'text-current';
            else if (fullMatch.includes('border-white')) colorClass = 'text-white';

            if (fullMatch.includes('mx-auto')) otherClasses.push('mx-auto');
            if (fullMatch.includes('mb-4')) otherClasses.push('mb-4');
            if (fullMatch.includes('mb-3')) otherClasses.push('mb-3');
            if (fullMatch.includes('mr-2')) otherClasses.push('mr-2');
            
            const replacement = `<Loader2 className="animate-spin ${wClass} ${hClass} ${colorClass} ${otherClasses.join(' ')}" />`;
            
            modifiedContent = modifiedContent.replace(fullMatch, replacement);
            hasChanged = true;
        }
    }

    if (hasChanged) {
        // Need to import Loader2
        if (!modifiedContent.includes('Loader2')) {
            // Find lucide-react import
            if (modifiedContent.includes('from \'lucide-react\'')) {
                modifiedContent = modifiedContent.replace(/import\s+{([^}]+)}\s+from\s+'lucide-react'/, (m, p1) => {
                    return `import { ${p1.trim()}, Loader2 } from 'lucide-react'`;
                });
            } else if (modifiedContent.includes('from "lucide-react"')) {
                modifiedContent = modifiedContent.replace(/import\s+{([^}]+)}\s+from\s+"lucide-react"/, (m, p1) => {
                    return `import { ${p1.trim()}, Loader2 } from "lucide-react"`;
                });
            } else {
                // Add new import after React
                const importMatch = modifiedContent.match(/import\s+.*?['"].*?['"];?\n/);
                if (importMatch) {
                    modifiedContent = modifiedContent.substring(0, importMatch.index + importMatch[0].length) + 
                                      "import { Loader2 } from 'lucide-react';\n" + 
                                      modifiedContent.substring(importMatch.index + importMatch[0].length);
                } else {
                    modifiedContent = "import { Loader2 } from 'lucide-react';\n" + modifiedContent;
                }
            }
        }
        
        fs.writeFileSync(file, modifiedContent);
        console.log('Fixed:', file);
        changedCount++;
    }
});

console.log(`Total files modified: ${changedCount}`);
