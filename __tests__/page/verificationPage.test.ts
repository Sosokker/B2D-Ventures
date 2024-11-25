import { render } from "@testing-library/react";

// Pages - Verification
import VerifyPage from "@/app/verify/page";
import React from "react";

// Mock Router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => {
      if (key === 'email') return 'test@example.com'; // Mock behavior for 'email' query param
      return null; // Return null for other keys
    })
  })),
}));

// Verification Pages
describe("Verification Pages", () => {
  it("Verify Page should render without crashing", () => {
    jest.spyOn(React, 'useEffect').mockImplementation((f) => f());
    render(VerifyPage());
  });
});