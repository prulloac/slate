import { useEffect, useRef, useState } from 'react';
import '../index.css';
import { GitHubSettingsPanel } from './github-settings';

export function App() {
  const [hasGitHubApi, setHasGitHubApi] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasGitHubApi(typeof window.github !== 'undefined');
  }, []);

  useEffect(() => {
    if (hasGitHubApi && settingsRef.current) {
      new GitHubSettingsPanel(settingsRef.current);
    }
  }, [hasGitHubApi]);

  return (
    <div>
      <h1>Slate</h1>
      <p>Welcome to your Electron + React application.</p>
      {hasGitHubApi ? (
        <>
          <p>GitHub bridge is available.</p>
          <div ref={settingsRef}></div>
        </>
      ) : (
        <p style={{ color: 'orangered' }}>
          GitHub bridge is not available yet. Check preload/contextBridge.
        </p>
      )}
    </div>
  );
}
