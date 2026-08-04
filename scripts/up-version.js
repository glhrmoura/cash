import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BUMP_TYPES = {
  pa: 'patch',
  mi: 'minor',
  ma: 'major',
};

const bumpArg = process.argv[2] || 'pa';
const bumpType = BUMP_TYPES[bumpArg];

if (!bumpType) {
  console.error(`Invalid bump type "${bumpArg}". Use: pa | mi | ma`);
  process.exit(1);
}

const bumpVersion = (version, type) => {
  const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number);

  if (type === 'major') {
    return `${major + 1}.0.0`;
  }

  if (type === 'minor') {
    return `${major}.${minor + 1}.0`;
  }

  return `${major}.${minor}.${patch + 1}`;
};

const pkgPath = path.join(process.cwd(), 'package.json');
const swPath = path.join(process.cwd(), 'public', 'sw.js');

try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const current = pkg.version || '0.0.0';
  const newVersion = bumpVersion(current, bumpType);

  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

  const swContent = fs.readFileSync(swPath, 'utf8');
  if (!/const APP_VERSION = ['"][^'"]+['"];/.test(swContent)) {
    console.error('Could not find APP_VERSION in sw.js');
    process.exit(1);
  }

  const updatedSw = swContent.replace(
    /const APP_VERSION = ['"][^'"]+['"];/,
    `const APP_VERSION = '${newVersion}';`,
  );
  fs.writeFileSync(swPath, updatedSw, 'utf8');

  console.log(`Version ${current} → ${newVersion} (${bumpType})`);

  execSync('git add package.json public/sw.js');
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    execSync('git add yarn.lock');
  }
  if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
    execSync('git add package-lock.json');
  }
  execSync(`git commit -m "chore: bump version to ${newVersion}"`);
} catch (error) {
  console.error('Failed to bump version:', error.message);
  process.exit(1);
}
