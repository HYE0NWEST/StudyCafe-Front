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
        alert("가입 성공! 로그인 해주세요.");
        router.push('/'); // 로그인 화면으로 이동
    } catch (e) {
        alert(e.response?.data || "가입 실패");
    }
};
</script>

<template>
    <div class="signup-box">
        <h1>회원가입</h1>
        <input v-model="username" placeholder="아이디" />
        <input v-model="password" type="password" placeholder="비밀번호" />
        <input v-model="email" placeholder="이메일(선택)" />
        
        <div class="btns">
            <button class="join" @click="handleSignup">가입완료</button>
            <button class="back" @click="$router.push('/')">취소</button>
        </div>
    </div>
</template>

<style scoped>
.signup-box { margin-top: 100px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
input { padding: 10px; width: 250px; }
.btns { display: flex; gap: 10px; }
button { padding: 10px 20px; cursor: pointer; border: none; color: white; border-radius: 5px;}
.join { background: #2196F3; }
.back { background: #999; }
</style>