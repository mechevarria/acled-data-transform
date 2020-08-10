'use strict';

const fs = require('fs');
const os = require('os');
const StreamZip = require('node-stream-zip');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const moment = require('moment');

function parseCsv() {
    const csvFile = 'acled.csv';
    const content = fs.readFileSync(`${os.tmpdir()}/${csvFile}`);
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        to_line: 200000,
        on_record: (record) => {
            record['geolocation'] = `POINT (${record['longitude']} ${record['latitude']})`;
            const momentDate = moment(record['event_date'], 'DD MMM YYYY').format('YYYYMMDD');
            record['event_date'] = momentDate.toString();

            const momentUtc = moment.unix(record['timestamp']).utc();
            record['timestamp'] = momentUtc.format();

            delete record['data_id'];
            delete record['event_id_no_cnty'];
            delete record['time_precision'];
            delete record['inter1'];
            delete record['inter2'];
            delete record['interaction'];
            delete record['soruce_scale'];
            delete record['geo_precision'];
            delete record['source_scale'];
            delete record['admin1'];
            delete record['admin2'];
            delete record['admin3'];

            return record;
        }
    });

    console.info(`${csvFile} has ${records.length} records`);

    const outputFile = 'event.csv';
    fs.writeFileSync(outputFile, stringify(records, {
        header: true
    }));

    console.info(`Deleting ${csvFile}`);
    fs.unlinkSync(`${os.tmpdir()}/${csvFile}`);
}

const zipFile = './acled.zip';
const zip = new StreamZip({
    file: zipFile,
    storeEntries: true
});

zip.on('ready', () => {
    zip.extract(null, os.tmpdir(), (err, count) => {
        console.log(err ? 'Extract error' : `Extracted ${count} file from ${zipFile} to ${os.tmpdir()}`);
        zip.close();
        parseCsv();
    });
});
