export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-white max-w-lg mx-auto relative overflow-hidden">
      {children}
    </div>
  );
}
