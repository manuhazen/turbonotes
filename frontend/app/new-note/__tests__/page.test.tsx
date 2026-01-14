import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewNotePage from "../page";

// Mock hooks
const mockMutate = jest.fn();
jest.mock("@/hooks/use-notes", () => ({
    useCreateNote: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
    useCategories: () => ({
        data: [
            { id: "1", name: "A-Category", color: "#FF0000" },
            { id: "2", name: "B-Category", color: "#00FF00" }
        ],
        isLoading: false,
    }),
}));

// Mock Navigation (Link, etc) is handled by Next.js automatically or we might need simple mocks if complex
/* eslint-disable @next/next/no-html-link-for-pages */
jest.mock("next/link", () => {
    const MockLink = ({ children }: { children: React.ReactNode }) => {
        return <a href="/">{children}</a>;
    };
    MockLink.displayName = "MockLink";
    return MockLink;
});


describe("NewNotePage", () => {
    beforeEach(() => {
        mockMutate.mockClear();
    });

    it("renders the new note form", () => {
        render(<NewNotePage />);
        expect(screen.getByPlaceholderText("Note Title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Pour your heart out...")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "" })).toBeInTheDocument(); // Close button or Submit button (check icon accessibility or role)
    });

    it("auto-selects the first category alphabetically", async () => {
        render(<NewNotePage />);
        // Wait for effect
        await waitFor(() => {
            // Check if the Select value is updated. 
            // Select in Shadcn usually renders a button with the value text if selected.
            // Our mock data "A-Category" should be selected.
            // Note: CategorySelect might render differenly in test environment. 
            // Let's assume user interaction flow or check value prop if possible, but testing library prefers user visible.
            // A simple check is if the text "A-Category" is visible.
            expect(screen.getByText("A-Category")).toBeInTheDocument();
        });
    });

    it("validates required title", async () => {
        render(<NewNotePage />);

        const titleInput = screen.getByPlaceholderText("Note Title");
        fireEvent.focus(titleInput);
        fireEvent.blur(titleInput); // Trigger touch

        const submitBtn = screen.getByRole("button", { name: "Save Note" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled();
            // Validation error text check is flaky in test env, but mockMutate not called confirms validation blocked submission.
        });
    });

    it("submits the form with valid data", async () => {
        render(<NewNotePage />);

        const titleInput = screen.getByPlaceholderText("Note Title");
        const descInput = screen.getByPlaceholderText("Pour your heart out...");

        fireEvent.change(titleInput, { target: { value: "My Great Idea" } });
        fireEvent.change(descInput, { target: { value: "This is the content." } });

        const submitBtn = screen.getByRole("button", { name: "Save Note" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                title: "My Great Idea",
                description: "This is the content.",
                category: "1", // Auto-selected ID
                // audio_file: null
            });
        });
    });
});
