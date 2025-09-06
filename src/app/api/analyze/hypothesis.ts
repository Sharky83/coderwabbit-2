import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authOptions';
import { logError } from './errorHelpers';
import path from 'path';
import { execFile } from 'child_process';

// Helper to run hypothesis_runner.py and return results
function runHypothesisTests(repoPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(process.cwd(), 'src/app/api/analyze/helpers/python/hypothesis_runner.py');
    execFile('python3', [scriptPath, repoPath], { timeout: 60_000 }, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          resolve({ error: 'Failed to parse Hypothesis output', raw: stdout });
        }
      }
    });
  });
}

export async function GET(req: NextRequest) {
  // Auth check
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get tempDir from query
  const { searchParams } = new URL(req.url);
  const tempDir = searchParams.get('tempDir');
  if (!tempDir) {
    return NextResponse.json({ error: 'Missing tempDir' }, { status: 400 });
  }

  const fs = require('fs');
  if (!fs.existsSync(tempDir)) {
    return NextResponse.json({ error: `Repository directory not found: ${tempDir}` }, { status: 404 });
  }
  try {
    const results = await runHypothesisTests(tempDir);
    return NextResponse.json(results);
  } catch (err: any) {
    logError(err);
    return NextResponse.json({ error: err.error || 'Failed to run Hypothesis tests', details: err.stderr || err }, { status: 500 });
  }
}
