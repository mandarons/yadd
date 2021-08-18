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

const initialState: constants.IAuthState = {
    username: 'admin',
    enabled: false,
    loggedIn: false
};

const reducer = (state = initialState, action: constants.IAuthAction) => {
    let newState = { ...state };
    switch (action.type) {
        case constants.AUTH_ACTION_TYPES.LOGIN_SUCCESS:
            newState.enabled = true;
            newState.loggedIn = true;
            break;
        case constants.AUTH_ACTION_TYPES.LOGIN_FAILED:
            newState.enabled = true;
            newState.loggedIn = false;
            break;
        case constants.AUTH_ACTION_TYPES.LOGOUT_SUCCESS:
            newState.enabled = true;
            newState.loggedIn = false;
            break;
        case constants.AUTH_ACTION_TYPES.STATUS_SUCCESS:
            newState.enabled = (action.payload as constants.IStatusResponse).enabled;
            break;
        case constants.AUTH_ACTION_TYPES.STATUS_FAILED:
            break;
        default:
            break;
    }
    return newState;
};

export default reducer;