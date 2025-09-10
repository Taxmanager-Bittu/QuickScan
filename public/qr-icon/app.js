const fs = require("fs");
const path = require("path");

const rootFolder = "./"; // qr-icon ke andar run kar rahe ho
const allSVGs = [];

// Function to clean names and handle duplicates in the same folder
function cleanName(name, folderFiles) {
    const ext = path.extname(name);
    const base = path.basename(name, ext);

    let cleanBase = base
        .replace(/\s+/g, "-")        // spaces → dash
        .replace(/[^a-zA-Z\-]/g, "") // only letters and dash
        .replace(/-+/g, "-")         // multiple dashes → single dash
        .replace(/^-|-$/g, "");      // remove leading/trailing dash

    if (!cleanBase) cleanBase = "untitled";

    let finalName = cleanBase + ext;
    let counter = 1;

    // Check duplicates in same folder
    while (folderFiles.has(finalName.toLowerCase())) {
        finalName = `${cleanBase}-${counter}${ext}`;
        counter++;
    }

    folderFiles.add(finalName.toLowerCase());
    return finalName;
}

// Recursive function to walk through directories
function walkDir(dir) {
    const folderFiles = new Set(); // Track duplicates in this folder

    fs.readdirSync(dir).forEach(item => {
        const oldPath = path.join(dir, item);
        const stats = fs.statSync(oldPath);

        // Skip hidden/system files
        if (item.startsWith(".")) return;

        const newItem = cleanName(item, folderFiles);
        const newPath = path.join(dir, newItem);

        // Rename if name changed
        if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${oldPath} → ${newPath}`);
        }

        if (stats.isDirectory()) {
            walkDir(newPath); // Recursive call
        } else if (path.extname(newItem).toLowerCase() === ".svg") {
            allSVGs.push(path.relative(rootFolder, newPath).replace(/\\/g, "/"));
        }
    });
}

// Run the scan
walkDir(rootFolder);

// Save svgs.json in root folder
const jsonPath = path.join(rootFolder, "svgs.json");
fs.writeFileSync(jsonPath, JSON.stringify(allSVGs, null, 2));
console.log(`✅ svgs.json generated at ${jsonPath}`);
console.log(`Total SVGs: ${allSVGs.length}`);
