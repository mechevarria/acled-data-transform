'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const AdmZip = require('adm-zip');
const parse = require('csv-parse/lib/sync');

const zipFile = './acled.zip';
const zip = new AdmZip(zipFile);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'acled-'));

console.info(`extracting ${zipFile} to ${tempDir}`);
zip.extractAllTo(tempDir, true);

const csvFile = 'acled.csv';
const content = fs.readFileSync(`${tempDir}/${csvFile}`);
const records = parse(content, {
    columns: true,
    skip_empty_lines: true
});

console.info(`${csvFile} has ${records.length} records`);

console.info(`Deleting ${csvFile}`);
fs.unlinkSync(`${tempDir}/${csvFile}`);
console.info(`Deleting ${tempDir}`);
fs.rmdirSync(tempDir);
