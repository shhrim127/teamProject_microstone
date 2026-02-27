import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import Swal from 'sweetalert2';
import "react-quill/dist/quill.snow.css"; // Quill's default theme
import { useParams, useNavigate } from 'react-router-dom';
import { createPost, updatePost } from '../../api/postApi.js'; // Import API functions
import { getPostBody } from '../../api/DetailPost.js';
import './BoardWritePage.css';

const EditorComponent = ({goToContent,type}) => {
  const [editorHtml, setEditorHtml] = useState(""); // Editor content state
  const [title, setTitle] = useState(""); // Title state
  const [category, setCategory] = useState("question_board"); // Default category
  const navigate = useNavigate(); // useNavigate hook
  const { id } = useParams(); 
  const { groupId } = useParams(); // Get the post ID from URL parameters


  const get_id = type==="public" ? id : groupId
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);

  const loadTableData = async () => {
    if (id) {
      try {
        const response_getpage = await getPostBody(id);
        if (user.id !== response_getpage.nickname) {
          navigate('/board/all');
          Swal.fire('에러!', '해당 게시글에 접근할 수 없습니다!', 'error');
        }
        setTitle(response_getpage.title);
        setEditorHtml(response_getpage.content);
        setCategory(response_getpage.category);
      } catch (error) {
        console.error('게시글 데이터를 로드하는 중 오류 발생:', error);
      }
    }
  };

  useEffect(() => {
    loadTableData();
  }, []);

  const handleChange = (html) => {
    setEditorHtml(html); // Update editor content
  };

  // Handle title input
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Handle save (Create or Update)
  const handleSave = async (event) => {
    event.preventDefault();

    // Show confirmation dialog
    const confirmation = await Swal.fire({
      title: '확인',
      text: id ? '정말 게시글을 수정하시겠습니까?' : '정말 게시글을 등록하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });

    if (!confirmation.isConfirmed) {
      return; // Cancel if the user clicks 'No'
    }
    try {
      let response;
      if (id) {
        // Update existing post
        response = await updatePost(id, title, editorHtml,type,get_id);
      } else {
        // Create new post
        response = await createPost(title, editorHtml, category,type,get_id);
      }

      // Check the response and redirect to the post detail page
      if (response.status === 200) {
        const postId = id || response.data.post_id; // Use existing ID or get new post ID from response

        // Show success alert and redirect
        Swal.fire({
          title: '성공!',
          text: id ? '게시글이 성공적으로 수정되었습니다.' : '게시글이 성공적으로 등록되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        }).then((result) => {
          if (result.isConfirmed) {
            if (type==="public"){
                navigate(`/board/detail/${postId}`);
            }else{
                goToContent(response.data.post_id) // Navigate to the detail page
            }
          }
        });
      } else {
        throw new Error('게시글 저장 실패');
      }
    } catch (error) {
      Swal.fire('실패!', '게시글 저장에 실패했습니다.', 'error');
    }
  };

  const cancelHandle = async (event) => {
    event.preventDefault();
    if (editorHtml === '') {
      navigate(-1);
      return;
    }
    const is_true = await Swal.fire({
      title: '경고!',
      text: '작성하시던 내용이 삭제되는데 취소하시겠습니까?',
      icon: 'warning',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      showCancelButton: true,
    });
    if (is_true.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <div className="card-header">
          <h5 className="card-title mb-0">{id ? '글 수정' : '글쓰기'}</h5>
        </div>
        <div className="card-body">
          <div className="mb-6">
            <label className="form-label" htmlFor="ecommerce-product-name">제목</label>
            <input
              type="text"
              className="form-control"
              id="ecommerce-product-name"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={handleTitleChange} // Handle title change
            />
          </div>
          <div className="row mb-6">
            <div className="col">
              <label className="form-label" htmlFor="category">카테고리</label>
              <select
                className="form-select"
                value={category}
                onChange={handleCategoryChange} // Handle category change
                disabled={!!id} // 수정 시 카테고리 수정 불가
              >
                <option value="QUESTION_BOARD">질문 게시판</option>
                <option value="FREE_BOARD">자유 게시판</option>
                <option value="PROBLEM_SHARE_BOARD">문제 공유 게시판</option>
                {user.role !== 'USER' && (
                  <option value="ANNOUNCEMENT_BOARD">공지 게시판</option>
                )}
              </select>
            </div>
          </div>

          {/* Quill Editor */}
          <ReactQuill
            className="mb-6"
            theme="snow"
            value={editorHtml}
            onChange={handleChange} // Call handler on editor change
            modules={EditorComponent.modules} // Set editor modules
            formats={EditorComponent.formats} // Set formats to use
            bounds="#snow-editor"
            placeholder="내용을 입력하세요"
          />

          {/* Save and Cancel Buttons */}
          <div className="d-flex justify-content-end gap-4">
            <button type="button" className="btn btn-label-secondary" onClick={cancelHandle}>취소</button>
            <button type="submit" className="btn btn-primary">저장</button>
          </div>
        </div>
      </form>
    </>
  );
};

EditorComponent.modules = {
  toolbar: [
    [{ 'font': [] }, { 'size': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
    ['link', 'formula'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  },
};

EditorComponent.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script', 'sub', 'super',
  'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'align', 'link', 'image', 'video', 'formula'
];

export default EditorComponent;
