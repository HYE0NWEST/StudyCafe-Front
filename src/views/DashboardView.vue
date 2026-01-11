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
    height: 70px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 0;
    z-index: 100;
}

.top-bar h2 {
    font-size: 20px;
    color: white;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0;
}

.logout-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    color: white;
    font-weight: 500;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
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
    font-size: 28px;
    margin-bottom: 8px;
    font-weight: 700;
    color: var(--text-dark);
}

.highlight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.welcome-msg p {
    color: #888;
}

/* 상태 카드 디자인 */
.status-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: var(--shadow-lg);
    margin-bottom: 30px;
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.status-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--border-color);
    transition: all 0.3s ease;
}

.status-card.active {
    border-color: var(--accent-color);
    box-shadow: var(--shadow-xl);
}

.status-card.active::before {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    width: 5px;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
}

.live-badge.inactive {
    background: #cbd5e1;
    color: #64748b;
}

.card-body {
    text-align: center;
    margin-bottom: 20px;
}

.seat-number {
    font-size: 64px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    padding: 24px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.action-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
    transition: left 0.5s;
}

.action-item:hover::before {
    left: 100%;
}

.action-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-color);
}

.action-item.primary {
    border-color: #e0e7ff;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.action-item.danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%);
    border-color: #fecaca;
}

.action-item.danger:hover {
    border-color: var(--danger);
}

.icon {
    font-size: 32px;
    margin-right: 20px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    width: 64px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
}

.action-item:hover .icon {
    transform: scale(1.1) rotate(5deg);
    box-shadow: var(--shadow-md);
}

.action-item.danger .icon {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
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