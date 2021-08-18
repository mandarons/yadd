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

import { SyntheticEvent, useState } from 'react';
import { connect } from 'react-redux';
import * as authActions from './action';
import { IState } from '../../store/reducers';
import { useAppDispatch, useAppSelector } from '../../store/hooks';


const LoginComponent = () => {
    const auth = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [password, setPassword] = useState('');
    const getTargetValueString = (event: React.SyntheticEvent): string => (event.target as typeof event.target & { value: string; }).value;
    const handlePasswordChange = (event: SyntheticEvent) => setPassword(getTargetValueString(event));
    const handleLoginSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        dispatch(authActions.loginAction(auth.username, password));
    };
    return (
        <div className={"items-center max-w-md mx-auto mt-auto"}>
            <div className={"text-center mb-10"}>
                <h1 id={'h1-authentication'} className={"text-3xl font-semibold text-gray-700 dark:text-gray-200"}>Authentication Required</h1>
            </div>
            <div className={""}>
                <div className={'grid grid-cols-3'}>
                    <input type="password" name="password" id="inputPassword" placeholder="Enter password" onChange={handlePasswordChange}
                        value={password}
                        className={"col-span-2 p-2 mb-2 mt-2 mr-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 "} />
                    <button id={`btnLoginSubmit`} className="bg-yadd-pink text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button" onClick={handleLoginSubmit}>Login</button>
                </div>
            </div>
        </div>
    );
};

const connectedComponent = connect((state: IState) => state.auth)(LoginComponent);
export { connectedComponent as LoginComponent };