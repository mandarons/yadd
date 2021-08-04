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

import React, { useEffect } from 'react';
import { IAlert, ALERT_ACTION_TYPES } from './constants';
import { connect } from 'react-redux';
import { Dispatch } from '../../store/index';
import { alertActions } from './action';

const AUTO_CLOSE_TIMER_IN_MS = 5000; // 5 seconds
interface IProps extends IAlert {
    dispatch: Dispatch;
};

const AlertComponent = (props: IProps) => {
    const onClose = (event: React.SyntheticEvent | undefined) => {
        props.dispatch(alertActions.alertActionClear(props.message));
    };
    useEffect(() => {
        if (props.autoClose) {
            setTimeout(() => {
                props.dispatch(alertActions.alertActionClear(props.message));
            }, AUTO_CLOSE_TIMER_IN_MS);
        }
    }, [props]);
    const infoAlert = () => {
        return <div id={props.id} className={'w-full border rounded-lg z-10 bg-blue-200'}>
            <div className={'text-center text-blue-800'}>{props.message}
                <button id={`${props.id}ButtonClose`} className={'float-right mr-4 mb-1 font-bold'} onClick={onClose}>x</button>
            </div>
        </div>;
    };
    const successAlert = () => {
        return <div id={props.id} className={'w-full border rounded-lg z-10 m-2 bg-green-200'}>
            <div className={'text-center text-green-800'}>{props.message}
                <button id={`${props.id}ButtonClose`} className={'float-right mr-4 mb-1'} onClick={onClose}>x</button>
            </div>
        </div>;
    };
    const warningAlert = () => {
        return <div id={props.id} className={'w-full border rounded-lg z-10 m-2 bg-yellow-200'}>
            <div className={'text-center text-yellow-800'}>{props.message}
                <button id={`${props.id}ButtonClose`} className={'float-right mr-4 mb-1'} onClick={onClose}>x</button>
            </div>
        </div>;
    };
    const errorAlert = () => {
        return <div id={props.id} className={'w-full border rounded-lg z-10 m-2 bg-red-200'}>
            <div className={'text-center text-red-800'}>{props.message}
                <button id={`${props.id}ButtonClose`} className={'float-right mr-4 mb-1'} onClick={onClose}>x</button>
            </div>
        </div>;
    };
    const renderSwitch = () => {
        switch (props.type) {
            case ALERT_ACTION_TYPES.INFO:
                return infoAlert();
            case ALERT_ACTION_TYPES.SUCCESS:
                return successAlert();
            case ALERT_ACTION_TYPES.WARNING:
                return warningAlert();
            case ALERT_ACTION_TYPES.ERROR:
            default:
                return errorAlert();
        }
    };
    return renderSwitch();
};

const connectedAlertComponent = connect()(AlertComponent);

export { connectedAlertComponent as AlertComponent };