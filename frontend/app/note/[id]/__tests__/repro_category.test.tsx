import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
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
    useDeleteNote: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
    useCategories: () => ({
        data: [
            { id: "1", name: "Work", color: "#FF0000" }, // ID "1" string
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

describe("NotePage Category Sync Bug", () => {
    // Helper to render with Suspense
    const renderWithSuspense = (ui: React.ReactNode) => {
        return render(
            <Suspense fallback={<div>Suspense Loading...</div>}>
                {ui}
            </Suspense>
        );
    };

    it("displays the loaded category in the dropdown trigger (String ID)", async () => {
        const mockNote = {
            id: "123",
            title: "Existing Title",
            description: "Existing Description",
            category: "1", // String "1" matching category ID
            category_name: "Work",
            category_color: "#FF0000",
            updated_at: new Date().toISOString(),
        };
        (useNote as jest.Mock).mockReturnValue({ data: mockNote, isLoading: false });
        const params = Promise.resolve({ id: "123" });

        await act(async () => {
            renderWithSuspense(<NotePage params={params} />);
        });

        await waitFor(() => {
            const trigger = screen.getByRole("combobox");
            expect(trigger).toHaveTextContent("Work");
        });
    });

    it("displays the loaded category if API returns Number ID", async () => {
        const mockNote = {
            id: "123",
            title: "Existing Title",
            description: "Existing Description",
            category: 1, // Number 1 (Simulating potential API mismatch)
            category_name: "Work",
            category_color: "#FF0000",
            updated_at: new Date().toISOString(),
        };

        (useNote as jest.Mock).mockReturnValue({ data: mockNote, isLoading: false });
        const params = Promise.resolve({ id: "123" });

        await act(async () => {
            renderWithSuspense(<NotePage params={params} />);
        });

        await waitFor(() => {
            const trigger = screen.getByRole("combobox");
            // If strict equality check fails inside Select, this might be empty or placeholder
            expect(trigger).toHaveTextContent("Work");
        });
    });
});
