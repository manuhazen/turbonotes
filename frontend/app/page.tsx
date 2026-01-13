"use client";

import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome to your notes dashboard.
      </p>

      <Button
        variant="destructive"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        {logout.isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
