<template>
    <div class="login-container">
        <div class="login-card">
            <h2>后台登录</h2>
            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label>用户名</label>
                    <input 
                        type="text" 
                        v-model="form.username"
                        placeholder="请输入用户名"
                        required
                    >
                </div>
                <div class="input-group">
                    <label>密码</label>
                    <input
                        type="password"
                        v-model="form.password"
                        placeholder="请输入密码"
                        required
                    >
                </div>
                <button :disabled="loading" type="submit">
                    {{ loading ? '登录中...' : '立即登录' }}
                </button>
                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const api = axios.create({
  baseURL: 'http://localhost:3000'
});

const form = ref({
    username: '',
    password: ''
});
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
    errorMessage.value = '';
    loading.value = true;
    
    try {
        const response = await api.post('/auth/login', {
            username: form.value.username,
            password: form.value.password
        });
        
        localStorage.setItem('authToken', response.data.token);
        router.push('/');
    } catch (error) {
        errorMessage.value = error.response?.data?.error || '登录失败，请重试';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f0f4f8;
}

.login-card {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease;
}

.login-card:hover {
    transform: translateY(-2px);
}

h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.input-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    transition: border-color 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

button {
    width: 100%;
    padding: 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover:not(:disabled) {
    background: #2980b9;
    transform: translateY(-1px);
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error-message {
    margin-top: 1rem;
    color: #e74c3c;
    text-align: center;
    font-size: 0.9rem;
}
</style>