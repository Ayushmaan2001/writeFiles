const express = require('express');
const tmp = require('tmp-promise');
const bodyParser = require("body-parser");
const fs = require('fs')
const {
    readFileSync
} = require('fs');
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// async function run() {
//     const dir = await tmp.dir({ unsafeCleanup: true }); // used to store the sorted groups 
//     console.log('Using temporary directory:', dir.path);

//     try {
//         const comparator = (x, y) => Number(x) - Number(y); // x and y are always strings
//         const separator = ' '; // the string used to separate each item

//         const inputStream = new FileInputStream('text/input.txt', separator);

//         const splitter = new Splitter({
//             maxGroupSize: 10, // maximum number of items in a group
//             groupOutputStreamCreator: index => new FileOutputStream(`${dir.path}/group-${index}`, separator), // how to create a file for each sorted group
//             comparator
//         });

//         const sortedGroupsInputStreams = await splitter.splitAndOutputSortedGroups(inputStream);

//         const outputStream = new FileOutputStream('text/output.txt', separator);
//         const merger = new Merger(comparator);
//         await merger.merge(sortedGroupsInputStreams, outputStream);
//     } catch (err) {
//         console.error('Error occured while sorting', err);
//     } finally {
//         dir.cleanup();
//         console.log('Temporary directory deleted');
//     }
// }

function ArrayFinalOutput(arr, fileName, cmp, swap, check) {
    if (check === 1) {
        fs.writeFile("text" + "/" + `${fileName}`, '', function () {
            console.log('done')
        })
    }
    fs.appendFileSync("text" + "/" + `${fileName}`, `Comparisons:${cmp} Swaps:${swap}\n  ${arr}`, "UTF-8", {
        'flags': 'a'
    })
    fs.readFile("sample.txt", (err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log("Data read : ", data.toString())
    })
}


function WriteFiles(array, fileName) {
    fs.truncate(`${fileName}`, 0, () => {});
    var file = fs.createWriteStream("text" + "/" + `${fileName}`);
    for (let i = 0; i < array.length; i++) {
        file.write(array[i] + ' ')
    }
    file.end();
}

app.post('/write_files', (req, res) => {
    let fileName = req.body.fileName
    let array = req.body.array;
    WriteFiles(array, fileName);
    res.send('done writing')
})

app.post('/array_final', (req, res) => {
    let fileName = req.body.fileName;
    let array = req.body.array;
    let cmp = req.body.cmp;
    let swap = req.body.swap;
    let check = req.body.check;
    ArrayFinalOutput(array, fileName, cmp, swap, check);
    res.send('done writing')
})

app.post('/download', (req, res) => {
    let fileName = req.body.fileName;
    res.download("text" + "/" + `${fileName}`);
})

app.listen(PORT, () => {
    console.log('running');
})