import fs from 'fs';
import path from 'path';

describe('landing consolidation', () => {
  it('reuses the canonical root landing page for /landing', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/landing/page.tsx'), 'utf8');

    expect(source).toContain("import LandingPage from '@/app/page';");
  });

  it('links landing property cards to the listing detail route', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'components/Landing/PropCard.tsx'), 'utf8');

    expect(source).toContain('href={`/listings/${id}`}');
  });

  it('keeps donor snapshots under the frontend archive directory', () => {
    const archiveDir = path.join(process.cwd(), 'docs/archive/frontend-experiments');

    expect(fs.existsSync(path.join(archiveDir, 'landing-page-final.donor.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(archiveDir, 'sierra-blu-landing.donor.jsx'))).toBe(true);
  });

  it('guards the auth provider when Firebase client env is missing', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'lib/AuthContext.tsx'), 'utf8');

    expect(source).toContain('if (!isFirebaseClientConfigured) {');
  });
});
