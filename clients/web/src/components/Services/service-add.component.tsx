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

import React, { useState } from 'react';
import { postService } from './proxy';
import { connect } from 'react-redux';
import { Dispatch } from '../../store/index';
import { alertActions } from '../Alerts/action';
import { IProxyResponse } from './constants';
import { fetchServicesAction } from './action';

interface IProps {
    handleCreateCancel: (e: React.SyntheticEvent) => void;
    dispatch: Dispatch;
};

const NewServiceComponent = (props: IProps) => {
    const [state, setState] = useState({
        name: '',
        shortName: '',
        url: '',
        logoURL: '',
        message: ''
    });
    const getTargetValue = (event: React.SyntheticEvent): string => {
        return (event.target as typeof event.target & { value: string; }).value;
    };
    const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
        event.preventDefault();
        const response: IProxyResponse = await postService(state);
        if (response.success === true) {
            props.dispatch(alertActions.alertActionSuccess(`New service ${state.name} created.`));
            props.dispatch(fetchServicesAction());
            props.handleCreateCancel(event);
        } else {
            setState({
                ...state,
                message: response.errorMessage as string
            });
        }
    };
    const render = () => {
        return (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                                <h3 id={'textNewService'} className="text-2xl font-semibold float-left">New Service</h3>
                                <button id={'btnCloseNewService'} className="text-red-500 p-1 h-6 w-6 ml-auto border-0 float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                                    onClick={props.handleCreateCancel}>
                                    <span id={'spanCloseNewServiceIcon'} className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                </button>
                            </div>
                            {/*body*/}
                            <div className="relative p-2 flex-auto">
                                <form className={'grid grid-cols-5'}>
                                    <div className="relative w-full mb-3 col-span-2 p-2">
                                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceName">Name</label>
                                        <input id="inputNewServiceName" type="text" name='serviceName' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                            placeholder="e.g. Google Search" style={{ transition: "all .15s ease" }}
                                            value={state.name} onChange={e => setState({ ...state, name: getTargetValue(e) })} />
                                    </div>
                                    <div className="relative w-full mb-3 col-span-3 p-2">
                                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceURL">URL</label>
                                        <input id="inputNewServiceURL" type="text" name='serviceURL' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                            placeholder="e.g. https://google.com" style={{ transition: "all .15s ease" }}
                                            value={state.url} onChange={e => setState({ ...state, url: getTargetValue(e) })} />
                                    </div>
                                    <div className="relative w-full mb-3 col-span-2 p-2">
                                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceShortName">Short Name</label>
                                        <input id="inputNewServiceShortName" type="text" name='serviceShortName' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                            placeholder="e.g. google" style={{ transition: "all .15s ease" }}
                                            value={state.shortName} onChange={e => setState({ ...state, shortName: getTargetValue(e) })} />
                                    </div>
                                    <div className="relative w-full mb-3 col-span-3 p-2">
                                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceLogoURL">Logo URL</label>
                                        <input id="inputNewServiceLogoURL" type="text" name='serviceLogoURL' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                            placeholder="e.g. /icons/adminer.png" style={{ transition: "all .15s ease" }}
                                            value={state.logoURL} onChange={e => setState({ ...state, logoURL: getTargetValue(e) })} />
                                    </div>
                                </form>
                                <span id="textNewServiceMessage" className='text-sm p-2 text-red-500'>{state.message}</span>
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button id="btnNewServiceClose" className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button" onClick={props.handleCreateCancel}>Close</button>
                                <button id="btnNewServiceCreate" className="bg-yadd-pink text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button" onClick={handleSubmit}>Create Service</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </>
        );
    };
    return render();
};

const connectedComponet = connect()(NewServiceComponent);

export { connectedComponet as NewServiceComponent };