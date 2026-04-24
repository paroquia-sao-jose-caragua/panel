import { Sidebar } from "@/components/Sidebar";
import "../globals.css";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="lg:grid-cols-app min-h-screen lg:grid">
      <Sidebar />
      <main className="max-w-[100vw] px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 bg-brand-0">
        {children}
      </main>
    </div>
  );
}
