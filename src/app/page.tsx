import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="md:h-screen flex flex-col bg-[#0D0D0D] text-white">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-[#27FFBD] tracking-wide">
          <span className="text-white">Quant</span>Trade
        </h1>
        <p className="mt-2 text-gray-400 text-sm">
          Empowering Clients and Managers with Seamless Trade Solutions
        </p>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Client Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:border-r border-[#1E1E1E]">
          <div className="max-w-md text-center">
            <Image
              src="/client.svg"
              alt="Client Illustration"
              width={240}
              height={240}
              className="mb-6 mx-auto"
            />
            <h2 className="text-3xl font-semibold text-white mb-4">
              Client
            </h2>
            <p className="text-gray-400">
              Manage your trades, place new orders, and track real-time market
              activity effortlessly.
            </p>
            <Link href="/client">
              <Button className="mt-6 w-full bg-[#27FFBD] text-black hover:bg-[#1FCCA0] hover:text-white transition">
                Go to Client Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Manager Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-md text-center">
            <Image
              src="/manager.svg"
              alt="Manager Illustration"
              width={240}
              height={240}
              className="mb-6 mx-auto"
            />
            <h2 className="text-3xl font-semibold text-white mb-4">
              Manager
            </h2>
            <p className="text-gray-400">
              Approve, modify, and settle trades seamlessly from a unified
              dashboard.
            </p>
            <Link href="/manager">
              <Button className="mt-6 w-full bg-[#27FFBD] text-black hover:bg-[#1FCCA0] hover:text-white transition">
                Go to Manager Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-xs border-t border-[#1E1E1E]">
        &copy; 2024 Nihar kushwaha. All rights reserved.
      </footer>
    </div>
  );
}
