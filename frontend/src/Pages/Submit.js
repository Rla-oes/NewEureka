import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import './Submit.css';  // CSS 파일 연결

const Submit = () => {
    const [formData, setFormData] = useState({
        nickname: '',  // 닉네임
        letterContent: '',  // 편지 내용
    });

    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // API 엔드포인트 URL 수정
            const response = await axios.post('http://localhost:4000/api/letters', {
                nickname: formData.nickname,
                letterContent: formData.letterContent,  // 편지 내용 전송
            });

            alert(response.data.message); // 성공 메시지 표시
            navigate('/'); // 제출 후 메인 페이지로 이동
        } catch (error) {
            alert(error.response?.data?.message || '서버 오류'); // 에러 메시지 표시
        }
    };

    const handleHeaderClick = () => {
        navigate('/'); // 소K팅 클릭 시 메인 페이지로 이동
    };

    return (
        <div className="rollingpaper-container">
            <div className="header" onClick={handleHeaderClick}> {/* 클릭 시 메인 페이지로 이동 */}
                <h1>롤링롤링</h1>
            </div>
            <div className="background-circle"></div> {/* 배경 원 추가 */}
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
                <button type="submit">제출하기</button>
            </form>
        </div>
    );
}

export default Submit;
