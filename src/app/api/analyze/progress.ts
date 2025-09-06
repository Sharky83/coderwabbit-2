import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Helper to send SSE message
  const send = (msg: string) => {
    res.write(`data: ${msg}\n\n`);
  };

  // Simulate progress steps (replace with real analysis steps)
  send('Cloning repository...');
  await new Promise(r => setTimeout(r, 1000));
  send('Installing dependencies...');
  await new Promise(r => setTimeout(r, 1000));
  send('Running ESLint...');
  await new Promise(r => setTimeout(r, 1000));
  send('Running code complexity analysis...');
  await new Promise(r => setTimeout(r, 1000));
  send('Running code duplication analysis...');
  await new Promise(r => setTimeout(r, 1000));
  send('Running tests...');
  await new Promise(r => setTimeout(r, 1000));
  send('Analysis complete!');

  res.end();
}
