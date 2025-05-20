<template>
    <header>
      <div class="header-content">
        <h1>📝 博客管理系统</h1>
        <nav>
          <RouterLink to="/article">文章管理</RouterLink>
          <RouterLink to="/photos">图片管理</RouterLink>
          <RouterLink to="/admin">系统设置</RouterLink>
        </nav>
      </div>
    </header>
</template>
  
<style scoped>
  header {
    background: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  nav {
    display: flex;
    gap: 2rem;
  }
  
  a {
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
  }
  
  a:hover {
    color: #3498db;
    background: rgba(52, 152, 219, 0.1);
    transform: translateY(-2px);
  }
  
  a.router-link-active {
    color: #3498db;
    font-weight: 600;
  }
  
  a.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
    animation: underline 0.3s ease;
  }
  
  @keyframes underline {
    from { width: 0 }
    to { width: 60% }
  }
</style>