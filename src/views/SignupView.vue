<script setup>
import { ref } from 'vue';
import axios from '@/api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const email = ref('');
const loading = ref(false);


const handleSignup = async () => {
    if(!username.value || !password.value) return alert("정보를 입력하세요");

    loading.value = true;
    try {
        await axios.post('/api/auth/signup', {
            username: username.value,
            password: password.value,
            email: email.value
        });
        alert("가입을 환영합니다! 로그인 해주세요.");
        router.push('/'); 
    } catch (e) {
        let errorMsg = "가입 실패";
        if (e.response?.data) {
            if (typeof e.response.data === 'string') {
                errorMsg = e.response.data;
            } else if (e.response.data.message) {
                errorMsg = e.response.data.message;
            }
        }
        alert(errorMsg);
    } finally {
        loading.value = false;
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
                <button class="join-btn" @click="handleSignup" :disabled="loading">
                    {{ loading ? '처리 중...' : '가입 완료' }}
                </button>
                <button class="cancel-btn" @click="router.push('/')" :disabled="loading">취소하고 돌아가기</button>
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    position: relative;
    overflow: hidden;
}

.signup-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
}

.signup-card {
    background: white;
    padding: 40px;
    border-radius: 24px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow-xl);
    position: relative;
    z-index: 1;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.header h2 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 5px;
    font-weight: 700;
    font-size: 28px;
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
    padding: 14px 16px;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    font-size: 15px;
    background: #f9f9f9;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.input-wrapper input:focus {
    background: white;
    border-color: var(--accent-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.join-btn {
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.join-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.join-btn:hover:not(:disabled)::before {
    left: 100%;
}

.cancel-btn {
    padding: 14px;
    background: transparent;
    border: 2px solid var(--border-color);
    color: var(--text-light);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.join-btn:hover:not(:disabled) { background: #2980B9; }
.join-btn:disabled { 
    background: #95a5a6; 
    cursor: not-allowed; 
    opacity: 0.7;
}
.cancel-btn:hover:not(:disabled) { background: #f0f0f0; }
.cancel-btn:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
}
</style>