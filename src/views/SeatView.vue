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

// [화면 진입 시 실행]
onMounted(() => {
    if (!auth.userId) {
        alert("로그인이 필요합니다.");
        router.push('/');
        return;
    }

    store.fetchSeats();

    timer = setInterval(() => {
        store.fetchSeats();
    }, 3000);
});

// [화면 떠날 때 실행]
onUnmounted(() => {
    if (timer) clearInterval(timer);
});

// [좌석 클릭 이벤트]
const clickSeat = async (seat) => {
    if (seat.status === 'OCCUPIED') {
        alert("이미 이용 중인 좌석입니다.");
        return;
    }
    if (seat.status === 'LOCKED' && seat.seatNumber !== store.mySeat) {
        alert("다른 사람이 결제 중인 좌석입니다.");
        return;
    }

    if (seat.seatNumber === store.mySeat) {
        showModal.value = true;
        return;
    }

    const success = await store.preOccupy(seat.seatNumber);
    if (success) {
        showModal.value = true;
    }
};

// [취소 버튼 로직]
const handleCancel = async () => {
    await store.cancelPreOccupy();
    showModal.value = false;
};

// [결제 확정 로직]
const doPay = async () => {
    const success = await store.confirm(selectedHours.value);

    if (success) {
        showModal.value = false;
        router.push('/dashboard'); // 성공 시 대시보드로 이동
    }
};

// [CSS 클래스 결정]
const getClass = (s) => {
    if (s.status === 'OCCUPIED') return 'occupied';
    if (s.seatNumber === store.mySeat) return 'mine';
    if (s.status === 'LOCKED') return 'locked';
    return 'free';
}
</script>

<template>
    <div class="container">
        <div class="header">
            <div class="nav-bar">
                <button class="back-btn" @click="router.push('/dashboard')">◀ 메인 화면</button>
                <h2>좌석 선택</h2>
                <div class="spacer"></div>
            </div>

            <p>사용자: <strong>{{ auth.username }}</strong></p>

            <div class="legend">
                <span class="badge free"></span> 가능
                <span class="badge mine"></span> 내 선택
                <span class="badge locked"></span> 타인 결제중
                <span class="badge occupied"></span> 이용중
            </div>
        </div>

        <div class="grid">
            <div v-for="seat in store.seats" :key="seat.seatNumber" class="seat" :class="getClass(seat)"
                @click="clickSeat(seat)">
                {{ seat.seatNumber }}
            </div>
        </div>

        <div v-if="showModal" class="modal-bg">
            <div class="modal">
                <h3>⏰ 이용 시간 선택</h3>
                <p>{{ store.mySeat }}번 좌석을 예약하시겠습니까?</p>

                <select v-model="selectedHours">
                    <option :value="1">1시간</option>
                    <option :value="2">2시간</option>
                    <option :value="4">4시간</option>
                    <option :value="6">6시간</option>
                </select>

                <div class="btns">
                    <button class="pay-btn" @click="doPay">결제 및 확정</button>
                    <button class="cancel-btn" @click="handleCancel">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 50px;
}

.header {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
    max-width: 500px;
}

/* [추가됨] 네비게이션 바 스타일 */
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.back-btn {
    background: transparent;
    border: 1px solid #ccc;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    color: #555;
}

.back-btn:hover {
    background: #f0f0f0;
}

.spacer {
    width: 80px;
}

/* 뒤로가기 버튼 크기만큼 공간 확보 */

/* 범례 스타일 */
.legend {
    margin-top: 10px;
    display: flex;
    gap: 15px;
    justify-content: center;
    font-size: 14px;
}

.badge {
    display: inline-block;
    width: 15px;
    height: 15px;
    border: 1px solid #ccc;
    vertical-align: middle;
    margin-right: 5px;
}

.badge.free {
    background: white;
}

.badge.mine {
    background: #2196F3;
}

.badge.locked {
    background: #FFC107;
}

.badge.occupied {
    background: #F44336;
}

/* 그리드 스타일 */
.grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    width: 500px;
}

.seat {
    height: 40px;
    border: 1px solid #bbb;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: transform 0.1s;
}

.seat:active {
    transform: scale(0.95);
}

/* 상태별 색상 */
.free {
    background-color: white;
    color: black;
}

.free:hover {
    background-color: #f0f0f0;
    border-color: #999;
}

.mine {
    background-color: #2196F3;
    color: white;
    border-color: #0b7dda;
}

.locked {
    background-color: #FFC107;
    color: black;
    cursor: not-allowed;
    opacity: 0.8;
}

.occupied {
    background-color: #F44336;
    color: white;
    cursor: not-allowed;
    border-color: #d32f2f;
}

/* 모달 스타일 */
.modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 320px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal select {
    width: 100%;
    padding: 10px;
    margin: 20px 0;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btns {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.btns button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
}

.pay-btn {
    background-color: #4CAF50;
    color: white;
}

.pay-btn:hover {
    background-color: #45a049;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
}

.cancel-btn:hover {
    background-color: #d32f2f;
}
</style>