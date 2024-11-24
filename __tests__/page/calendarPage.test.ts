import { render } from "@testing-library/react";

// Pages - Calendar
import ManageMeetingPage from "@/app/calendar/manage/page";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Calendar Pages
describe("Calendar Pages", () => {
  // it("Manage Meeting Page should render without crashing", async () => {
  //   render(await ManageMeetingPage());
  // });
});