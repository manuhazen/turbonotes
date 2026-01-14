import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import NotePage from "../page";
import { Suspense } from "react";

// Mock hooks
const mockUpdate = jest.fn();
jest.mock("@/hooks/use-notes", () => ({
    useNote: jest.fn(),
    useUpdateNote: () => ({
        mutate: mockUpdate,
        isPending: false,
    }),
    useCategories: () => ({
        data: [
            { id: "1", name: "Work", color: "#FF0000" },
            { id: "2", name: "Personal", color: "#00FF00" }
        ],
        isLoading: false,
    }),
}));

import { useNote } from "@/hooks/use-notes";

/* eslint-disable @next/next/no-html-link-for-pages */
jest.mock("next/link", () => {
    const MockLink = ({ children }: { children: React.ReactNode }) => {
        return <a href="/">{children}</a>;
    };
    MockLink.displayName = "MockLink";
    return MockLink;
});

describe("NotePage", () => {
    const mockNote = {
        id: "123",
        title: "Existing Title",
        description: "Existing Description",
        category: "1", // Work
        category_name: "Work",
        category_color: "#FF0000",
        updated_at: new Date().toISOString(),
    };

    beforeEach(() => {
        mockUpdate.mockClear();
        (useNote as jest.Mock).mockReset();
    });

    // Helper to render with Suspense
    const renderWithSuspense = (ui: React.ReactNode) => {
        return render(
            <Suspense fallback={<div>Suspense Loading...</div>}>
                {ui}
            </Suspense>
        );
    };

    it("renders loading state", async () => {
        (useNote as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        const params = Promise.resolve({ id: "123" });

        await act(async () => {
            renderWithSuspense(<NotePage params={params} />);
        });

        // Wait for params to resolve and component to render loading state
        // If useNote is loading, it should render "Loading note..."
        // If params are pending, it renders "Suspense Loading..."
        // Since we await act, params should be resolved.

        expect(screen.getByText("Loading note...")).toBeInTheDocument();
    });

    it("renders error/not found state", async () => {
        (useNote as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: true });
        const params = Promise.resolve({ id: "123" });

        await act(async () => {
            renderWithSuspense(<NotePage params={params} />);
        });
        expect(screen.getByText("Note not found")).toBeInTheDocument();
    });

    it("renders note data and allows editing", async () => {
        (useNote as jest.Mock).mockReturnValue({ data: mockNote, isLoading: false });
        const params = Promise.resolve({ id: "123" });

        await act(async () => {
            renderWithSuspense(<NotePage params={params} />);
        });

        // Check if data is loaded into inputs
        expect(screen.getByDisplayValue("Existing Title")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing Description")).toBeInTheDocument();

        // Wait for category to be set (useEffect) and render
        await waitFor(() => {
            expect(screen.getByText("Work")).toBeInTheDocument();
        });

        // Edit Title
        const titleInput = screen.getByDisplayValue("Existing Title");
        fireEvent.change(titleInput, { target: { value: "Updated Title" } });

        // Submit
        const form = titleInput.closest("form");
        if (form) fireEvent.submit(form);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({
                id: "123",
                data: expect.objectContaining({
                    title: "Updated Title",
                    category: "1",
                })
            });
        });
    });
});
