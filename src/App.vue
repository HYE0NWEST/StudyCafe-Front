<template>
  <router-view />
</template>

<style>
/* 구글 폰트 불러오기 (Noto Sans KR) */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

:root {
  --primary-color: #1a1f2e; /* 딥 네이비 */
  --accent-color: #4f46e5;  /* 인디고 블루 */
  --accent-hover: #6366f1;
  --bg-color: #f8fafc;      /* 연한 회색 배경 */
  --white: #FFFFFF;
  --text-dark: #1e293b;
  --text-light: #64748b;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
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