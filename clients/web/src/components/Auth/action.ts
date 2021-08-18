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

import * as constants from './constants';
import * as proxy from './proxy';
import { Dispatch } from '../../store';
import { alertActions } from '../Alerts/action';

const dispatchMethod = (type: string, payload = {}) => ({ type, payload });

const loginAction = (username: string, password: string) => {
    return async (dispatch: Dispatch) => {
        const response = await proxy.login(username, password);
        if (response.success) {
            dispatch(dispatchMethod(constants.AUTH_ACTION_TYPES.LOGIN_SUCCESS));
        } else {
            dispatch(dispatchMethod(constants.AUTH_ACTION_TYPES.LOGIN_FAILED));
            dispatch(alertActions.alertActionError(response.errorMessage as string));
        }
    };
};

const logoutAction = () => {
    return async (dispatch: Dispatch) => {
        await proxy.logout();
        dispatch(dispatchMethod(constants.AUTH_ACTION_TYPES.LOGOUT_SUCCESS));
    };
};

const statusAction = () => {
    return async (dispatch: Dispatch) => {
        const response = await proxy.status();
        if (response.success) {
            dispatch(dispatchMethod(constants.AUTH_ACTION_TYPES.STATUS_SUCCESS, (response.data as { enabled: boolean; })));
        } else {
            dispatch(dispatchMethod(constants.AUTH_ACTION_TYPES.STATUS_FAILED, (response.data as { enabled: boolean; })));
        }
    };
};
export {
    loginAction,
    logoutAction,
    statusAction
};