import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/api/axios';

export const useAuthStore = defineStore('auth', () => {
    // 저장소 초기화 (새로고침해도 이름 유지되게 localStorage 사용)
    const userId = ref(localStorage.getItem('userId') || null);
    const username = ref(localStorage.getItem('username') || ''); // [추가] 이름 저장 변수
    const token = ref(localStorage.getItem('token') || '');

    const login = async (id, pw) => {
        try {
            const res = await axios.post('/api/auth/login', {
                username: id,
                password: pw
            });

            // ▼▼▼ 2. 받아온 데이터 저장 (userId, username, token) ▼▼▼
            userId.value = res.data.userId;
            username.value = res.data.username;
            token.value = res.data.token; // 토큰 저장

            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('token', res.data.token); // 로컬스토리지에도 저장

            return true;
        } catch (e) {
            return false;
        }
    };

    const logout = () => {
        userId.value = null;
        username.value = '';
        token.value = ''; // 토큰 초기화
        localStorage.clear();
    };

    return { userId, username, token ,login, logout };
});