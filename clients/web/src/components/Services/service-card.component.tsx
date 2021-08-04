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

import React from 'react';
import { IProxyResponse, IService } from './constants';
import { FaPen } from 'react-icons/fa';
import { EditServiceComponent } from './service-edit.component';
import { getServiceStatus } from './proxy';
const SERVICE_STATUS_REFRESH_INTERVAL_IN_MS = 10000;
interface IProps {
    service: IService;
};
interface IState {
    isOnline: boolean;
    lastOnline: string | null;
};
const ServiceCardComponent = (props: IProps) => {
    const [showModal, setShowModal] = React.useState(false);
    const [state, setState] = React.useState<IState>({
        isOnline: props.service.online!,
        lastOnline: props.service.lastOnline || null
    });
    const shortName = props.service.shortName.toString();
    // const shortName = props.service.shortName;
    React.useEffect(() => {
        const timer = setInterval(async () => {
            const response: IProxyResponse = await getServiceStatus(shortName);
            if (response.success === false) {
                // TODO: Notify service status check failed
                console.error(response.errorMessage);
            } else {
                setState({
                    lastOnline: response.status!.lastOnline,
                    isOnline: response.status!.online
                });
            }
        }, SERVICE_STATUS_REFRESH_INTERVAL_IN_MS);
        return () => {
            clearInterval(timer);
        };
    }, [shortName]);
    const service = props.service;
    return (
        <div className={'relative flex rounded-xl shadow-lg overflow-hidden m-4'}>
            <a id={`link${service.shortName}`} target='_blank' href={service.url} rel='noreferrer' className="flex">
                <div className="h-16 w-16">
                    <img id={`img${service.shortName}`} alt={`Icon of ${service.shortName}`} src={service.logoURL} />
                </div>
            </a>
            <div id={`status${service.shortName}`} className={`flex flex-col px-4 py-2 h-16 w-full text-white ${state.isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
                <span id={`text${service.shortName}Name`} className="text-xl">{service.name}</span>
                <div className={'flex flex-row justify-between'}>
                    <span id={`text${service.shortName}ShortName`} className="text-sm mr-2">{service.shortName}</span>
                    <FaPen id={`btn${service.shortName}Edit`} className="cursor-pointer" onClick={e => setShowModal(true)} />
                </div>
            </div>
            {showModal ?
                <div className={'absolute right-6 mt-4 py-2 border border-gray-500 bg-gray-100 rounded shadow-2xl z-10'}>
                    <EditServiceComponent {...service} setShowModal={(show: boolean) => setShowModal(show)} />
                </div> : null}
        </div>
    );
};

export default ServiceCardComponent;