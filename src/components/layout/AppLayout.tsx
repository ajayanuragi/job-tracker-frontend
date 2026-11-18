import { NavLink, Outlet } from "react-router";
import LogoutButton from "@/components/layout/LogoutButton";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import MobileNavigation from "@/components/layout/MobileNavigation";

export default function AppLayout() {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between py-4 px-6">
          <NavLink to="/dashboard" className="font-semibold">
            JobTracker
          </NavLink>
          <div className="md:hidden">
            <MobileNavigation />
          </div>

          <div className="hidden  items-center gap-2 md:flex">
            <Button
              nativeButton={false}
              variant="ghost"
              render={<NavLink to="/dashboard" />}
            >
              Dashboard
            </Button>

            <Button
              nativeButton={false}
              variant="ghost"
              render={<NavLink to="/jobs" />}
            >
              Jobs
            </Button>

            <Button
              nativeButton={false}
              variant="ghost"
              render={<NavLink to="/applications" />}
            >
              Applications
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl py-6">
        <Outlet />
      </main>
    </div>
  );
}
