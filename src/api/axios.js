import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://52.78.37.215:8080', 
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.response.use(
    res => res,
    err => {
        let msg = '알 수 없는 오류가 발생했습니다.';
        
        if (err.response && err.response.data) {
            const data = err.response.data;
            
            // 1. 서버가 보낸 데이터가 "JSON 객체"인 경우 (보기 싫은 그거)
            if (typeof data === 'object') {
                // message 필드가 있으면 그거 보여주고, 없으면 그냥 일반 문구 출력
                // Spring Boot 기본 에러에는 message가 보통 포함되어 있음
                msg = data.message || "요청 처리 중 오류가 발생했습니다.";
            } 
            // 2. 서버가 보낸 데이터가 그냥 "문자열"인 경우
            else {
                msg = data;
            }
        }
        
        // JSON 덩어리는 절대 출력하지 않고, 정제된 msg만 출력
        alert(msg);
        return Promise.reject(err);
    }
);

export default instance;