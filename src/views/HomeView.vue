<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const inputId = ref('');
const inputPw = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
    if (!inputId.value || !inputPw.value) return alert('아이디와 비밀번호를 입력하세요');
    const success = await auth.login(inputId.value, inputPw.value);
    if (success) {
        router.push('/dashboard');
    } else {
        alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
}
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="brand-logo">
                <div class="logo-icon">📖</div>
                <h1>STUDY CAFE</h1>
                <p>Premium Study Space</p>
            </div>

            <div class="input-group">
                <div class="input-field">
                    <label>ID</label>
                    <input v-model="inputId" type="text" placeholder="아이디를 입력하세요" />
                </div>
                <div class="input-field">
                    <label>Password</label>
                    <input v-model="inputPw" type="password" placeholder="비밀번호를 입력하세요" @keyup.enter="handleLogin" />
                </div>
            </div>

            <button class="login-btn" @click="handleLogin">입실하기 (로그인)</button>
            
            <div class="footer-links">
                <span @click="router.push('/signup')">처음 오셨나요? <strong>회원가입</strong></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%);
}

.login-card {
    background: white;
    padding: 50px 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 400px;
    text-align: center;
}

.brand-logo h1 {
    font-size: 28px;
    margin: 10px 0 5px;
    color: var(--primary-color);
    letter-spacing: 2px;
}

.brand-logo p {
    color: var(--text-light);
    font-size: 14px;
    margin-bottom: 40px;
    text-transform: uppercase;
}

.logo-icon {
    font-size: 40px;
}

.input-field {
    text-align: left;
    margin-bottom: 20px;
}

.input-field label {
    display: block;
    font-size: 12px;
    color: var(--text-light);
    margin-bottom: 5px;
    font-weight: 700;
}

.input-field input {
    width: 100%;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 15px;
    background-color: #F9F9F9;
    transition: border-color 0.3s;
}

.input-field input:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: white;
}

.login-btn {
    width: 100%;
    padding: 15px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.3);
}

.login-btn:hover {
    background-color: #34495E;
}

.footer-links {
    margin-top: 20px;
    font-size: 13px;
    color: var(--text-light);
}

.footer-links span {
    cursor: pointer;
}

.footer-links strong {
    color: var(--accent-color);
    text-decoration: underline;
}
</style>