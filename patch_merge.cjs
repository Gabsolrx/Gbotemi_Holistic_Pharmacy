const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/services/productService.ts', 'utf-8');

const oldMerge = `        // Remote products take precedence
        list.forEach(p => mergedMap.set(p.id, p));
        // Include any local items not yet in remote
        localList.forEach(p => {
          if (!mergedMap.has(p.id)) {
            mergedMap.set(p.id, p);
          }
        });`;

const newMerge = `        // Merge based on most recent updated_at timestamp
        localList.forEach(p => mergedMap.set(p.id, p));
        
        list.forEach(remoteProduct => {
          const localProduct = mergedMap.get(remoteProduct.id);
          if (!localProduct) {
            mergedMap.set(remoteProduct.id, remoteProduct);
          } else {
            // Compare timestamps, prefer the more recently updated one
            const remoteTime = new Date(remoteProduct.updated_at || remoteProduct.created_at || 0).getTime();
            const localTime = new Date(localProduct.updated_at || localProduct.created_at || 0).getTime();
            
            if (remoteTime > localTime) {
              mergedMap.set(remoteProduct.id, remoteProduct);
            }
          }
        });`;

content = content.replace(oldMerge, newMerge);
fs.writeFileSync('/app/applet/src/services/productService.ts', content);
