import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import '@testing-library/jest-dom'

// Mock Cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
    setAll: jest.fn(),  // Simulate setAll method
  })),
}));

describe("Test Setup", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });
});

describe("Home Component", () => {
  it("renders without crashing", async () => {
    render(await Home());
  });
});