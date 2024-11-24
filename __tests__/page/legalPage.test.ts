import { render } from "@testing-library/react";

// Pages - Legal
import About from "@/app/(legal)/about/page";
import PrivacyPolicy from "@/app/(legal)/privacy/page";
import InvestmentRisks from "@/app/(legal)/risks/page";
import TermsOfService from "@/app/(legal)/terms/page";

// Legal Pages
describe("Legal Pages", () => {
  it("About Page should render without crashing", () => {
    render(About());
  });

  it("Privacy Policy Page should render without crashing", () => {
    render(PrivacyPolicy());
  });

  it("Investment Risks Page should render without crashing", () => {
    render(InvestmentRisks());
  });

  it("Terms of Service Page should render without crashing", () => {
    render(TermsOfService());
  });
});