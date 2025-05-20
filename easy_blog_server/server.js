const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mime = require('mime-types');// 用于获取文件的MIME类型, 用于前端显示图片


// 初始化express应用
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/easy_blog', { useNewUrlParser: true, useUnifiedTopology: true })   //数据库名称为easy_blog_article，可以自己更改
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// 定义文章模型
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('articles', articleSchema); // 定义模型, 模型名称为Article, 模型的schema为articleSchema
// 用于前端显示图片,防止照片类型错误
mime.types.webp = 'image/webp';
mime.types.png = 'image/png';
mime.types.jpg = 'image/jpg';
mime.types.jpeg = 'image/jpeg';
mime.types.gif = 'image/gif';

//admin 密码
let adminPassword = '123456'; // 初始密码, 替换为实际的密码
const SECRET_KEY = 'your_jwt_secret_key';// 替换为你的密钥, 用于 JWT 签名和验证

// 照片上传配置
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const { ext, name } = path.parse(file.originalname);
    let finalName = file.originalname;
    let counter = 1;

    while (fs.existsSync(path.join(__dirname, 'public/uploads', finalName))) {
      finalName = `${name}-${counter}${ext}`;
      counter++;
    }
    cb(null, finalName);
  }
});
const upload = multer({ storage });

// admin认证中间件错误处理
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '未提供凭证' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: '无效凭证' });
    if (user.role !== 'admin') return res.status(403).json({ error: '权限不足' });
    req.user = user;
    next();
  });
};

//如果有token，而且admin认证通过，就返回200，否则继续执行下一个中间件，或是跳过
const authpass = (req, res, next) => {
  if (!req.headers.authorization) return next();
  const authParts = req.headers.authorization.split(' ');
  if (authParts.length !== 2) return next();
  const token = authParts[1];
  if (!token) return next(); 
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err || user.role!== 'admin') return next();  // 如果没有token或者token验证失败，继续执行下一个中间件，或是跳过,这里是为了避免重复登录
    if (user.role === 'admin') {
      return res.status(200).json({ message: '认证成功,前往后台' });
    }
  });
}

// 登录接口
app.post('/auth/login', authpass,(req, res) => {
  const { username, password } = req.body;
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ error: '缺少用户名或密码' });
  }
  if (username === "admin" && password === adminPassword) {                 // 这里可以自己写一个数据库查询（但是这是一个简单后台），所以我写死了admin账号和密码
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '1d' });
    return res.json({ token });
  }
  res.status(401).json({ error: '登录失败' });
});


// 密码修改（要登陆）
app.put('/admin/change-password', authenticate, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword !== adminPassword) return res.status(400).json({ error: '原密码错误' });
  adminPassword = newPassword;
  res.json({ message: '密码更新成功' });
});


// 图片管理接口

// 上传图片（要登陆）
app.post('/photos', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未上传文件' }); // 处理文件缺失的情况
  }
  res.json({ message: '上传成功' });
});

//获取图片接口(可以不登录)
app.get('/photos', (req, res) => {
  const imgDir = path.join(__dirname, '/public/uploads');
  // 读取目录并过滤出图片文件（支持常见图片格式）
  fs.readdir(imgDir, { withFileTypes: true }, (err, dirents) => {
      if (err) {
          console.log(err);
          return res.status(502).json({ message: '获取失败' });
      }
      // 过滤出普通文件，并检查扩展名是否为图片
      const imageFiles = dirents
          .filter(dirent => dirent.isFile())
          .map(dirent => dirent.name)
          .filter(filename => {
              const ext = filename.split('.').pop().toLowerCase();
              return ['jpg', 'jpeg', 'png', 'gif', 'webp','icon'].includes(ext);// 支持的图片格式,可以自己添加
          });
      // 如果没有图片，返回空数组
      if (imageFiles.length === 0) {
          res.json({ message: '暂无图片', files: [] });
      } else {
          res.json({ files: imageFiles }); // 返回纯图片文件名数组
      }
  });
});

// 删除操作（要登录）
app.delete('/photos/:filename', authenticate, async (req, res) => {
  const targetFile = path.join(__dirname, 'public/uploads', req.params.filename);
  
  try {
    await fs.promises.unlink(targetFile);
    photos = photos.filter(p => p.filename !== req.params.filename);
    res.sendStatus(204);
  }
  catch (error) {
    console.error(error);
    res.sendStatus(404);
  }

})

// 文章管理接口(在下面)


// 我的的是MongoDB的_id，这个是唯一id，用于删除文章，修改文章，查询文章等操作，在前端显示的时候，
// 不需要显示这个id，
//  所以我没有在前端显示这个id，但是在后端显示这个id，用于删除文章，修改文章，查询文章等操作


// 获取文章列表（可以不登录）
// 文章接口
app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: '获取失败' });
  }
});

app.post('/articles', authenticate, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: '创建失败' });
  }
});

app.put('/articles/:id', authenticate, async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
});

app.delete('/articles/:id', authenticate, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: '删除失败' });
  }
});

app.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    article ? res.json(article) : res.status(404).json({ error: '文章不存在' });
  } catch (error) {
    res.status(500).json({ error: '获取失败' });
  }
});



// 启动服务器
const PORT = 3000;    // 端口号
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));