import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import '@testing-library/jest-dom'

describe("Test Setup", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });
});

// describe("Home Component", () => {
//   it("renders without crashing", () => {
//     render(<Home />);

//     // Check if a key element is present, like the page title
//     // expect(screen.getByText("Explore the world of ventures")).toBeInTheDocument();
//     expect(true).toBe(true);
//   });
// });