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

import { IServicesState, IServiceAction, SEVICES_ACTION_TYPES } from './constants';

const initialState: IServicesState = {
    services: [],
    fetching: false,
    invalidated: false
};

export const services = (state = initialState, action: IServiceAction) => {
    let newState = { ...state };
    switch (action.type) {
        case SEVICES_ACTION_TYPES.FETCHING_ALL:
            newState.fetching = true;
            break;
        case SEVICES_ACTION_TYPES.FETCH_ALL_SUCCESS:
            newState.fetching = false;
            newState.services = action.services;
            break;
        case SEVICES_ACTION_TYPES.FETCH_ALL_FAILED:
            newState.fetching = false;
            newState.services = [];
            break;
        default:
            break;
    }
    return newState;
};