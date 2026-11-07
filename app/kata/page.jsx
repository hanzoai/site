// Signature: Test, repair, verify on a loop: a red test on a board of thirteen turns green, the terminal session and the diff between
// Beyond: Will it fit my stack? Pick your test runner, CI and language; the answer comes only from what Hanzo says Kata supports
import Kata from '../../components/pages/Kata';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: 'Hanzo Kata — Autonomous coding agent & CI/CD loop', description: 'Autonomous test repair, CI/CD triage, and repository maintenance. Powered by Kai typed decisions and Enso model routing.' };

export default function Page() {
  return <><JsonLd route="/kata" /><Kata /></>;
}
