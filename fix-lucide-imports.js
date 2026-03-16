const fs = require('fs');
const path = require('path');

const files = [
    'client/src/app/(system)/whiteboard/test/page.tsx',
    'client/src/app/(system)/whiteboard/[id]/page.tsx',
    'client/src/app/(system)/profile/page.tsx',
    'client/src/app/(system)/(auth)/login/page.tsx',
    'client/src/app/auth/callback/page.tsx',
    'client/src/app/(lms)/learn/[courseSlug]/page.tsx',
    'client/src/app/(lms)/instructors/[slug]/page.tsx',
    'client/src/app/loading.tsx',
    'client/src/components/AdminGuard.tsx',
    'client/src/components/system/dashboard/RedeemCode.tsx',
    'client/src/components/VideoPlayer.tsx',
    'client/src/components/system/admin/EbookEditModal.tsx',
    'client/src/app/(system)/admin/ebooks/page.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if lucide-react import exists
    if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
        // Merge Loader2 into it if not exists
        if (!content.includes('Loader2')) {
            content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];?/, (m, p1) => {
                const imports = p1.trim().split(/,\s*/);
                if (!imports.includes('Loader2')) {
                    imports.push('Loader2');
                }
                return `import { ${imports.join(', ')} } from 'lucide-react';`;
            });
            fs.writeFileSync(file, content);
            console.log('Fixed import in:', file);
        }
    } else {
        // Add new lucide-react import
        if (content.includes('Loader2')) {
           // Insert after 'use client' or React import
           const insertionPoint = content.indexOf("'use client'") !== -1 ? content.indexOf('\n', content.indexOf("'use client'")) + 1 : 0;
           content = content.substring(0, insertionPoint) + "import { Loader2 } from 'lucide-react';\n" + content.substring(insertionPoint);
           fs.writeFileSync(file, content);
           console.log('Added import in:', file);
        }
    }
});
