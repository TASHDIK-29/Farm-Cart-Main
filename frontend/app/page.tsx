import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-gray-800">
      <h1 className="text-4xl justify-center font-bold mb-8 text-green-700">Welcome to Farm-Cart</h1>
      <p className="mb-12 text-center max-w-lg text-lg">
        Bridging the gap between farmers and consumers. Provide trust, build connection, and get fresh products directly. By Tas_h_dik
      </p>
      
      <p className="mb-12 text-center max-w-lg text-lg">
        Bridging the gap between farmers and consumers. Provide trust, build connection, and get fresh products directly. By Tas_h_dik
      </p>
      
      <div className="flex gap-4">
        <Link href="/auth/login" className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
          I am a Farmer
        </Link>
        <Link href="/auth/login" className="px-6 py-3 border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition">
          I am a Consumer
        </Link>
      </div>
    </main>
  );
}
