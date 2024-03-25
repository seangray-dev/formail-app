import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home", () => {
  it("renders the main element", () => {
    render(<Home />);

    const main = screen.getByTestId("main");

    expect(main).toBeInTheDocument();
  });
});
