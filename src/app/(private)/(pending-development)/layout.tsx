import '@/app/globals.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="max-w-300 w-full px-4 pt-20 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      {children}
    </main>
  );
}
