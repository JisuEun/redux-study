import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

function Editor() {
  // 상태 관리를 위한 useState 훅
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 리덕스 스토어로부터 인증 상태 가져옴
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
      alert("세션이 만료되었습니다.");
      navigate('/login', {replace: true});
    }
  }, [isAuthenticated, navigate]);

  // 제목과 내용을 설정하는 핸들러 함수
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API로 데이터 전송
      const response = await axios.post('http://localhost:3001/api/blog/posts', {
        title,
        content
      });
      console.log('Post created:', response.data);
      // 제출 후 입력 필드 초기화
      navigate('/');
      // 여기서 추가적으로 성공 메시지를 표시하거나, 다른 페이지로 리다이렉트할 수 있습니다.
    } catch (error) {
      console.error('Error creating post:', error);
      // 여기서 사용자에게 에러 메시지를 표시할 수 있습니다.
    }
  };

  const summarizeContent = async () => {
    try {
      // await를 사용하여 비동기 요청의 결과를 기다립니다.
      const response = await axios.post('http://localhost:3001/api/llm/summarize', { content });
      // 요청이 성공적으로 완료되면, 이 부분이 실행됩니다.
      setContent(content + "\n\n★요약:\n" + response.data.summary + "\n\n");
    } catch (error) {
      // 에러 처리
      if (error.response && error.response.status === 401) {
        alert('세션이 만료되었습니다.');
        navigate('/login');
      } else {
        console.error('Error summarizing content: ', error);
      }
    }
  }

  const extractKeywords = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/llm/keywords', {content});
      setContent(content + "\n\n★키워드:\n" + response.data.keywords + "\n\n");
    } catch (error) {
      console.error('Error extracting keywords: ', error);
    }
  };

  return (
    <div className='editor-container'>
      <h1 onClick={() => navigate('/')}>Editor Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            style={{width: '100%', height: '500px'}}
          ></textarea>
        </div>
        <button type="submit">Save Post</button>
        <button type="button" onClick={summarizeContent}>요약</button>
        <button type="button" onClick={extractKeywords}>키워드</button>
      </form>
    </div>
  );
}

export default Editor;