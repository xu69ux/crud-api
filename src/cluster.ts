import os from 'os';
import http from 'http';
import dotenv from 'dotenv';
import cluster from 'cluster';
import handleRequest from './handlers/requestHandler';

dotenv.config();

const port = Number(process.env.PORT);

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount - 1; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.id} has exited`);
    cluster.fork();
  });
} else {
  const server = http.createServer(handleRequest);
  const workerId = cluster.worker?.id ?? 0;
  server.listen(port + workerId, () => {
    console.log(`Server running on http://localhost:${port + workerId}/`);
  });
}