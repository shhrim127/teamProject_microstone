import React, { useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../components/sidebar';
import './MainPage.css';
import { uploadFile } from '../../api/fileUploadAPI'; // API 함수 임포트
import {useDropzone} from 'react-dropzone';
import {} from '../../../src/store/UserContext';
import Swal from 'sweetalert2';

// Icon Imports
import { 
  BulletinBoardImage, FileUploadImage, GroupImage, WorkbookImage,
  FileUploadIcon, GuideIcon
} from '../images/icon/main/mainIcon';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  //파일 업로드 부분
  const onDrop = useCallback(async (acceptedFiles) => {
    // 파일이 있을 경우 처리
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]; // 첫 번째 파일을 선택
      const result = await Swal.fire({
        title: "파일을 업로드 하겠습니까?",
        showDenyButton: true,
        confirmButtonText: "업로드",
        denyButtonText: "취소"
      });
  
      if (result.isConfirmed) {
        // 파일 업로드 함수 실행
        const response = await uploadFile(selectedFile);
        console.log(response)
        Swal.fire("업로드 완료!", "", "success");

        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        storedTasks.push({
          'task_id': response.task_id,
          'file_name': response.file_name
        });
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
        navigate('/quiz')
      } else if (result.isDenied) {
        Swal.fire("업로드가 취소되었습니다", "", "warning");
      }
    }
  }, []);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'application/pdf',
    maxFiles: 1
    // maxSize: 5242880,           // 최대 파일 크기 5MB
    // minSize: 1024,              // 최소 파일 크기 1KB
    // multiple: false,            // 한 번에 하나의 파일만 업로드
    // onDragEnter: () => console.log('파일 드래그 시작'),
    // onDragLeave: () => console.log('파일 드래그 종료')
  })


  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Sidebar */}
        <Sidebar current_page="main_page" />
        
        {/* Main Content */}
        <div className="layout-page">
          {/* Content */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-12 mb-6">
                  <div className={`content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>       
                    <div className="card">
                      {/* Card Header */}
                      <div className="card-header text-center">
                        <h1>학습자료를 업로드</h1>
                      </div>
                      
                      {/* Card Body */}
                      <div className="card-body">
                        <section className="dropzone needsclick dz-clickable"> 
                            <div {...getRootProps({className: 'dz-dropzone'})}> 
                            <div className="dz-message needsclick row text-center justify-content-center">
                              <FileUploadIcon/>
                              <br/>
                                <h4>여기에 학습자료을 드롭하거나 클릭하여 업로드하세요</h4>
                                <button className='btn rounded-pill me-2 btn-primary upload-button'>파일 선택</button>
                                <small className="note needsclick">(PDF 파일만 업로드 가능하며, 한 번에 1개의 파일만 업로드할 수 있습니다.)</small>
                              </div>
                              <div className="fallback">
                                <input className="file" type="file" style={{display:"none"}}/>
                              </div>
                            </div> 
                        </section> 

                        {/* Guide Section */}
                        <div className="guide d-flex mt-4">
                          <GuideIcon />
                          <div className="ms-2">
                            <small>첨부된 자료는 Microstone 서버에서 안전하게 보관됩니다.</small>
                            <small>
                              이 서비스를 사용하면 Microstone <span className="blue">사용약관</span> 및{' '}
                              <span className="blue">개인정보 처리방침</span>에 동의하는 것으로 간주됩니다.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mb-6 g-6 text-start'>
                  <h1 className="mb-4">Microstone을 사용하는 방법</h1>
                  <div className='row g-4'>
                    {/* Use 1 */}
                    <div className='col-md-6 col-lg-3 mb-3'>
                      <div className="card use1">
                        <div className="card-body">
                          <p>학습자료를 올려 문제를 받아요.</p>
                          <FileUploadImage />
                        </div>
                      </div>
                    </div>

                    {/* Use 2 */}
                    <div className='col-md-6 col-lg-3 mb-3'>
                      <div className="card use2">
                        <div className="card-body">
                          <p>자신만의 문제집을 만들어 보세요.</p>
                          <WorkbookImage />
                        </div>
                      </div>
                    </div>

                    {/* Use 3 */}
                    <div className='col-md-6 col-lg-3 mb-3'>
                      <div className="card use3">
                        <div className="card-body">
                          <p>스터디그룹을 만들고 함께 공부해보세요.</p>
                          <GroupImage />
                        </div>
                      </div>
                    </div>

                    {/* Use 4 */}
                    <div className='col-md-6 col-lg-3 mb-3'>
                      <div className="card use4">
                        <div className="card-body">
                          <p>다른 사람들과 문제집을 공유해보아요.</p>
                          <BulletinBoardImage />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
