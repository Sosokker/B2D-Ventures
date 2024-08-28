import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
//   import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
//   import ShadcnKit from "@/components/icons/shadcn-kit";
//   import { nanoid } from "nanoid";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export function UnsignedNav() {
  return (
    <Card className="container bg-card py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5">
      {/* <ShadcnKit className="text-primary cursor-pointer" /> */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Businesses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        shadcn/ui
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Beautifully designed components that you can copy and
                        paste into your apps. Accessible. Customizable. Open
                        Source.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <ul className="hidden md:flex items -center gap-10 text-card-foreground ml-auto">
            <li className="text-primary font-medium">
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#features">Businesses</a>
            </li>
            <li>
              <a href="#pricing">Projects</a>
            </li>
            <li>
              <a href="#faqs">Docs</a>
            </li>
          </ul>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center">
        <Button variant="secondary" className="hidden md:block px-2">
          Login
        </Button>
        <Button className="hidden md:block ml-2 mr-2">Get Started</Button>

        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="py-2 px-2 bg-gray-100 rounded-md">Pages</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {landings.map((page) => (
                <DropdownMenuItem key={page.id}>
                  <Link href={page.route}>{page.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="#home">Home</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#features">Features</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#pricing">Pricing</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#faqs">FAQs</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="secondary" className="w-full text-sm">
                  Login
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button className="w-full text-sm">Get Started</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* <ThemeToggle /> */}
      </div>
    </Card>
  );
}

const landings = [
  {
    id: 1,
    title: "Landing 01",
    route: "/project-management",
  },
  {
    id: 2,
    title: "Landing 02",
    route: "/crm-landing",
  },
  {
    id: 3,
    title: "Landing 03",
    route: "/ai-content-landing",
  },
  {
    id: 4,
    title: "Landing 04",
    route: "/new-intro-landing",
  },
  {
    id: 5,
    title: "Landing 05",
    route: "/about-us-landing",
  },
  {
    id: 6,
    title: "Landing 06",
    route: "/contact-us-landing",
  },
  {
    id: 7,
    title: "Landing 07",
    route: "/faqs-landing",
  },
  {
    id: 8,
    title: "Landing 08",
    route: "/pricing-landing",
  },
  {
    id: 9,
    title: "Landing 09",
    route: "/career-landing",
  },
];
