import axios from 'axios';

const instance = axios.create({
    baseURL: "", 
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(
    (config) => {
        // 로컬 스토리지에서 토큰 꺼내기
        const token = localStorage.getItem('token');
        
        // 토큰이 있으면 헤더에 'Bearer 토큰값' 형태로 추가
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    res => res,
    err => {
        let msg = '알 수 없는 오류가 발생했습니다.';
        
        if (err.response && err.response.data) {
            const data = err.response.data;
            
            
            if (typeof data === 'object') {
                
                msg = data.message || "요청 처리 중 오류가 발생했습니다.";
            } 
            
            else {
                msg = data;
            }
        }
        
       
        return Promise.reject(err);
    }
);

export default instance;