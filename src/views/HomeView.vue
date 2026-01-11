<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const inputId = ref('');
const inputPw = ref('');
const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
    if (!inputId.value || !inputPw.value) return alert('아이디와 비밀번호를 입력하세요');
    loading.value = true;
    try {
        const success = await auth.login(inputId.value, inputPw.value);
        if (success) {
            router.push('/dashboard');
        } else {
            alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
        }
    } finally {
        loading.value = false;
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

            <button class="login-btn" @click="handleLogin" :disabled="loading">
                {{ loading ? '로그인 중...' : '입실하기 (로그인)' }}
            </button>
            
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    position: relative;
    overflow: hidden;
}

.login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
}

.login-card {
    background: white;
    padding: 50px 40px;
    border-radius: 24px;
    box-shadow: var(--shadow-xl);
    width: 400px;
    text-align: center;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-logo h1 {
    font-size: 32px;
    margin: 10px 0 5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
    font-weight: 700;
}

.brand-logo p {
    color: var(--text-light);
    font-size: 14px;
    margin-bottom: 40px;
    text-transform: uppercase;
}

.logo-icon {
    font-size: 48px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
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
    padding: 14px 16px;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    font-size: 15px;
    background-color: #F9F9F9;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.input-field input:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: white;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.login-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.login-btn:hover::before {
    left: 100%;
}

.login-btn:hover:not(:disabled) {
    background-color: #34495E;
}

.login-btn:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    opacity: 0.7;
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
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
}

.footer-links span:hover strong {
    color: var(--accent-hover);
    text-decoration: underline;
}
</style>