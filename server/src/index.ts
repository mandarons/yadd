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

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';
import cronJobs from './controllers/cron-jobs';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(path.join(__dirname, '..', 'public'))));
app.use('/', routes);
cronJobs.enableServiceStatusRefresh();
const PORT = 3334;
let service = null;

/* istanbul ignore if */
if (require.main === module) {
    service = app.listen(PORT, '0.0.0.0', () => {
        console.info(`Service is listening on port ${PORT}.`);
    });
}

export default {
    service,
    app
};