import { render } from "@testing-library/react";

// Pages - Investment
import Deals from "@/app/(investment)/deals/page";
import ProjectDealPage from "@/app/(investment)/deals/[id]/page";
import InvestPage from "@/app/(investment)/invest/[id]/page";
import PaymentSuccess from "@/app/(investment)/payment-success/page";

// Mock Cookies
jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
      getAll: jest.fn(() => [{ name: "test", value: "cookieValue" }]), // Simulate returning cookies
      setAll: jest.fn(),  // Simulate setAll method
    })),
}));

// Investment Pages
describe("Investment Pages", () => {
  // it("Deals Page should render without crashing", async () => {
  //   render(await Deals());
  // });

  // it("Project Deal Page should render without crashing", async () => {
  //   render(await ProjectDealPage({ params: { id: 1 } }));
  // });

  // it("Invest Page should render without crashing", async () => {
  //   render(await InvestPage());
  // });

  it("Payment Success Page should render without crashing", async () => {
    render(await PaymentSuccess({ searchParams: { amount: '100' } }));
  });
});