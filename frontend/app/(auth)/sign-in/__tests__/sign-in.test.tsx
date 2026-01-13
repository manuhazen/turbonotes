import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SignInPage from "../page";

// Mock next/image since it uses heavy optimization features
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, priority, ...props }: any) => {
        return <img {...props} data-fill={fill} data-priority={priority} />
    },
}));

describe("SignInPage", () => {
    it("renders the login form elements", () => {
        render(<SignInPage />);

        expect(screen.getByText("Yay, You're Back!")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
        expect(screen.getByText("Oops! I've never been here before")).toBeInTheDocument();
    });
});
