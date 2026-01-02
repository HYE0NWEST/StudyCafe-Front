<script setup>
import { onMounted } from 'vue'; // [추가] 화면 켜질 때 실행하기 위해 필요
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useReservationStore } from '@/stores/reservation';

const router = useRouter();
const authStore = useAuthStore();
const reservationStore = useReservationStore();

// [추가] 화면이 열리면 내 좌석 정보를 서버에서 가져옴
onMounted(() => {
    reservationStore.checkMyActiveSeat();
});

const handleEndUse = async () => {
    await reservationStore.endUse();
};

const handleLogout = () => {
    authStore.logout();
    router.push('/');
};
</script>

<template>
    <div class="dashboard-container">
        <h1>안녕하세요, {{ authStore.username }}님!</h1>

        <div class="card">
            <div class="status-box">
                <p class="status-title">현재 스터디카페 이용 상태</p>

                <div v-if="reservationStore.myActiveSeat" class="active-status">
                    <span class="seat-num">{{ reservationStore.myActiveSeat }}번</span> 좌석 이용 중
                </div>

                <div v-else class="inactive-status">
                    이용 중인 좌석이 없습니다.
                </div>
            </div>

            <div class="button-group">
                <button class="primary-btn" @click="$router.push('/seats')">
                    좌석 예약하러 가기
                </button>

                <button v-if="reservationStore.myActiveSeat" class="danger-btn" @click="handleEndUse">
                    퇴실하기 (이용 종료)
                </button>
            </div>

            <div class="logout-area">
                <button class="secondary-btn" @click="handleLogout">로그아웃</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

.card {
    background: #f9f9f9;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 400px;
}

/* [추가] 상태 표시 스타일 */
.status-box {
    background: #e3f2fd;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
}

.status-title {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #666;
}

.active-status {
    font-size: 20px;
    font-weight: bold;
    color: #2196F3;
}

.seat-num {
    font-size: 32px;
    color: #1565C0;
    margin-right: 5px;
}

.inactive-status {
    color: #999;
    font-weight: bold;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

button {
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

.primary-btn {
    background: #2196F3;
    color: white;
}

.danger-btn {
    background: #F44336;
    color: white;
}

.secondary-btn {
    background: #9e9e9e;
    color: white;
    width: 100%;
}

.logout-area {
    border-top: 1px solid #ddd;
    padding-top: 20px;
}
</style>