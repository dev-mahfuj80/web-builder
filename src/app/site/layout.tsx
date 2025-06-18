import Navigation from "@/components/site/navigation";
import React from "react";
// import current user
import { currentUser } from "@clerk/nextjs/server";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  return (
    <main className="h-full">
      <Navigation user={user} />
      {children}
    </main>
  );
};

export default Layout;
