import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LayoutCheckoutProps {
  children: React.ReactNode;
}

const LayoutCheckout = ({ children }: LayoutCheckoutProps) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4 flex flex-col items-center justify-center py-20">
        <Link href="/">
          <Image
            src="bdl-logo.svg"
            alt="logo"
            height={200}
            width={200}
            priority
            quality={100}
          />
        </Link>
        {children}
      </div>
    </main>
  );
};

export default LayoutCheckout;
