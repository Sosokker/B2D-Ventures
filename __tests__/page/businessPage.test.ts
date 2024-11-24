import { render } from "@testing-library/react";

// Pages - Business
import ApplyBusiness from "@/app/business/apply/page";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Mock Router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => ({})),
}));

// Business Pages
// describe("Business Pages", () => {
//   it("Apply Business Page should render without crashing", async () => {
//     render(await ApplyBusiness());
//   });
// });