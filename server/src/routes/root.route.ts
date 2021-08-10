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
import * as db from '../db/services.schema';
import utils from './route.utils';

const Router = express.Router();

Router.get('/favicon.ico', (req, res) => res.status(204).end());
Router.get('/:name', async (req, res) => {
    const fromDB = await db.findURLByShortName(req.params.name);
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    }
    const url = fromDB.data !== undefined ? (fromDB.data as { [key: string]: string; }).url : undefined;
    if (url === undefined) {
        return utils.errorResponse(res, 404, 'Service not found.', {
            shortName: req.params.name
        });
    }
    return res.send(`
    <head>
    <script async defer data-domain="yadd.mandarons" src="https://bea26a2221fd8090ea38720fc445eca6.mandarons.com/js/plausible.js"></script>
    <meta http-equiv="refresh" content="0; URL=${url}" />
    </head>
    `);
});


export default Router;