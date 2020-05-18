'use strict';

const fs = require('fs');
const AdmZip = require('adm-zip');

const zipFile = './2019-acled.zip';

if (fs.existsSync(zipFile)) {
    console.info(`${zipFile} already extracted.`);
} else {
    console.info(`extracting ${zipFile}`);
    const zip = new AdmZip('./2019-acled.zip');
    zip.extractAllTo('./node_temp', true);
}

