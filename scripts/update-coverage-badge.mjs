import fs from 'fs';
import path from 'path';

const root = process.cwd();
const summaryPath = path.join(root, 'coverage', 'coverage-summary.json');
const badgeDir = path.join(root, 'badges');
const badgePath = path.join(badgeDir, 'coverage.json');

function colorFor(pct) {
  if (pct >= 90) return 'brightgreen';
  if (pct >= 80) return 'green';
  if (pct >= 70) return 'yellowgreen';
  if (pct >= 60) return 'yellow';
  if (pct >= 50) return 'orange';
  return 'red';
}

try {
  const raw = fs.readFileSync(summaryPath, 'utf-8');
  const data = JSON.parse(raw);
  const pct = data.total?.lines?.pct ?? data.total?.statements?.pct ?? 0;
  const rounded = Math.round(pct);
  const badge = {
    schemaVersion: 1,
    label: 'coverage',
    message: `${rounded}%`,
    color: colorFor(rounded),
  };
  if (!fs.existsSync(badgeDir)) fs.mkdirSync(badgeDir, { recursive: true });
  fs.writeFileSync(badgePath, JSON.stringify(badge, null, 2));
  console.log('Coverage badge updated:', badge);
} catch (err) {
  console.error('Failed to update coverage badge:', err.message);
  process.exitCode = 0; // do not fail CI
}
