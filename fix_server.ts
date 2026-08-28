import fs from 'fs';
let serverCode = fs.readFileSync('server.ts', 'utf8');

// Find the bad block:
//      }
//      res.json({ success: true, data });
//    } catch (error: any) {
//      console.error("Prescription API Error:", error); fs.appendFileSync("server_errors.log", "Prescription API Error: " + error.message + "\n");
//      res.status(500).json({ error: "Failed to insert prescription", details: error.message });
//    }
//  });
const badRegex = /\s*\}\s*res\.json\(\{ success: true, data \}\);\s*\} catch \(error: any\) \{\s*console\.error\("Prescription API Error:".*?\}\s*\n*\s*\n*\s*\n*\s*\n*\s*\n*\s*\}\s*\n*  \}\);\n/g;

serverCode = serverCode.replace(/      \}\n      res\.json\(\{ success: true, data \}\);\n    \} catch \(error: any\) \{\n      console\.error\("Prescription API Error:", error\); fs\.appendFileSync\("server_errors\.log", "Prescription API Error: " \+ error\.message \+ "\\n"\);\n      res\.status\(500\)\.json\(\{ error: "Failed to insert prescription", details: error\.message \}\);\n    \}\n  \}\);/g, '');

fs.writeFileSync('server.ts', serverCode);
