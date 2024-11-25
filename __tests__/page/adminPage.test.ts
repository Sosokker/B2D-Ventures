import { render } from "@testing-library/react";

// Pages - Admin
import AdminPage from "@/app/admin/page";
import BusinessApplicationAdminPage from "@/app/admin/business/page";
import ProjectAdminPage from "@/app/admin/business/[businessId]/projects/page";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Admin Pages
describe("Admin Pages", () => {
  it("Admin Page should render without crashing", async () => {
    render(await AdminPage());
  });

  it("Business Application Admin Page should render without crashing", async () => {
    const mockGetUser = jest.spyOn(createSupabaseClient().auth, 'getUser');
  
    // Mock the getUser method's implementation to return a full User object
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: '4d31cfe0-8ebd-4bc8-915e-d301ecaffb33',
        }
      },
      error: null,
    });

    render(await BusinessApplicationAdminPage());
  });

  it("Project Admin Page should render without crashing", async () => {
    render(await ProjectAdminPage({ params: { businessId: "1" } }));
  });
});

