import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SignUpPage from "../page";

// Mock next/image since it uses heavy optimization features
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, priority, ...props }: any) => {
        return <img {...props} data-fill={fill} data-priority={priority} />
    },
}));

describe("SignUpPage", () => {
    it("renders the sign up form elements", () => {
        render(<SignUpPage />);

        expect(screen.getByText("Yay, New Friend!")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
        expect(screen.getByText("We're already friends!")).toBeInTheDocument();
    });
});
