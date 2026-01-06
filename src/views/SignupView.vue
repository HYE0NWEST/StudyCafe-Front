<script setup>
import { ref } from 'vue';
import axios from '@/api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const email = ref('');

const handleSignup = async () => {
    if(!username.value || !password.value) return alert("정보를 입력하세요");

    try {
        await axios.post('/api/auth/signup', {
            username: username.value,
            password: password.value,
            email: email.value
        });
        alert("가입을 환영합니다! 로그인 해주세요.");
        router.push('/'); 
    } catch (e) {
        alert(e.response?.data || "가입 실패");
    }
};
</script>

<template>
    <div class="signup-container">
        <div class="signup-card">
            <div class="header">
                <h2>회원가입</h2>
                <p>스터디카페 멤버십을 시작하세요</p>
            </div>

            <div class="form-group">
                <div class="input-wrapper">
                    <label>아이디</label>
                    <input v-model="username" placeholder="사용할 아이디 입력" />
                </div>
                
                <div class="input-wrapper">
                    <label>비밀번호</label>
                    <input v-model="password" type="password" placeholder="비밀번호 입력" />
                </div>

                <div class="input-wrapper">
                    <label>이메일 (선택)</label>
                    <input v-model="email" placeholder="example@email.com" />
                </div>
            </div>

            <div class="btn-group">
                <button class="join-btn" @click="handleSignup">가입 완료</button>
                <button class="cancel-btn" @click="router.push('/')">취소하고 돌아가기</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.signup-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%);
}

.signup-card {
    background: white;
    padding: 40px;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.header h2 {
    color: #2C3E50;
    margin: 0 0 5px;
}

.header p {
    color: #888;
    font-size: 14px;
    margin-bottom: 30px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
}

.input-wrapper label {
    display: block;
    font-size: 12px;
    font-weight: bold;
    color: #666;
    margin-bottom: 5px;
}

.input-wrapper input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    background: #f9f9f9;
}

.input-wrapper input:focus {
    background: white;
    border-color: #3498DB;
    outline: none;
}

.btn-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.join-btn {
    padding: 15px;
    background: #3498DB;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    font-size: 16px;
}

.cancel-btn {
    padding: 12px;
    background: transparent;
    border: 1px solid #ddd;
    color: #888;
    border-radius: 10px;
    font-size: 14px;
}

.join-btn:hover { background: #2980B9; }
.cancel-btn:hover { background: #f0f0f0; }
</style>