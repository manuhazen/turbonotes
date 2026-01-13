import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
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

jest.mock("next/link", () => {
    return ({ children }: { children: React.ReactNode }) => {
        return <a href="/">{children}</a>;
    };
});

describe("NewNotePage Selection Bug", () => {
    it("displays the auto-selected category in the dropdown trigger", async () => {
        render(<NewNotePage />);

        // Wait for effect to run and auto-select "A-Category" (ID 1)

        await waitFor(() => {
            // Check if "A-Category" is displayed in the button (SelectTrigger)
            // If it's not selected, it might show "Select Category" placeholder or empty.
            // Shadcn SelectTrigger usually renders the text of selected option.
            const trigger = screen.getByRole("combobox");
            expect(trigger).toHaveTextContent("A-Category");
        });
    });
});
