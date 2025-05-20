<template>
    <div class="photo-manager">
      <!-- 上传控件 -->
      <div class="upload-area">
        <input 
          type="file" 
          id="fileInput" 
          @change="handleUpload"
          accept="image/*"
          hidden
        >
        <label for="fileInput" class="upload-btn">
          <span class="plus-icon">+</span>
          上传照片
        </label>
      </div>
  
      <!-- 照片列表 -->
      <div v-if="loading" class="loading">加载中...</div>
      
      <div class="photo-grid">
        <div 
          v-for="(photo, index) in photos"
          :key="index"
          class="photo-card"
        >
          <img 
            :src="photo.url" 
            :alt="photo.originalName"
            class="photo-img"
            @error="handleImageError"
          >
          <div class="photo-info">
            <span class="filename">{{ photo.originalName }}</span>
            <button 
              class="delete-btn"
              @click="deletePhoto(photo.filename)"
            >删除</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:3000'
  });
  
  const photos = ref([]);
  const loading = ref(true);
  
  const fetchPhotos = async () => {
    try {
      const { data } = await api.get('/photos');
      photos.value = data.files.map(filename => ({
        filename,
        originalName: filename,
        url: `${api.defaults.baseURL}/uploads/${filename}`
      }));
    } catch (error) {
      alert('获取照片失败');
    } finally {
      loading.value = false;
    }
  };
  
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      await api.post('/photos', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      await fetchPhotos();
      alert('上传成功');
    } catch (error) {
    //   alert('上传失败');
    }
  };
  
  const deletePhoto = async (filename) => {
    if (!confirm('确定删除？')) return;
    try {
        await api.delete(`/photos/${filename}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        // 直接更新本地数据避免重复请求
        photos.value = photos.value.filter(p => p.filename !== filename);
        alert('删除成功');
    } catch (error) {
        // 仅在真正删除失败时提示
        if (error.response?.status !== 404) {
            alert('删除失败: ' + (error.response?.data?.error || '服务器错误'));
            }
        }
    location.reload();
    };
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5Ij7lm77niYc8L3RleHQ+PC9zdmc+';
  };
  
  onMounted(fetchPhotos);
</script>

<style scoped>
  .photo-manager {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .upload-area {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .upload-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.8rem 1.5rem;
    background: #3498db;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .upload-btn:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .plus-icon {
    display: inline-block;
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
  
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }
  
  .photo-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .photo-card:hover {
    transform: translateY(-3px);
  }
  
  .photo-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #f5f5f5;
  }
  
  .photo-info {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .filename {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    color: #444;
  }
  
  .delete-btn {
    margin-left: 1rem;
    padding: 0.3rem 0.8rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .delete-btn:hover {
    background: #c0392b;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
</style>