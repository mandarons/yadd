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
import { putService, deleteService } from './proxy';
import { connect } from 'react-redux';
import { Dispatch } from '../../store/index';
import { alertActions } from '../Alerts/action';
import { fetchServicesAction } from './action';

interface IProps extends IService {
    setShowModal: (show: boolean) => void;
    dispatch: Dispatch;
};
interface IState extends IProps {
    message: string;
    deleteConfirmation: number;
};
const EditServiceComponent = (props: IProps) => {
    const [state, setState] = React.useState<IState>({ ...props, message: '', deleteConfirmation: 0 });
    const getTargetValue = (event: React.SyntheticEvent): string => {
        return (event.target as typeof event.target & { value: string; }).value;
    };
    const handleDelete = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (state.deleteConfirmation < 1) {
            setState({
                ...state,
                message: `Click 'DELETE SERVICE' again to permanently delete ${props.name}.`,
                deleteConfirmation: state.deleteConfirmation + 1
            });
        } else {
            //TODO: Submit action to server, display message
            const response: IProxyResponse = await deleteService(state.shortName);
            if (response.success === false) {
                setState({
                    ...state,
                    message: response.errorMessage as string
                });
            } else {
                props.dispatch(alertActions.alertActionSuccess(`Service ${state.name} deleted successfully.`));
                props.dispatch(fetchServicesAction());
                props.setShowModal(false);
            }
        }
    };
    const handleUpdate = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        //TODO: Submit action to server, display message
        const response: IProxyResponse = await putService(props.shortName, {
            name: state.name,
            shortName: state.shortName,
            url: state.url,
            logoURL: state.logoURL
        });
        if (response.success === false) {
            setState({
                ...state,
                message: response.errorMessage as string
            });
        } else {
            props.dispatch(alertActions.alertActionSuccess(`Changes to ${state.name} have been saved.`));
            props.dispatch(fetchServicesAction());
            props.setShowModal(false);
        }
    };
    return <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                        <h3 className="text-2xl font-semibold float-left">Edit Service:
                            <span id={`textEditService${props.shortName}Name`} className="ml-2 text-yadd-pink">{props.name}</span>
                        </h3>
                        <button id={`btnEditService${props.shortName}CloseIcon`} className="text-red-500 p-1 h-6 w-6 ml-auto border-0 float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => props.setShowModal(false)}>
                            <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                        </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-2 flex-auto">
                        <form className={'grid grid-cols-5'}>
                            <div className="relative w-full mb-3 col-span-2 p-2">
                                <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceName">Name</label>
                                <input id={`inputEditService${props.shortName}Name`} type="text" name='serviceName' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    placeholder="e.g. Google Search" style={{ transition: "all .15s ease" }}
                                    value={state.name} onChange={e => setState({ ...state, name: getTargetValue(e) })} />
                            </div>
                            <div className="relative w-full mb-3 col-span-3 p-2">
                                <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceURL">URL</label>
                                <input id={`inputEditService${props.shortName}URL`} type="text" name='serviceURL' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    placeholder="e.g. https://google.com" style={{ transition: "all .15s ease" }}
                                    value={state.url} onChange={e => setState({ ...state, url: getTargetValue(e) })} />
                            </div>
                            <div className="relative w-full mb-3 col-span-2 p-2">
                                <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceShortName">Short Name</label>
                                <input id={`inputEditService${props.shortName}ShortName`} type="text" name='serviceShortName' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    placeholder="e.g. google" style={{ transition: "all .15s ease" }}
                                    value={state.shortName} onChange={e => setState({ ...state, shortName: getTargetValue(e) })} />
                            </div>
                            <div className="relative w-full mb-3 col-span-3 p-2">
                                <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="serviceLogoURL">Logo URL</label>
                                <input id={`inputEditService${props.shortName}LogoURL`} type="text" name='serviceLogoURL' className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    placeholder="e.g. /icons/adminer.png" style={{ transition: "all .15s ease" }}
                                    value={state.logoURL} onChange={e => setState({ ...state, logoURL: getTargetValue(e) })} />
                            </div>
                        </form>
                        <span id={`textEditService${props.shortName}Message`} className='text-sm p-2 text-red-500'>{state.message}</span>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button id={`btnEditService${props.shortName}Close`} className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" onClick={() => props.setShowModal(false)}>Close</button>
                        <button id={`btnEditService${props.shortName}Delete`}
                            className="hover:bg-red-500 hover:text-white border-solid border- border-red-500 font-bold uppercase text-red-500 text-sm px-6 py-3 rounded shadow hover:shadow-lg mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" onClick={handleDelete}>Delete Service</button>
                        <button id={`btnEditService${props.shortName}SaveChanges`} className="bg-yadd-pink text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" onClick={handleUpdate}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>;
};

const connectedComponent = connect()(EditServiceComponent);
export { connectedComponent as EditServiceComponent };
