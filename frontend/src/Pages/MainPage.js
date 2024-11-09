import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate(); // navigate 함수 가져오기

  const handleStartClick = () => {
    navigate('/submit'); 
  };

  const handleCheckClick = () => {
    navigate('/rollingpaper'); 
  };

  return (
    <div className='main-page'>
      <div className="gradient-circle"></div>
      <div className="gradient-circle"></div>

      <div className="header">
        <h1>롤링롤링</h1>
      </div>

      <div className="main-content">
        <h2>1년을 같이 보낸 동기들에게<br />마음을 전해보세요!</h2>
        <div className="button-group">
          <button onClick={handleStartClick}>편지 쓰기</button>
          <button onClick={handleCheckClick}>확인하기</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
