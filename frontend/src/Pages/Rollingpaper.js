import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rollingpaper.css';

function RollingPaper() {
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/letters');
      if (response.ok) {
        const data = await response.json();
        setLetters(data);
      } else {
        console.error('Failed to fetch letters:', response.status);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="letter-introducing-page">
      <div className='background-circle'></div>
      <header className="header">
        <h1 onClick={handleLogoClick}>롤링롤링</h1>
      </header>
      <div className="page-title">2024년 인공지능학부 24학번 롤링페이퍼</div>
      <section className="right-panel">
        <section className="letters-list">
          {letters.length === 0 ? (
            <p>편지 내용이 없습니다.</p>
          ) : (
            letters.map((letter, index) => (
              <div key={index} className="letter-card">
                <div className="letter-info">
                  <p>{letter.letterContent}</p>
                </div>
                <div className="letter-footer">
                  <p>FROM. {letter.nickname}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </section>
    </div>
  );
}

export default RollingPaper;
