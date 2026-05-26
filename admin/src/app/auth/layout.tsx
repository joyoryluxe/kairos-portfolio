// Auth pages don't need any wrapper layout — they handle their own full-page UI
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
