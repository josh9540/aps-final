const fs = require('fs');
module.exports = (str, url) => {
    fs.writeFile(('./images/' + url), str, 'base64', function(err) {
        if (err) throw err;
    });
}