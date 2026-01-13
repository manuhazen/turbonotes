
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AuthHeader } from "../auth-header";

describe("AuthHeader", () => {
    it("renders the image and title", () => {
        const text = "Test Title";
        const altText = "Test Alt";
        render(<AuthHeader imageSrc="/test.png" imageAlt={altText} title={text} />);

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByAltText(altText)).toBeInTheDocument();
    });
});
