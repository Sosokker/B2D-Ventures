import { render } from "@testing-library/react";

// Pages - Other
import FindContent from "@/app/find/page";
import FollowPage from "@/app/follow/page";
import Portfolio from "@/app/portfolio/[uid]/page";
import EditProjectPage from "@/app/project/[projectId]/edit/page";
import ApplyProject from "@/app/project/apply/page";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Mock router
jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

// Other Pages
describe("Other Pages", () => {
  it("Find Content Page should render without crashing", async () => {
    render(await FindContent({ searchParams: { query: "test" } }));
  });

  // it("Follow Page should render without crashing", async () => {
  //   render(await FollowPage());
  // });

  it("Portfolio Page should render without crashing", async () => {
    render(await Portfolio({ params: { uid: "142b29e6-420e-44fb-935b-c98d129536ea" } }));
  });

  // it("Edit Project Page should render without crashing", async () => {
  //   render(await EditProjectPage({ params: { projectId: "project-id" } }));
  // });

  // it("Apply Project Page should render without crashing", async () => {
  //   render(await ApplyProject());
  // });
});