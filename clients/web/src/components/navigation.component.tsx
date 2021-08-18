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

import { AlertListComponent } from './Alerts/list.component';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import * as authActions from './Auth/action';

const NavigationComponent = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(state => state.auth.loggedIn);
    const handleLogout = (event: SyntheticEvent) => {
        event.preventDefault();
        dispatch(authActions.logoutAction());
    };
    return (
        <nav className={'flex items-center-stretch justify-center flex-wrap p-2'}>
            <div>
                <img id={'appLogoImage'} src={'/yadd.png'} alt={'Mandarons:: Yadd Logo'} width={150} height={50} className={'rounded-sm'} />
            </div>
            <div className={'flex flex-grow justify-center'}>
                <AlertListComponent />
            </div>
            <div>
                {
                    isLoggedIn ?
                        <button id={`btnLogout`}
                            className="hover:bg-red-500 hover:text-white border-solid border- border-red-500 font-bold uppercase text-red-500 text-sm px-6 py-3 rounded shadow hover:shadow-lg mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" onClick={handleLogout}>Logout</button> :
                        null
                }
            </div>
        </nav>
    );
};

const connectedComponent = connect()(NavigationComponent);

export { connectedComponent as NavigationComponent };