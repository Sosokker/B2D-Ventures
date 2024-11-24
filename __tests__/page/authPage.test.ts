import { render } from "@testing-library/react";

// Pages - Auth
import Signup from "@/app/auth/signup/page";
import Login from "@/app/auth/page";

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


describe("Signup Page", () => {
  it("should render without crashing", () => {
    render(Signup());
  });
});

describe("Login Page", () => {
  it("should render without crashing", () => {
    render(Login());
  });
});