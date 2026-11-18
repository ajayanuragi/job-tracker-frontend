import { useState } from "react";
import { NavLink } from "react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Open navigation">
            <Menu />
          </Button>
        }
      />

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>JobTracker</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-2 px-4">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/jobs", label: "Jobs" },
            { to: "/applications", label: "Applications" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
