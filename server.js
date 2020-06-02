'use strict';

const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

const zipFile = './acled.zip';
const zip = new AdmZip(zipFile);

console.info(`extracting ${zipFile} to ${os.tmpdir()}`);
zip.extractAllTo(os.tmpdir(), true);

const csvFile = 'acled.csv';
const content = fs.readFileSync(`${os.tmpdir()}/${csvFile}`);
const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    to_line: 300000,
    on_record: (record) => {
        record['geolocation'] = `POINT (${record['longitude']} ${record['latitude']})`;

        delete record['data_id'];
        delete record['iso'];
        delete record['event_id_no_cnty'];
        delete record['time_precision'];
        delete record['inter1'];
        delete record['inter2'];
        delete record['interaction'];
        delete record['soruce_scale'];
        delete record['geo_precision'];
        delete record['iso3'];
        delete record['source_scale'];
        delete record['admin1'];
        delete record['admin2'];
        delete record['admin3'];

        return record;
    }
});

console.info(`${csvFile} has ${records.length} records`);

fs.writeFileSync('event.csv', stringify(records, {
    header: true
}));

console.info(`Deleting ${csvFile}`);
fs.unlinkSync(`${os.tmpdir()}/${csvFile}`);
