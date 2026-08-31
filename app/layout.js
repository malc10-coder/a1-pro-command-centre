import './style.css';

export const metadata = {
  title: 'A1 Pro Command Centre',
  description: 'AI Business Operating System'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
