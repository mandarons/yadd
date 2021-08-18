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

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { statusAction } from './Auth/action';
import { LoginComponent } from './Auth/login.component';
import FooterComponent from './footer.component';
import { NavigationComponent } from './navigation.component';
import { ServiceListComponent } from './Services/service-list.component';

const HomeComponent = () => {
    const authEnabled = useAppSelector(state => state.auth.enabled);
    const isLoggedIn = useAppSelector(state => state.auth.loggedIn);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(statusAction());
    }, [dispatch]);
    return (
        <div className="flex flex-col h-screen">
            <NavigationComponent />
            <div className={'mb-auto'}>
                {true === authEnabled && false === isLoggedIn ? <LoginComponent /> :
                    <ServiceListComponent services={[]} />}
            </div>
            <FooterComponent />
        </div>
    );
};

export default HomeComponent;