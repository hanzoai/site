import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DESKTOP_FALLBACK, DESKTOP_RELEASES, desktopBuilds, fromRelease, size } from './desktop.ts';

// v1.1.56 as GitHub lists it, signatures and the updater manifest included
const ASSETS = [
  ['Hanzo_Desktop-1.1.56-1.aarch64.rpm', 952888453], ['Hanzo_Desktop-1.1.56-1.x86_64.rpm', 986050237],
  ['Hanzo_Desktop_1.1.56_aarch64.dmg', 583662351], ['Hanzo_Desktop_1.1.56_amd64.AppImage', 664881656],
  ['Hanzo_Desktop_1.1.56_amd64.AppImage.sig', 428], ['Hanzo_Desktop_1.1.56_amd64.deb', 593193290],
  ['Hanzo_Desktop_1.1.56_arm64.AppImage', 662690312], ['Hanzo_Desktop_1.1.56_arm64.deb', 593413234],
  ['Hanzo_Desktop_1.1.56_universal.app.tar.gz', 627851979], ['Hanzo_Desktop_1.1.56_universal.dmg', 631116111],
  ['Hanzo_Desktop_1.1.56_x64-portable.zip', 600429768], ['Hanzo_Desktop_1.1.56_x64-setup.exe', 503767525],
  ['Hanzo_Desktop_1.1.56_x64-setup.exe.sig', 428], ['Hanzo_Desktop_1.1.56_x64.dmg', 586079706],
  ['latest.json', 8402], ['SHA256SUMS', 2047],
].map(([name, size]) => ({ name, size }));

test('each slot gets its installer from the latest release', () => {
  const d = fromRelease({ tag_name: 'v1.1.56', assets: ASSETS })!;
  assert.equal(d.v, 'v1.1.56');
  assert.deepEqual(d.builds.map((b) => b[2].split('/').pop()), [
    'Hanzo_Desktop_1.1.56_universal.dmg', 'Hanzo_Desktop_1.1.56_x64-setup.exe', 'Hanzo_Desktop_1.1.56_amd64.AppImage',
    'Hanzo_Desktop_1.1.56_amd64.deb', 'Hanzo_Desktop_1.1.56_arm64.AppImage', 'Hanzo_Desktop_1.1.56_x64-portable.zip',
  ]);
  assert.equal(d.builds[0][2], 'desktop/releases/download/v1.1.56/Hanzo_Desktop_1.1.56_universal.dmg');
  assert.equal(d.builds[0][1], '602 MB');
});

test('a renamed release still fills the slots it can, and sends the rest to the release page', () => {
  const d = desktopBuilds('v2.0.0', [{ name: 'Hanzo-Desktop-2.0.0-arm64.dmg', size: 3e8 }, { name: 'Hanzo-Desktop-Setup-2.0.0.exe', size: 2e8 }])!;
  assert.equal(d.builds[0][2], 'desktop/releases/download/v2.0.0/Hanzo-Desktop-2.0.0-arm64.dmg');
  assert.equal(d.builds[1][2], 'desktop/releases/download/v2.0.0/Hanzo-Desktop-Setup-2.0.0.exe');
  assert.equal(d.builds[2][2], DESKTOP_RELEASES);
  assert.equal(d.builds[2][1], '');
});

test('nothing usable is no release', () => {
  assert.equal(desktopBuilds('v1.1.56', [{ name: 'SHA256SUMS', size: 1 }]), null);
  assert.equal(desktopBuilds('nightly', ASSETS), null);
  assert.equal(desktopBuilds('v1.1.56', null), null);
  assert.equal(fromRelease({ message: 'API rate limit exceeded' }), null);
  assert.equal(fromRelease(null), null);
  // a name that is not a plain file name never becomes a path
  assert.equal(desktopBuilds('v1.1.56', [{ name: '../x/universal.dmg', size: 1 }]), null);
});

test('the fallback is a whole release', () => {
  assert.equal(DESKTOP_FALLBACK.builds.length, 6);
  assert.ok(DESKTOP_FALLBACK.builds.every((b) => b[2].startsWith('desktop/releases/download/v1.1.56/') && b[1]));
});

test('sizes read as the page has always printed them', () => {
  assert.equal(size(503767525), '480 MB');
  assert.equal(size(976 * 1024), '976 KB');
  assert.equal(size(0), '');
});
