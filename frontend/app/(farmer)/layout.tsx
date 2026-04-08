import FarmerSidebar from '../../components/FarmerSidebar';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="farmer-portal min-h-screen bg-gray-50 flex">
      <FarmerSidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
