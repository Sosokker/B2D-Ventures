import { render } from "@testing-library/react";

// Error and Loading Pages
import Error from "@/app/error";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Error and Loading Pages
describe("Error and Loading Pages", () => {
  // it("Error Page should render without crashing", async () => {
  //   render(await Error());
  // });

  it("Loading Page should render without crashing", async () => {
    render(await Loading());
  });

  it("Not Found Page should render without crashing", async () => {
    render(await NotFound());
  });
});