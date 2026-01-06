<template>
  <router-view />
</template>

<style>
/* 구글 폰트 불러오기 (Noto Sans KR) */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

:root {
  --primary-color: #2C3E50; /* 딥 네이비 */
  --accent-color: #3498DB;  /* 밝은 블루 */
  --bg-color: #F0F2F5;      /* 연한 회색 배경 */
  --white: #FFFFFF;
  --text-dark: #333333;
  --text-light: #888888;
  --success: #2ECC71;
  --danger: #E74C3C;
}

* {
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-dark);
}

#app {
  max-width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  cursor: pointer;
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}
</style>