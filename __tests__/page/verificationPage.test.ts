import { render } from "@testing-library/react";

// Pages - Verification
import VerifyPage from "@/app/verify/page";

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
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => {
      if (key === 'email') return 'test@example.com'; // Mock behavior for 'email' query param
      return null; // Return null for other keys
    })
  })),
}));

// Verification Pages
// describe("Verification Pages", () => {
//   it("Verify Page should render without crashing", () => {
//     render(VerifyPage());
//   });
// });