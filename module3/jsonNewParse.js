const lineReader = require('line-reader');

lineReader.eachLine('../../project3Data_07_07_18/projectRecordsJSON.json', (line, last) => {
        currentLine = line.toString().replace(/'/g, "\"", "g");
        jsonRecord = JSON.parse(currentLine);
        productObj = {
                asin: jsonRecord.asin,
                productName: jsonRecord.title,
                group: jsonRecord.categories[0],
                productDescription: jsonRecord.description
        };
        console.log(JSON.stringify(productObj))
});
