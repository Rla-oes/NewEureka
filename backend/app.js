const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 4000;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'REMOVED_PASSWORD', // 자신의 MySQL 비밀번호
    database: 'letter' // 데이터베이스 이름
};

// MySQL 연결 풀 생성
const pool = mysql.createPool(dbConfig);

// DB 연결 함수 (연결 풀을 사용하여 연결 재사용)
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

app.use(cors());
app.use(express.json());

// 편지 작성 엔드포인트
app.post('/api/letters', async (req, res) => {
    const { nickname, letterContent } = req.body;

    try {
        const db = await connectDB();
        await db.query('INSERT INTO `letters` (nickname, letterContent) VALUES (?, ?)', 
            [nickname, letterContent]);
        res.status(201).json({ message: '편지가 성공적으로 작성되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 편지 목록 조회 엔드포인트
app.get('/api/letters', async (req, res) => {
    try {
        const db = await connectDB();
        const [letters] = await db.query('SELECT * FROM `letters`');
        res.status(200).json(letters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
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
