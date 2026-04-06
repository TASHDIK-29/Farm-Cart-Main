import FarmerNavbar from '../../components/FarmerNavbar';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="farmer-portal min-h-screen bg-gray-50">
      <FarmerNavbar />
      <main className="p-4 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
