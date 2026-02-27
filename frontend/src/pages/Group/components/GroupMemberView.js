import React from 'react';
import Sidebar from '../../components/sidebar';
import FormWithTabs from './detail/GroupDetailsTabs';

const GroupMemberView = ({ groupDetails }) => (

    <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
            <Sidebar current_page="group" />
            <div className="layout-page">
                <div className="dataTables_wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                        

                        <FormWithTabs></FormWithTabs>



                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default GroupMemberView;

