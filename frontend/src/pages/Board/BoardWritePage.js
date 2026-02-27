import React from 'react';
import Sidebar from '../components/sidebar'; // Sidebar component import
import EditorComponent from './EditorComponent'; // 메인 컴포넌트 import

const Editor = () => {
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar current_page="board" />
        <div className='layout-page'>
          <div className='dataTables_wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              <div className='app-ecommerce'>
                {/* EditorComponent를 호출 */}
                <div className='card'>
                  <EditorComponent 
                  type = "public"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
