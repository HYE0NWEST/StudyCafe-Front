<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
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

// [구역별 데이터 나누기]
// DB에서 받아온 100개 데이터를 번호대별로 잘라서 보여줍니다.
const focusZoneSeats = computed(() => store.seats.filter(s => s.seatNumber >= 1 && s.seatNumber <= 30));
const laptopZoneSeats = computed(() => store.seats.filter(s => s.seatNumber >= 31 && s.seatNumber <= 60));
const loungeZoneSeats = computed(() => store.seats.filter(s => s.seatNumber >= 61 && s.seatNumber <= 100));

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
    <div class="page-container">
        <div class="header-nav">
            <button class="back-icon" @click="router.push('/dashboard')">◀ 나가기</button>
            <h2>좌석 배치도</h2>
            <div class="user-info">{{ auth.username }}님</div>
        </div>

        <div class="legend">
            <span><i class="dot free"></i>가능</span>
            <span><i class="dot occupied"></i>이용중</span>
            <span><i class="dot mine"></i>내선택</span>
        </div>

        <div class="map-container">

            <div class="room focus-room">
                <div class="room-title">🤫 Focus Zone (집중실)</div>
                <div class="grid-focus">
                    <div v-for="seat in focusZoneSeats" :key="seat.seatNumber" class="seat-item square"
                        :class="getClass(seat)" @click="clickSeat(seat)">
                        {{ seat.seatNumber }}
                    </div>
                </div>
            </div>

            <div class="hallway">
                <div class="facility entrance">🚪 입구</div>
                <div class="facility kiosk">🖥️ 키오스크</div>
                <div class="facility coffee">☕ 카페테리아</div>
                <div class="facility wc">🚻 화장실</div>
            </div>

            <div class="right-wing">
                <div class="room laptop-room">
                    <div class="room-title">💻 Laptop Zone</div>
                    <div class="grid-laptop">
                        <div v-for="seat in laptopZoneSeats" :key="seat.seatNumber" class="seat-item rect"
                            :class="getClass(seat)" @click="clickSeat(seat)">
                            {{ seat.seatNumber }}
                        </div>
                    </div>
                </div>

                <div class="room lounge-room">
                    <div class="room-title">🛋️ Lounge</div>
                    <div class="grid-lounge">
                        <div v-for="seat in loungeZoneSeats" :key="seat.seatNumber" class="seat-item circle"
                            :class="getClass(seat)" @click="clickSeat(seat)">
                            {{ seat.seatNumber }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay">
            <div class="modal-card">
                <h4>예약 확정</h4>
                <p class="modal-desc">{{ store.mySeat }}번 좌석을 이용하시겠습니까?</p>

                <div class="time-options">
                    <button v-for="h in [1, 2, 4, 6]" :key="h" :class="{ active: selectedHours === h }"
                        @click="selectedHours = h">
                        {{ h }}시간
                    </button>
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
.page-container {
    width: 100vw;
    height: 100vh;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header-nav {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-md);
    z-index: 10;
    position: sticky;
    top: 0;
}

.header-nav h2 {
    color: white;
    font-weight: 700;
    margin: 0;
    font-size: 20px;
}

.back-icon {
    border: none;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.back-icon:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
}

.user-info {
    font-weight: 600;
    color: white;
    font-size: 15px;
}

.legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 14px;
    background: white;
    font-size: 13px;
    color: var(--text-dark);
    box-shadow: var(--shadow-sm);
    font-weight: 500;
}

.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
}

.dot.free {
    background: white;
    border: 1px solid #ccc;
}

.dot.occupied {
    background: #E74C3C;
}

.dot.mine {
    background: #3498DB;
}

/* 맵 컨테이너 (전체 배치도) */
.map-container {
    flex: 1;
    padding: 30px;
    display: flex;
    gap: 30px;
    justify-content: center;
    overflow-y: auto;
    max-width: 1200px;
    margin: 0 auto;
}

/* 공통 룸 스타일 */
.room {
    background: white;
    border: 2px solid #ddd;
    border-radius: 15px;
    padding: 20px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.room-title {
    position: absolute;
    top: -12px;
    left: 20px;
    background: white;
    padding: 0 10px;
    font-weight: bold;
    color: #2C3E50;
    font-size: 14px;
}

/* 1. Focus Zone (왼쪽) */
.focus-room {
    width: 300px;
    display: flex;
    justify-content: center;
}

.grid-focus {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3열 배열 */
    gap: 15px;
}

.seat-item.square {
    width: 60px;
    height: 50px;
    border-radius: 4px;
    /* 각진 책상 느낌 */
    border-top: 4px solid #ddd;
    /* 책상 파티션 느낌 */
}

/* 2. 복도 (가운데) */
.hallway {
    width: 120px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
}

.facility {
    padding: 10px;
    background: #e0e0e0;
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
    width: 100%;
    color: #555;
    font-weight: bold;
}

.facility.entrance {
    background: #81C784;
    color: white;
    height: 60px;
    line-height: 40px;
}

/* 3. 오른쪽 날개 (Laptop + Lounge) */
.right-wing {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.laptop-room {
    min-height: 200px;
}

.grid-laptop {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
}

.seat-item.rect {
    width: 50px;
    height: 40px;
    border-radius: 8px;
}

.lounge-room {
    flex: 1;
    background-color: #fcfcfc;
    /* 약간 다른 바닥 색 */
    border-style: dashed;
}

.grid-lounge {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.seat-item.circle {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    /* 소파/원형 테이블 느낌 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 공통 좌석 스타일 */
.seat-item {
    background: white;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    color: #555;
    transition: all 0.2s;
}

.seat-item:hover {
    transform: scale(1.05);
    border-color: #3498DB;
}

.seat-item.occupied {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border-color: #ef4444;
    opacity: 0.6;
    pointer-events: none;
    box-shadow: var(--shadow-sm);
}

.seat-item.mine {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
    }
    50% {
        box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
    }
}

.seat-item.locked {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
    color: white;
    box-shadow: var(--shadow-sm);
}

/* 모달 스타일 (동일 유지) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-card {
    background: white;
    padding: 32px;
    border-radius: 24px;
    width: 360px;
    text-align: center;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-card h4 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 15px;
    font-size: 22px;
    font-weight: 700;
}

.modal-desc {
    color: var(--text-light);
    margin-bottom: 20px;
    font-size: 14px;
}

.time-options {
    display: flex;
    gap: 5px;
    margin-bottom: 20px;
}

.time-options button {
    flex: 1;
    padding: 10px;
    border: 1px solid #eee;
    background: white;
    border-radius: 8px;
    cursor: pointer;
}

.time-options button.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    color: var(--accent-color);
    border-color: var(--accent-color);
    font-weight: 600;
    box-shadow: var(--shadow-sm);
}

.modal-actions {
    display: flex;
    gap: 10px;
}

.modal-actions button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.cancel-btn {
    background: #f5f5f5;
    color: #666;
}

.confirm-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
}

.confirm-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* 반응형 (모바일 대응) */
@media (max-width: 768px) {
    .map-container {
        flex-direction: column;
        align-items: center;
    }

    .hallway {
        flex-direction: row;
        width: 100%;
        height: auto;
    }

    .facility {
        width: auto;
        flex: 1;
    }

    .focus-room,
    .laptop-room,
    .lounge-room {
        width: 100%;
        max-width: 350px;
    }
}
</style>