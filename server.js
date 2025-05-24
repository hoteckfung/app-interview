const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".csv": "text/csv",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
};

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);

  // Normalize URL to prevent directory traversal attacks
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  // Handle spaces in file names
  filePath = decodeURIComponent(filePath);
  console.log(`Looking for file: ${filePath}`);

  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err.code);
      if (err.code === "ENOENT") {
        // Page not found
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(
          `<h1>404 Not Found</h1><p>The requested file ${filePath} was not found on this server.</p>`,
          "utf-8"
        );
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      console.log(
        `Successfully served file: ${filePath} with content type: ${contentType}`
      );
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
