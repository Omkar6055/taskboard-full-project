import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskBoard — Manage your tasks',
  description: 'A secure, scalable task management app with JWT authentication.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Fixed cloud background layer — visible on all pages */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cloud 1 — top left */}
            <g opacity="0.42" filter="url(#blur1)">
              <ellipse cx="180" cy="130" rx="180" ry="80" fill="white" />
              <ellipse cx="280" cy="100" rx="140" ry="70" fill="white" />
              <ellipse cx="370" cy="140" rx="120" ry="60" fill="white" />
              <ellipse cx="100" cy="155" rx="100" ry="55" fill="white" />
            </g>
            {/* Cloud 2 — top right */}
            <g opacity="0.38" filter="url(#blur1)">
              <ellipse cx="1280" cy="90" rx="200" ry="85" fill="white" />
              <ellipse cx="1380" cy="120" rx="130" ry="65" fill="white" />
              <ellipse cx="1160" cy="115" rx="150" ry="60" fill="white" />
            </g>
            {/* Cloud 3 — middle left */}
            <g opacity="0.32" filter="url(#blur2)">
              <ellipse cx="60" cy="420" rx="160" ry="70" fill="white" />
              <ellipse cx="180" cy="390" rx="130" ry="65" fill="white" />
              <ellipse cx="270" cy="430" rx="110" ry="55" fill="white" />
            </g>
            {/* Cloud 4 — bottom right */}
            <g opacity="0.40" filter="url(#blur1)">
              <ellipse cx="1350" cy="750" rx="190" ry="80" fill="white" />
              <ellipse cx="1200" cy="760" rx="150" ry="65" fill="white" />
              <ellipse cx="1440" cy="760" rx="110" ry="55" fill="white" />
            </g>
            {/* Cloud 5 — bottom left */}
            <g opacity="0.34" filter="url(#blur2)">
              <ellipse cx="220" cy="820" rx="170" ry="72" fill="white" />
              <ellipse cx="370" cy="800" rx="140" ry="60" fill="white" />
              <ellipse cx="100" cy="835" rx="110" ry="52" fill="white" />
            </g>
            {/* Cloud 6 — center-top subtle */}
            <g opacity="0.30" filter="url(#blur2)">
              <ellipse cx="720" cy="60" rx="220" ry="65" fill="white" />
              <ellipse cx="620" cy="85" rx="160" ry="55" fill="white" />
              <ellipse cx="840" cy="80" rx="150" ry="50" fill="white" />
            </g>
            <defs>
              <filter id="blur1" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="28" />
              </filter>
              <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="40" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Page content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
