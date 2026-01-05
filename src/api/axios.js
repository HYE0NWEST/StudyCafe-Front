import axios from 'axios';

const instance = axios.create({
    baseURL: "", 
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

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