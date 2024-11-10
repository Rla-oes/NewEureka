import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Submit.css';

const Submit = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        letterContent: '',
    });
    const [recommendedText, setRecommendedText] = useState(''); // 추천 문구 상태 추가

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/letters', {
                nickname: formData.nickname,
                letterContent: formData.letterContent,
            });

            alert(response.data.message);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || '서버 오류');
        }
    };

    // 추천 문구 요청 함수
    const handleRecommendClick = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/recommendLetter');
            setRecommendedText(response.data.text); // 추천 문구를 별도 상태로 설정
        } catch (error) {
            alert('추천 문구를 불러오는데 실패했습니다.');
        }
    };    
    

    const handleHeaderClick = () => {
        navigate('/');
    };

    return (
        <div className="rollingpaper-container">
            <div className="header" onClick={handleHeaderClick}>
                <h1>롤링롤링</h1>
            </div>
            <div className="background-circle"></div>
            <h2>편지를 작성하세요!</h2>
            <form action="#" method="post" className="rollingpaper-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="nickname" 
                        placeholder="닉네임" 
                        value={formData.nickname} 
                        onChange={handleChange} 
                        required 
                    />
                    <textarea
                        name="letterContent"
                        placeholder="편지 내용을 작성해주세요"
                        value={formData.letterContent}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="button" onClick={handleRecommendClick}>
                    추천 문구 불러오기
                </button>
                <button type="submit">제출하기</button>
            </form>

            {recommendedText && (
                <div className="recommended-text">
                    <h3>추천 문구:</h3>
                    <p>{recommendedText}</p>
                </div>
            )}
        </div>
    );
};

export default Submit;
