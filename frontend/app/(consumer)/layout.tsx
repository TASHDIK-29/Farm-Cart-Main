import ConsumerNavbar from '../../components/ConsumerNavbar';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="consumer-portal bg-gray-50 min-h-screen">
      <ConsumerNavbar />
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
