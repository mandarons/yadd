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

import { useState, useEffect } from 'react';
import ServiceCardComponent from './service-card.component';
import { IService } from './constants';
import { connect } from 'react-redux';
import { Dispatch } from '../../store/index';
import { fetchServicesAction } from './action';
import { IState } from '../../store/reducers';
import { FaPlus } from 'react-icons/fa';
import { NewServiceComponent } from './service-add.component';

interface IProps {
    dispatch: Dispatch;
    services: IService[];
}
const AddNewServiceButton = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div key='addNewServiceButton'>
            <div id={`btnAddNewService`} className={'relative flex rounded-xl shadow-lg overflow-hidden m-4 cursor-pointer'}>
                <FaPlus className={'w-16 h-16 opacity-50'} onClick={e => setShowModal(true)} />
            </div>
            {showModal ?
                <div className={'absolute right-6 mt-4 py-2 border border-gray-500 bg-gray-100 rounded shadow-2xl z-10'}>
                    <NewServiceComponent handleCreateCancel={e => setShowModal(false)} />
                </div> : null}
        </div>
    );
};

const ServiceListComponent = (props: IProps) => {
    const dispatch = props.dispatch;
    useEffect(() => {
        dispatch(fetchServicesAction());
    }, [dispatch]);
    return (
        <div className={'flex flex-wrap'}>
            {
                [AddNewServiceButton(), Object.values(props.services).map((service: IService, index: number) => <ServiceCardComponent key={index} service={service} />)]
            }
        </div>
    );
};
const mapStateToProps = (state: IState) => {
    const { services } = state;
    return { ...services };
};
const connectedComponet = connect(mapStateToProps)(ServiceListComponent);

export { connectedComponet as ServiceListComponent };