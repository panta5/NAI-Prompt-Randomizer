const express = require('express');
const cors = require('cors');
const request = require('request');
const fs = require('fs');
const path = require('path');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const port = process.env.PORT || 3000;

let logs = [];

let app = express();
let tagDataLength = 0;
let posDataLength = 0;

/* Rate Limiter */
const opts = {
    points: 30, // 6 points
    duration: 1, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

app.use((req, res, next) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
});

/* Status Monitor */
app.use(require('express-status-monitor')());

/* Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* CORS */
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);

/* Static Files */
app.use('/test', express.static(__dirname + '/test'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/', express.static(__dirname + '/favicon'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/dataset', express.static(__dirname + '/dataset'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/node_modules/argon2-browser/dist', express.static(__dirname + '/node_modules/argon2-browser/dist'));
app.use('/node_modules/unzipit/dist', express.static(__dirname + '/node_modules/unzipit/dist'));

/* Routes */
app.post('/readTags', async function (req, res, next) {
    let pos = req.body.pos;

    if (pos == undefined || typeof pos != 'number' || pos < 0 || pos > tagDataLength) {
        res.send([]);
        return;
    }

    let prompt = await getPromptFromPos(pos);
    res.send(prompt);
});

app.get('/logs', function (req, res, next) {
    let str = '';
    for (let i = 0; i < logs.length; i++) {
        str += '<p>' + logs[i] + '</p>';
    }

    // res.send(str);
    res.sendStatus(403);
});

app.post('/api*', function (req, res, next) {
    request(
        'https://api.novelai.net' + req.url.substring(4),
        {
            method: 'POST',
            json: req.body,
            headers: {
                Authorization: req.headers.authorization,
                'Content-Type': 'application/json',
            },
        },
        function (error, response, body) {
            if (response.statusCode != 200) {
                log(String(response.statusCode) + ') ' + req.url.substring(4) + ' error: ' + body.message);
            }
        },
    ).pipe(res);
});

app.post('/test', function (req, res, next) {
    console.log('REQUEST');
    res.send('OK');
});

app.post('/generate-image', function (req, res, next) {
    request(
        'https://image.novelai.net/ai/generate-image',
        {
            method: 'POST',
            json: req.body,
            headers: {
                Authorization: req.headers.authorization,
                'Content-Type': 'application/json',
            },
        },
        function (error, response, body) {
            if (response.statusCode != 200) {
                log('(' + String(response.statusCode) + ') Generate image error: ' + body.message);
            } else {
                log('Generate image: ' + req.body.input);
            }
        },
    ).pipe(res);
});

app.get('/api*', function (req, res, next) {
    request(
        {
            url: 'https://api.novelai.net' + req.url.substring(4),
            headers: {
                Authorization: req.headers.authorization,
            },
        },
        function (error, response, body) {
            if (response.statusCode != 200) {
                log(String(response.statusCode) + ') ' + req.url.substring(4) + ' error: ' + body.message);
            }
        },
    ).pipe(res);
});

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

/* Functions */
async function getPromptFromPos(pos) {
    let start = pos;
    let end = pos;

    for (end = pos; end < tagDataLength; end++) {
        if ((await read('tags.csv', end, end + 1)) == 0x0a) {
            break;
        }
    }

    let data = await read('tags.csv', start, end);
    let str = new TextDecoder('utf-8').decode(data);

    return str;
}

async function read(fileName, start, end) {
    const stream = fs.createReadStream(path.join(__dirname, 'dataset', fileName), {
        start: start,
        end: end,
        highWaterMark: end - start,
    });
    return new Promise(function (resolve, reject) {
        stream.on('data', function (chunk) {
            resolve(new Uint8Array(chunk.buffer));
        });
    });
}

function init() {
    tagDataLength = fs.statSync(path.join(__dirname, 'dataset', 'tags.csv')).size;
    console.log('Tag data length: ' + tagDataLength);

    posDataLength = fs.statSync(path.join(__dirname, 'dataset', 'pos.csv')).size;

    // Load key.csv
    key = fs.readFileSync(path.join(__dirname, 'dataset', 'key.csv'), 'utf8');
    key = key.split('\n');
    for (let i = 0; i < key.length; i++) {
        key[i] = key[i].split('|');
        key[i][1] = parseInt(key[i][1]);
    }

    log('Server started');
}

function log(str) {
    let date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });

    str = '(' + date + ') ' + str;
    logs.unshift(str);

    if (logs.length > 30) {
        logs.pop();
    }
}

app.listen(port, function () {
    console.log(`Server is running on http://127.0.0.1:${port}`);
    init();
});
