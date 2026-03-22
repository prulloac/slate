import { useEffect, useState } from 'react';
import '../index.css';

export function App() {
  const [hasGitHubApi, setHasGitHubApi] = useState(false);

  useEffect(() => {
    setHasGitHubApi(typeof (window as any).github !== 'undefined');
  }, []);

  return (
    <div>
      <h1>Slate</h1>
      <p>Welcome to your Electron + React application.</p>
      {hasGitHubApi ? (
        <p>GitHub bridge is available.</p>
      ) : (
        <p style={{ color: 'orangered' }}>
          GitHub bridge is not available yet. Check preload/contextBridge.
        </p>
      )}
    </div>
  );
}
