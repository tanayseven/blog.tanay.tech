import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full h-12 shadow-md flex items-center">
      <div className="px-4 w-full">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Link href="/">
              <span className="font-bold text-2xl">Tanay Rambles</span>
            </Link>
          </div>

          <div className="flex space-x-1 justify-self-end py-0.5">
            <Link href="/" className="text-xl px-2">Home</Link>
            <Link href="/about/" className="text-xl px-2">About me</Link>
            <Link href="/projects/" className="text-xl px-2">Projects</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
