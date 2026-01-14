import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SignInPage from "../page";

// Mock hooks
jest.mock("@/hooks/use-auth", () => ({
    useLogin: jest.fn(() => ({
        mutate: jest.fn(),
        isPending: false,
    })),
}));

// Mock useRouter
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock next/image since it uses heavy optimization features
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ fill, priority, ...props }: { fill?: boolean; priority?: boolean;[key: string]: unknown }) => {
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
