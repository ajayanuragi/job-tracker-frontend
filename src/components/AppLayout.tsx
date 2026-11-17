import { NavLink, Outlet } from "react-router";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <NavLink to="/dashboard" className="font-semibold">
            JobTracker
          </NavLink>

          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<NavLink to="/dashboard" />}>
              Dashboard
            </Button>

            <Button variant="ghost" render={<NavLink to="/jobs" />}>
              Jobs
            </Button>

            <Button variant="ghost" render={<NavLink to="/applications" />}>
              Applications
            </Button>
          </div>

          <LogoutButton />
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
