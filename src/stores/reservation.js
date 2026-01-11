import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/api/axios';
import { useAuthStore } from './auth';

export const useReservationStore = defineStore('reservation', () => {
    const auth = useAuthStore();
    const seats = ref([]);
    const mySeat = ref(null);
    const myActiveSeat = ref(null); // [추가] 내가 이용 중인 좌석 번호 저장

    // 1. 좌석 조회
    const fetchSeats = async () => {
        try {
            const res = await axios.get('/api/reservations/seats');
            seats.value = res.data;
        } catch (e) { console.error(e); }
    };

    // [추가] 내 좌석 번호 확인 API 호출
    const checkMyActiveSeat = async () => {
        if (!auth.userId) return;
        try {
            const res = await axios.get(`/api/reservations/my-seat?userId=${auth.userId}`);
            myActiveSeat.value = res.data; // 번호 저장 (없으면 null)
        } catch (e) {
            console.error("내 좌석 조회 실패", e);
        }
    };

    // 2. 좌석 선점
    const preOccupy = async (seatNumber) => {
        if (!auth.userId) {
            alert("로그인이 필요합니다.");
            return false;
        }
        try {
            await axios.post('/api/reservations/pre-occupy', {
                userId: auth.userId,
                seatNumber
            });
            mySeat.value = seatNumber;
            await fetchSeats();
            return true;
        } catch (e) {
            let errorMsg = '좌석 선점에 실패했습니다.';
            if (e.response?.data) {
                if (typeof e.response.data === 'string') {
                    errorMsg = e.response.data;
                } else if (e.response.data.message) {
                    errorMsg = e.response.data.message;
                }
            }
            alert(errorMsg);
            return false;
        }
    };

    // 3. 선점 취소
    const cancelPreOccupy = async () => {
        if (!mySeat.value) return;
        try {
            await axios.post('/api/reservations/cancel', {
                userId: auth.userId,
                seatNumber: mySeat.value
            });
        } catch (e) {
            console.log("취소 중 에러:", e);
        } finally {
            mySeat.value = null;
            await fetchSeats();
        }
    };

    // 4. 예약 확정
    const confirm = async (hours) => {
        try {
            const res = await axios.post('/api/reservations/confirm', {
                userId: auth.userId,
                seatNumber: mySeat.value,
                hours
            });
            // 응답이 문자열이거나 객체일 수 있으므로 처리
            let message = res.data;
            if (typeof res.data === 'object' && res.data.message) {
                message = res.data.message;
            }
            alert(message || '예약이 확정되었습니다.');
            mySeat.value = null;

            await checkMyActiveSeat(); // [추가] 예약 성공했으니 내 좌석 정보 갱신
            return true;
        } catch (e) {
            let errorMsg = '예약 확정에 실패했습니다.';
            if (e.response?.data) {
                if (typeof e.response.data === 'string') {
                    errorMsg = e.response.data;
                } else if (e.response.data.message) {
                    errorMsg = e.response.data.message;
                }
            }
            alert(errorMsg);
            return false;
        }
    };

    // 5. 이용 종료
    const endUse = async () => {
        if (!auth.userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        if (!window.confirm("정말 퇴실하시겠습니까?")) return;

        try {
            const res = await axios.post('/api/reservations/end-use', {
                userId: auth.userId,
                seatNumber: 0
            });
            
            let message = "이용이 종료되었습니다.";
            if (res.data) {
                if (typeof res.data === 'string') {
                    message = res.data;
                } else if (res.data.message) {
                    message = res.data.message;
                }
            }
            alert(message);

            await fetchSeats();
            await checkMyActiveSeat(); // [추가] 퇴실했으니 내 좌석 정보 갱신(지우기)
            return true;
        } catch (e) {
            let errorMsg = '퇴실 처리에 실패했습니다.';
            if (e.response?.data) {
                if (typeof e.response.data === 'string') {
                    errorMsg = e.response.data;
                } else if (e.response.data.message) {
                    errorMsg = e.response.data.message;
                }
            }
            alert(errorMsg);
            return false;
        }
    };

    // [중요] checkMyActiveSeat, myActiveSeat가 리턴에 포함되어야 함
    return { seats, mySeat, myActiveSeat, fetchSeats, checkMyActiveSeat, preOccupy, cancelPreOccupy, confirm, endUse };
});