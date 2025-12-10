'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FDF6E3',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '20px',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px',
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>😵</div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#8B6F5C',
              marginBottom: '16px',
            }}>
              심각한 오류가 발생했어요
            </h1>
            <p style={{
              color: '#7A7A7A',
              marginBottom: '32px',
            }}>
              앱을 다시 시작해야 합니다.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#E8A0A0',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '12px',
              }}
            >
              🔄 앱 재시작
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: 'transparent',
                color: '#8B6F5C',
                padding: '12px 32px',
                borderRadius: '9999px',
                border: '2px solid #8B6F5C',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              🏠 홈으로
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
