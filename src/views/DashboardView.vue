<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useReservationStore } from '@/stores/reservation';

const router = useRouter();
const authStore = useAuthStore();
const reservationStore = useReservationStore();

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
    <div class="dashboard-wrapper">
        <header class="top-bar">
            <h2>Study Cafe</h2>
            <button class="logout-btn" @click="handleLogout">로그아웃</button>
        </header>

        <div class="content-area">
            <div class="welcome-msg">
                <h3>반갑습니다, <span class="highlight">{{ authStore.username }}</span>님</h3>
                <p>오늘도 목표를 향해 달려보세요!</p>
            </div>

            <div class="status-card" :class="{ active: reservationStore.myActiveSeat }">
                <div class="card-header">
                    <span>MY SEAT</span>
                    <span class="live-badge" v-if="reservationStore.myActiveSeat">이용중</span>
                    <span class="live-badge inactive" v-else>대기중</span>
                </div>
                <div class="card-body">
                    <div v-if="reservationStore.myActiveSeat">
                        <span class="seat-number">{{ reservationStore.myActiveSeat }}</span>
                        <span class="unit">번 좌석</span>
                    </div>
                    <div v-else class="no-seat">
                        현재 이용 중인 좌석이 없습니다.
                    </div>
                </div>
                <div class="card-footer" v-if="reservationStore.myActiveSeat">
                    <p>퇴실 시 반드시 이용 종료를 눌러주세요.</p>
                </div>
            </div>

            <div class="action-grid">
                <div class="action-item primary" @click="$router.push('/seats')">
                    <div class="icon">🪑</div>
                    <div class="text">
                        <h4>좌석 배정</h4>
                        <p>빈 좌석 확인 및 예약</p>
                    </div>
                </div>

                <div v-if="reservationStore.myActiveSeat" class="action-item danger" @click="handleEndUse">
                    <div class="icon">🏃</div>
                    <div class="text">
                        <h4>퇴실 하기</h4>
                        <p>이용 종료 및 정산</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-wrapper {
    width: 100%;
    min-height: 100vh;
    background-color: var(--bg-color);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.top-bar {
    width: 100%;
    height: 60px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.top-bar h2 {
    font-size: 18px;
    color: var(--primary-color);
}

.logout-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 12px;
    color: #666;
}

.content-area {
    width: 100%;
    max-width: 480px;
    padding: 30px 20px;
}

.welcome-msg {
    margin-bottom: 30px;
}

.welcome-msg h3 {
    font-size: 24px;
    margin-bottom: 5px;
}

.highlight {
    color: var(--accent-color);
}

.welcome-msg p {
    color: #888;
}

/* 상태 카드 디자인 */
.status-card {
    background: white;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    margin-bottom: 30px;
    border: 1px solid #eee;
    transition: all 0.3s;
}

.status-card.active {
    border-left: 5px solid var(--accent-color);
}

.card-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    margin-bottom: 20px;
    font-weight: 700;
}

.live-badge {
    background: var(--accent-color);
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
}

.live-badge.inactive {
    background: #ccc;
}

.card-body {
    text-align: center;
    margin-bottom: 20px;
}

.seat-number {
    font-size: 56px;
    font-weight: 800;
    color: var(--primary-color);
    line-height: 1;
}

.unit {
    font-size: 18px;
    color: #666;
    margin-left: 5px;
}

.no-seat {
    color: #aaa;
    font-size: 16px;
    padding: 20px 0;
}

.card-footer {
    border-top: 1px dashed #eee;
    padding-top: 15px;
    font-size: 12px;
    color: #999;
    text-align: center;
}

/* 액션 버튼 그리드 */
.action-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.action-item {
    background: white;
    padding: 20px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
}

.action-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.action-item.primary {
    border-color: #E3F2FD;
}

.action-item.danger {
    background-color: #FFEBEE;
    border-color: #FFCDD2;
}

.icon {
    font-size: 32px;
    margin-right: 20px;
    background: #f8f9fa;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
}

.text h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
}

.text p {
    margin: 0;
    font-size: 13px;
    color: #888;
}
</style>