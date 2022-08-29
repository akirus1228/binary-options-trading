import { render } from "@testing-library/react";

import BorrowerListingDetails from "./vaultForm1";

describe("BorrowerListingDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<VaultForm1 />);
    expect(baseElement).toBeTruthy();
  });
});
