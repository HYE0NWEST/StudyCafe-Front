<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useReservationStore } from '@/stores/reservation';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const store = useReservationStore();
const auth = useAuthStore();

const showModal = ref(false);
const selectedHours = ref(2);
let timer = null;

onMounted(() => {
    if (!auth.userId) {
        alert("로그인이 필요합니다.");
        router.push('/');
        return;
    }
    store.fetchSeats();
    timer = setInterval(() => store.fetchSeats(), 3000);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});

const clickSeat = async (seat) => {
    if (seat.status === 'OCCUPIED') return alert("이미 이용 중인 좌석입니다.");
    if (seat.status === 'LOCKED' && seat.seatNumber !== store.mySeat) return alert("다른 사람이 결제 중입니다.");

    if (seat.seatNumber === store.mySeat) {
        showModal.value = true;
        return;
    }

    const success = await store.preOccupy(seat.seatNumber);
    if (success) showModal.value = true;
};

const handleCancel = async () => {
    await store.cancelPreOccupy();
    showModal.value = false;
};

const doPay = async () => {
    const success = await store.confirm(selectedHours.value);
    if (success) {
        showModal.value = false;
        router.push('/dashboard');
    }
};

const getClass = (s) => {
    if (s.status === 'OCCUPIED') return 'occupied';
    if (s.seatNumber === store.mySeat) return 'mine';
    if (s.status === 'LOCKED') return 'locked';
    return 'free';
}
</script>

<template>
    <div class="seat-page">
        <div class="nav-header">
            <button class="icon-btn" @click="router.push('/dashboard')">✕</button>
            <h3>좌석 선택</h3>
            <div style="width: 30px;"></div>
        </div>

        <div class="legend-bar">
            <div class="legend-item"><span class="dot free"></span>가능</div>
            <div class="legend-item"><span class="dot occupied"></span>사용중</div>
            <div class="legend-item"><span class="dot mine"></span>내선택</div>
        </div>

        <div class="screen-area">SCREEN / ENTRANCE</div>

        <div class="seat-grid-wrapper">
            <div class="seat-grid">
                <div v-for="seat in store.seats" :key="seat.seatNumber" 
                     class="seat-box" :class="getClass(seat)"
                     @click="clickSeat(seat)">
                    <span class="num">{{ seat.seatNumber }}</span>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay">
            <div class="modal-card">
                <div class="modal-header">
                    <h4>예약 확정</h4>
                    <p>{{ store.mySeat }}번 좌석을 선택하셨습니다.</p>
                </div>
                
                <div class="time-selector">
                    <label>이용 시간 선택</label>
                    <div class="time-options">
                        <button v-for="h in [1, 2, 4, 6]" :key="h"
                                :class="{ active: selectedHours === h }"
                                @click="selectedHours = h">
                            {{ h }}시간
                        </button>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="cancel-btn" @click="handleCancel">취소</button>
                    <button class="confirm-btn" @click="doPay">결제하기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.seat-page {
    width: 100vw;
    height: 100vh;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.nav-header {
    width: 100%;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-bottom: 1px solid #f0f0f0;
}

.icon-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: #333;
}

.legend-bar {
    display: flex;
    gap: 20px;
    padding: 15px;
    background: #f9f9f9;
    width: 100%;
    justify-content: center;
    font-size: 13px;
    color: #666;
}

.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
}

.dot.free { background: #E0E0E0; border: 1px solid #ccc; }
.dot.occupied { background: #E74C3C; }
.dot.mine { background: #3498DB; }

.screen-area {
    width: 80%;
    height: 30px;
    background: #eee;
    margin: 20px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #aaa;
    letter-spacing: 2px;
}

.seat-grid-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.seat-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* 모바일 기준 6열 */
    gap: 12px;
    max-width: 500px;
}

.seat-box {
    width: 50px;
    height: 50px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
    color: #555;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: transform 0.1s;
}

.seat-box:active { transform: scale(0.9); }

.seat-box.occupied { background-color: #fceceb; color: #E74C3C; border-color: #E74C3C; opacity: 0.7;}
.seat-box.locked { background-color: #fff8e1; border-color: #FFC107; }
.seat-box.mine { background-color: #3498DB; color: white; border-color: #3498DB; box-shadow: 0 4px 10px rgba(52, 152, 219, 0.4); }

/* 모달 */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: flex-end; /* 모바일에서는 아래에서 올라오는 느낌 */
    z-index: 999;
}

.modal-card {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 20px 20px 0 0;
    padding: 30px;
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.modal-header h4 { margin: 0 0 5px; font-size: 20px; }
.modal-header p { color: #888; margin-bottom: 25px; }

.time-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 10px 0 30px;
}

.time-options button {
    padding: 10px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 8px;
    color: #666;
}

.time-options button.active {
    border-color: var(--accent-color);
    background-color: #E3F2FD;
    color: var(--accent-color);
    font-weight: bold;
}

.modal-actions {
    display: flex;
    gap: 10px;
}

.modal-actions button {
    flex: 1;
    padding: 15px;
    border-radius: 12px;
    border: none;
    font-weight: bold;
    font-size: 16px;
}

.cancel-btn { background: #f0f0f0; color: #666; }
.confirm-btn { background: var(--primary-color); color: white; }
</style>