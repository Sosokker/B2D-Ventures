import { render } from "@testing-library/react";

// Pages - User
import Notification from "@/app/(user)/notification/page";
import ProfilePage from "@/app/(user)/profile/[uid]/page";
import EditProfileForm from "@/app/(user)/profile/[uid]/edit/EditProfileForm";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// User Pages
describe("User Pages", () => {
  // it("Notification Page should render without crashing", async () => {
  //   render(await Notification());
  // });

  // it("Profile Page should render without crashing", async () => {
  //   render(await ProfilePage({ params: { uid: "user-id" } }));
  // });

  // it("Edit Profile Form should render without crashing", async () => {
  //   render(await EditProfileForm({ params: { uid: "user-id" } }));
  // });
});