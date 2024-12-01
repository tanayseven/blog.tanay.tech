import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Tanay Rambles",
  description: "A statically generated blog for Tanay",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sortedChildren = React.Children.toArray(children).sort((a: any, b: any) => {
    const dateA = new Date(a.props.publishDate);
    const dateB = new Date(b.props.publishDate);
    return dateB.getTime() - dateA.getTime();
  }).reverse();
  console.log(sortedChildren.map((child: any) => child.props.publishDate));

  return (
    <html lang="en" className="">
      <body>
        <Navbar />
        <main className="py-8 sm:py-20 max-w-3xl mx-auto px-4">{sortedChildren}</main>
        <Footer />
      </body>
    </html>
  );
}
