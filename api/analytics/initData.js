// packages
var fs = require('fs');

// imports
var schema = require('./data/storage-schema.json');

(function initData() {
    // reset storage.json to blank schema everytime server restarts
    fs.writeFileSync('./api/analytics/data/storage.json', JSON.stringify(schema, null, 4));
})();
