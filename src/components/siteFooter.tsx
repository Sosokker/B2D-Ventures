import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="pt-6 ">
      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-background bg-foreground">
        <div className="container max-w-screen-xl flex flex-col md:flex-row justify-between items-center py-6">
          {/* Logo or Brand */}
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">B2DVentures</div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
            <Link href="/services" className="hover:underline">
              Services
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
          {/* Copyright */}
          <div className="text-sm text-center mt-4 md:mt-0 md:ml-6">
            &copy; {new Date().getFullYear()} B2DVentures. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
