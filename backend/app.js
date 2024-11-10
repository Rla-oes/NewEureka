const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 4000;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'REMOVED_PASSWORD',
    database: 'letter'
};

// MySQL 연결 풀 생성
const pool = mysql.createPool(dbConfig);

// JSON 바디 파싱 미들웨어 추가
app.use(express.json());

async function connectDB() {
    try {
        const connection = await pool.getConnection();
        console.log('DB 연결 성공');
        return connection;
    } catch (error) {
        console.error('DB 연결 실패', error);
        throw new Error('DB 연결 실패');
    }
}

// 제미나이 API 설정
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

async function getRecommendedText() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    const msg = "동기들에게 써줄 적합한 짧은 편지 문구를 추천해줘. 편지 문구는 존댓말로 한 문장만 제공해줘. 재치있거나 감동적인 내용이 포함되어야 해.";

    try {
        const result = await chat.sendMessage(msg);

        // 응답에서 텍스트 추출
        const recommendedText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (recommendedText) {
            // 마크다운 기호 제거: ##, **, * 등의 기호를 제거하여 텍스트만 남기기
            const cleanedText = recommendedText.replace(/(##|\*|\*\*)/g, '').trim();

            // 문장을 줄바꿈으로 분리하고 배열로 만들기
            const sentences = cleanedText.split('\n').map(sentence => sentence.trim()).filter(sentence => sentence.length > 0);

            // 랜덤으로 한 문장을 선택
            const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

            return randomSentence;  // 랜덤으로 선택된 문장 반환
        } else {
            throw new Error('추천 문구가 없습니다.');
        }
    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        throw new Error("추천 문구 생성 실패");
    }
}




// OpenAI와 연결되어 있던 GPT 요청을 제미나이 API로 대체한 함수
app.post('/api/recommendLetter', async (req, res) => {
    try {
        const recommendedText = await getRecommendedText();  // 제미나이에서 추천 문구 받기
        res.json({ text: recommendedText });
    } catch (error) {
        console.error('문구 추천 에러:', error);
        res.status(500).json({ error: '추천 문구 생성 실패' });
    }
});

// 편지 작성 엔드포인트
app.post('/api/letters', async (req, res) => {
    const { nickname, letterContent } = req.body;
    let db;

    try {
        db = await connectDB();
        await db.query('INSERT INTO `letters` (nickname, letterContent) VALUES (?, ?)', 
            [nickname, letterContent]);
        res.status(201).json({ message: '편지가 성공적으로 작성되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    } finally {
        if (db) db.release();
    }
});

// 편지 목록 조회 엔드포인트
app.get('/api/letters', async (req, res) => {
    let db;

    try {
        db = await connectDB();
        const [letters] = await db.query('SELECT * FROM `letters`');
        res.status(200).json(letters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    } finally {
        if (db) db.release();
    }
});

// React 앱의 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 모든 다른 경로에 대한 요청도 index.html로 리다이렉트
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 오류 미들웨어: 서버 오류를 JSON 형식으로 반환
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '서버 오류', error: err.message });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
