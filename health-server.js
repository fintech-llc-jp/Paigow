const http = require('http');
const fs = require('fs');
const path = require('path');

// Cloud RunのPORT環境変数を必ず使用
const PORT = process.env.PORT || 8080;

console.log(`🚀 Starting server on port ${PORT}`);
console.log(`📡 Listening on 0.0.0.0:${PORT}`);

const server = http.createServer((req, res) => {
  const startTime = Date.now();
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Cloud Runヘルスチェック対応
  if (req.url === '/' && req.method === 'GET') {
    // ルートでのGETリクエストはindex.htmlを返す
    const filePath = path.join(__dirname, 'dist', 'index.html');
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('❌ Failed to read index.html:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      
      res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0'
      });
      res.end(data);
      console.log(`✅ Served index.html in ${Date.now() - startTime}ms`);
    });
    return;
  }

  // 静的ファイル配信
  if (req.url.startsWith('/assets/')) {
    const filePath = path.join(__dirname, 'dist', req.url);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      
      const ext = path.extname(filePath);
      const contentType = {
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      }[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000'
      });
      res.end(data);
      console.log(`✅ Served ${req.url} in ${Date.now() - startTime}ms`);
    });
    return;
  }

  // SPAルーティング - 全てのその他のリクエストはindex.htmlを返す
  const filePath = path.join(__dirname, 'dist', 'index.html');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('❌ Failed to read index.html for SPA routing:', err);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
    console.log(`✅ SPA routing for ${req.url} in ${Date.now() - startTime}ms`);
  });
});

// サーバーエラーハンドリング
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Cloud Run向けに0.0.0.0でリッスン
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on 0.0.0.0:${PORT}`);
  console.log(`📊 Process info - PID: ${process.pid}, Node: ${process.version}`);
  console.log(`🏥 Health check: Server responds to GET / requests`);
});