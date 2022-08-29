import { render } from "@testing-library/react";

import BorrowerListingDetails from "./createVault";

describe("BorrowerListingDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<CreateVaultForm />);
    expect(baseElement).toBeTruthy();
  });
});
