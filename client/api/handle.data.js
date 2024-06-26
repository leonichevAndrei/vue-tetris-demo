import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import lockFile from 'lockfile';

// Getting the path to the current directory:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path to the JSON file:
const filePath = path.join(__dirname, '/data.json');
// Path to the lock file:
const lockPath = filePath + '.lock';
// Set attempts to access the file and timeout between them:
const retriesValue = 50;
const delayValue = 20;

// Function to retry operations:
const withRetry = (fn, retries = retriesValue, delay = delayValue) => {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (retries === 0) {
            reject(err);
          } else {
            retries -= 1;
            setTimeout(attempt, delay);
          }
        });
    };
    attempt();
  });
};

function responseMe(res, code, json) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(json));
}

const requestListener = (req, res) => {
  // Handle GET requests:
  if (req.method === 'GET' && req.url === '/api/handleData') {
    withRetry(
      () =>
        new Promise((resolve, reject) => {
          lockFile.lock(lockPath, { wait: 1000 }, (err) => {
            if (err) {
              return reject(new Error('Could not acquire lock'));
            }
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                lockFile.unlock(lockPath, (unlockErr) => {
                  if (unlockErr)
                    console.error('Error unlocking file:', unlockErr);
                });
                return reject(new Error('Error reading file'));
              }
              try {
                const jsonData = JSON.parse(data);
                responseMe(res, 200, jsonData);
                lockFile.unlock(lockPath, (unlockErr) => {
                  if (unlockErr)
                    console.error('Error unlocking file:', unlockErr);
                });
                resolve();
              } catch (parseErr) {
                lockFile.unlock(lockPath, (unlockErr) => {
                  if (unlockErr)
                    console.error('Error unlocking file:', unlockErr);
                });
                return reject(new Error('Error parsing JSON'));
              }
            });
          });
        })
    ).catch((err) => {
      responseMe(res, 500, { error: err.message });
    });
    // Handle POST requests:
  } else if (req.method === 'POST' && req.url === '/api/handleData') {
    withRetry(
      () =>
        new Promise((resolve, reject) => {
          lockFile.lock(lockPath, { wait: 1000 }, (err) => {
            if (err) {
              return reject(new Error('Could not acquire lock'));
            }
            let newData = '';
            req.on('data', (chunk) => {
              newData += chunk;
            });
            req.on('end', () => {
              fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                  lockFile.unlock(lockPath, (unlockErr) => {
                    if (unlockErr)
                      console.error('Error unlocking file:', unlockErr);
                  });
                  return reject(new Error('Error writing file'));
                } else {
                  responseMe(res, 200, {
                    message: 'File updated successfully',
                  });
                  lockFile.unlock(lockPath, (unlockErr) => {
                    if (unlockErr)
                      console.error('Error unlocking file:', unlockErr);
                  });
                  resolve();
                }
              });
            });
          });
        })
    ).catch((err) => {
      responseMe(res, 500, { error: err.message });
    });
  } else {
    responseMe(res, 405, { error: 'Method not allowed' });
  }
};

const server = http.createServer(requestListener);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
