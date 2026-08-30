import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrivacyComparison } from "./components/Privacy";

describe("PrivacyComparison", () => {
  it("shows ScholarProof privacy path", () => {
    render(<PrivacyComparison />);
    expect(screen.getByText("Privacy Comparison")).toBeInTheDocument();
    expect(screen.getByText("ScholarProof")).toBeInTheDocument();
    expect(screen.getByText("Traditional Application")).toBeInTheDocument();
  });
});
