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

import { SEVICES_ACTION_TYPES, IService } from "./constants";
import { getAllServices } from './proxy';
import { Dispatch } from '../../store';
import { logoutAction } from '../Auth/action';

export const fetchServicesAction = () => {
    const request = () => ({ type: SEVICES_ACTION_TYPES.FETCHING_ALL });
    const success = (services: IService[]) => ({ type: SEVICES_ACTION_TYPES.FETCH_ALL_SUCCESS, services });
    const failure = () => ({ type: SEVICES_ACTION_TYPES.FETCH_ALL_FAILED });
    return async (dispatch: Dispatch) => {
        dispatch(request());
        const response = await getAllServices();
        if (response.success) {
            dispatch(success(response.services as IService[]));
        } else {
            if (response.code === 401) {
                dispatch(logoutAction());
            }
            dispatch(failure());
        }
    };
};