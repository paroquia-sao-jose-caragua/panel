import '../globals.css';
import AppSidebar from '@/components/app-sidebar';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="lg:grid-cols-app min-h-screen lg:grid bg-zinc-50">
      <AppSidebar />
      <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
        {children}
      </main>
    </div>
  );
}
