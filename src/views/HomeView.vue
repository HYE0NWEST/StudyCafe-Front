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

    // store의 login 함수 호출 (성공 시 true 반환하도록 수정했음)
    const success = await auth.login(inputId.value, inputPw.value);

    if (success) {
        router.push('/dashboard'); // 로그인 성공 시 대시보드로
    }
}
</script>

<template>
    <div class="login-box">
        <h1>스터디카페 키오스크</h1>
        <p>회원 로그인을 진행해주세요</p>

        <div class="input-group">
            <input v-model="inputId" type="text" placeholder="아이디" />
            <input v-model="inputPw" type="password" placeholder="비밀번호" @keyup.enter="handleLogin" />
        </div>

        <button @click="handleLogin">로그인</button>
        <button class="signup-link" @click="router.push('/signup')">회원가입 하러가기</button>
    </div>
</template>

<style scoped>
.login-box {
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input {
    padding: 12px;
    font-size: 16px;
    width: 250px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 12px 30px;
    cursor: pointer;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    width: 276px;
}

button:hover {
    background: #45a049;
}
</style>