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

import { useEffect } from 'react';
import Plausible from 'plausible-tracker';

const FooterComponent = () => {
    const { enableAutoPageviews, enableAutoOutboundTracking } = Plausible({
        domain: 'yadd.mandarons',
        apiHost: 'https://bea26a2221fd8090ea38720fc445eca6.mandarons.com',
        trackLocalhost: true
    });
    const cleanupAutoPageviews = enableAutoPageviews();
    const cleanupAutoOutboundTracking = enableAutoOutboundTracking();
    useEffect(() => {
        return () => {
            cleanupAutoPageviews();
            cleanupAutoOutboundTracking();
        };
    }, [cleanupAutoPageviews, cleanupAutoOutboundTracking]);
    return (
        <footer id={'footer'} className="h-10 text-center">
            <a className={'text-blue-400'} href={'https://github.com/mandarons/yadd'}>GitHub</a>
        </footer>
    );
};

export default FooterComponent;