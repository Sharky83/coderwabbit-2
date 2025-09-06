import path from 'path';
import fs from 'fs';

export function detectLanguagesAndDependencies(tempDir: string) {
  const walkSync = (dir: string, filelist: string[] = []) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        filelist = walkSync(fullPath, filelist);
      } else {
        filelist.push(fullPath);
      }
    });
    return filelist;
  };
  const allFiles = walkSync(tempDir);
  const detectedLanguages: string[] = [];
  // Only detect 'python' if .py files exist
  if (allFiles.some(f => f.endsWith('.py'))) detectedLanguages.push('python');
  if (allFiles.some(f => f.endsWith('.js'))) detectedLanguages.push('javascript');
  if (allFiles.some(f => f.endsWith('.ts'))) detectedLanguages.push('typescript');
  if (allFiles.some(f => f.endsWith('.php'))) detectedLanguages.push('php');
  if (allFiles.some(f => f.endsWith('.html'))) detectedLanguages.push('html');
  if (allFiles.some(f => f.endsWith('.css'))) detectedLanguages.push('css');
  let language = detectedLanguages[0] || 'unknown';
  let dependencies: string[] = [];
  // Always report dependency files for security checks
  if (allFiles.some(f => f.endsWith('requirements.txt'))) dependencies.push('requirements.txt');
  if (allFiles.some(f => f.endsWith('pyproject.toml'))) dependencies.push('pyproject.toml');
  if ((language === 'javascript' || language === 'typescript') && allFiles.some(f => f.endsWith('package.json'))) dependencies.push('package.json');
  return { detectedLanguages, language, dependencies };
}

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
export function parsePackageJson(tempDir: string): PackageJson {
  try {
    const pkgPath = path.join(tempDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    }
  } catch {}
  return {};
}
