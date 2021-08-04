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

import { IAlert, IAlertAction, ALERT_ACTION_TYPES } from './constants';

const initialState: IAlert[] = [];

const addUnique = (alerts: IAlert[], alert: IAlert) => {
    alerts = alerts.filter(a => a.message !== alert.message);
    alerts.push(alert);
    return alerts;
};

export function alerts(state = initialState, action: IAlertAction) {
    let newState = [...state];
    switch (action.type) {
        case ALERT_ACTION_TYPES.INFO:
        case ALERT_ACTION_TYPES.SUCCESS:
        case ALERT_ACTION_TYPES.WARNING:
        case ALERT_ACTION_TYPES.ERROR:
            newState = addUnique(newState, action as IAlert);
            break;
        case ALERT_ACTION_TYPES.CLEAR:
            newState = action.message !== null ? newState.filter(a => a.message !== action.message) : [];
            break;
        default:
            return state;
    }
    return newState;
}