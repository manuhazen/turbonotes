import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { NoteCard } from "../ui/note-card";
import { Button } from "../ui/button";
import { CloseButton } from "../ui/close-button";
import { CategorySelect } from "../ui/category-select";
import { PasswordInput } from "../ui/password-input";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

// Mock Lucide X icon since we don't need to test the svg path
jest.mock('lucide-react', () => ({
    X: () => <span data-testid="x-icon">X Icon</span>,
    Eye: () => <span data-testid="eye-icon">Eye Icon</span>,
    EyeOff: () => <span data-testid="eye-off-icon">EyeOff Icon</span>,
    CheckIcon: () => <span data-testid="check-icon">CheckIcon</span>,
    ChevronDownIcon: () => <span data-testid="chevron-down-icon">ChevronDownIcon</span>,
    ChevronUpIcon: () => <span data-testid="chevron-up-icon">ChevronUpIcon</span>
}));




describe("NoteCard", () => {
    it("renders with title, content, and category info", () => {
        const props = {
            title: "My Note",
            content: "This is some note content.",
            date: "Jan 13",
            category: { name: "Personal", color: "#A2C4C9" }
        };
        render(<NoteCard {...props} />);

        expect(screen.getByText("My Note")).toBeInTheDocument();
        expect(screen.getByText("This is some note content.")).toBeInTheDocument();
        expect(screen.getByText("Jan 13")).toBeInTheDocument();
        expect(screen.getByText("Personal")).toBeInTheDocument();
    });

    it("applies the category color as background", () => {
        const props = {
            title: "My Note",
            content: "Content",
            date: "Jan 13",
            category: { name: "Personal", color: "#aabbcc" }
        };
        const { container } = render(<NoteCard {...props} />);

        // NoteCard is the first div
        const noteCard = container.firstChild as HTMLElement;
        expect(noteCard).toHaveStyle("background-color: #aabbcc");
    });
});

describe("Button", () => {
    it("renders the pill variant with correct classes", () => {
        render(<Button variant="pill">New Note</Button>);
        const button = screen.getByRole("button", { name: "New Note" });

        expect(button).toHaveClass("rounded-full");
        expect(button).toHaveClass("border");
        expect(button).toHaveClass("bg-transparent");
        // Check hover class existence (text search in className)
        expect(button.className).toContain("hover:bg-[#8D7B68]");
    });
});

describe("PasswordInput", () => {
    it("toggles password visibility", () => {
        render(<PasswordInput placeholder="Enter password" />);
        const input = screen.getByPlaceholderText("Enter password");
        const toggleButton = screen.getByRole("button");

        // Initially password type
        expect(input).toHaveAttribute("type", "password");

        // Click to show
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute("type", "text");

        // Click to hide
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute("type", "password");
    });
});

describe("CloseButton", () => {
    it("renders with X icon", () => {
        render(<CloseButton />);
        expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });
});

describe("CategorySelect", () => {
    // Note: Testing Select interaction in JSDOM can be complex due to Radix UI portals.
    // We will verify it renders the trigger and contains text.
    it("renders the select trigger", () => {
        const categories = [{ id: "1", name: "Work", color: "blue" }];
        render(<CategorySelect categories={categories} />);

        // Shadcn Select trigger renders a button role combobox
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Select category")).toBeInTheDocument();
    });
});
