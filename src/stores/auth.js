import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/api/axios';

export const useAuthStore = defineStore('auth', () => {
    // 저장소 초기화 (새로고침해도 이름 유지되게 localStorage 사용)
    const userId = ref(localStorage.getItem('userId') || null);
    const username = ref(localStorage.getItem('username') || ''); // [추가] 이름 저장 변수

    const login = async (id, pw) => {
        try {
            const res = await axios.post('/api/auth/login', {
                username: id,
                password: pw
            });

            // 서버에서 받은 데이터 저장
            userId.value = res.data.userId;
            username.value = res.data.username; // [추가]

            // 새로고침 대비용 저장
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('username', res.data.username); // [추가]

            return true;
        } catch (e) {
            return false;
        }
    };

    const logout = () => {
        userId.value = null;
        username.value = '';
        localStorage.clear(); // 저장소 비우기
    };

    return { userId, username, login, logout };
});