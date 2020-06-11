const fs = require('fs');

const deleteFile = (filePath) => {
    try {
        fs.unlink(filePath, (err) => {
            if (err) {
                throw err;
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.deleteFile = deleteFile;