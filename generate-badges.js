/*
MIT License

Copyright (c) 2021 Mandar Patil (mandarons@pm.me)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const fs = require('fs');
const https = require('https');

const testSummary = JSON.parse(fs.readFileSync('./allure-report/widgets/summary.json'));
const testResult = testSummary.statistic.total === testSummary.statistic.passed;
const badgesDirectory = './badges';
if (fs.existsSync(badgesDirectory)) {
    fs.rmSync(badgesDirectory, { recursive: true, force: true });
    fs.mkdirSync(badgesDirectory);
} else {
    fs.mkdirSync(badgesDirectory);
}

https.get(`https://img.shields.io/static/v1?label=Tests&message=${testResult ? 'Passing&color=brightgreen' : 'Failing&color=critical'}`, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => fs.writeFileSync(`${badgesDirectory}/tests.svg`, data));
    response.on('error', error => console.error(error.toString()));
});

const coverageSummary = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json'));
const coveragePercentage = coverageSummary.total.lines.pct;
const coverageResult = coveragePercentage === 100;
const requestString = `https://img.shields.io/static/v1?label=Coverage&message=${coverageResult ? coveragePercentage.toString() + '%&color=brightgreen' : coveragePercentage.toString() + '%&color=critical'}`;
https.get(requestString, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => fs.writeFileSync(`${badgesDirectory}/coverage.svg`, data));
    response.on('error', error => console.error(error.toString()));
});
