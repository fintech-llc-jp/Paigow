const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

console.log('Starting server on port', PORT);

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Serve index.html for all requests (SPA)
  const filePath = path.join(__dirname, 'dist', 'index.html');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server started successfully on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle server startup errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});