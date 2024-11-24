import { render } from "@testing-library/react";

// Pages - Admin
import AdminPage from "@/app/admin/page";
import BusinesssApplicationAdminPage from "@/app/admin/business/page";
import ProjectAdminPage from "@/app/admin/business/[businessId]/projects/page";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Admin Pages
describe("Admin Pages", () => {
  it("Admin Page should render without crashing", async () => {
    render(await AdminPage());
  });

  // it("Business Application Admin Page should render without crashing", async () => {
  //   render(await BusinesssApplicationAdminPage());
  // });

  it("Project Admin Page should render without crashing", async () => {
    render(await ProjectAdminPage({ params: { businessId: "1" } }));
  });
});

