import { render } from "@testing-library/react";

import Home from "@/app/page";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Homepage
describe("Homepage", () => {
  it("Home Page should render without crashing", async () => {
    render(await Home());
  });
});