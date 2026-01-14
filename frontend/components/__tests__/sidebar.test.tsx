
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Sidebar } from '../sidebar'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCategories } from '@/hooks/use-notes'

// Mock UserNav and CreateCategoryDialog since they are complex components
jest.mock('@/components/user-nav', () => ({
    UserNav: () => <div data-testid="user-nav">UserNav</div>
}))
jest.mock('@/components/create-category-dialog', () => ({
    CreateCategoryDialog: () => <div data-testid="create-category-dialog">Create Category</div>
}))

// Mock Hooks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
}))

jest.mock('@/hooks/use-notes', () => ({
    useCategories: jest.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

describe('Sidebar', () => {
    const mockPush = jest.fn()
    const mockReplace = jest.fn()
    const mockCategories = [
        { id: '1', name: 'Work', color: '#ff0000' },
        { id: '2', name: 'Personal', color: '#00ff00' }
    ]

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
        (usePathname as jest.Mock).mockReturnValue('/');
        (useCategories as jest.Mock).mockReturnValue({
            data: mockCategories,
            isLoading: false
        });
    })

    it('renders categories correctly', () => {
        render(<Sidebar />)
        expect(screen.getByText('Work')).toBeInTheDocument()
        expect(screen.getByText('Personal')).toBeInTheDocument()
    })

    it('handles category selection', () => {
        render(<Sidebar />)
        fireEvent.click(screen.getByText('Work'))
        expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('category=1'))
    })

    it('renders "All Categories" button', () => {
        render(<Sidebar />)
        expect(screen.getByText('All Categories')).toBeInTheDocument()
    })

    it('renders in a Drawer on mobile (simulation)', async () => {
        // This test is tricky because we rely on CSS classes for hiding/showing.
        // But we can check if the Trigger is present in the DOM.
        // Note: The actual Drawer trigger visibility depends on CSS media queries which jsdom doesn't fully support for layout.
        // However, we can check if the Drawer components are structurally present.

        render(<Sidebar />)
        // We expect a button that acts as a trigger (usually an icon)
        // Let's assume we add an aria-label="Open sidebar"
        const trigger = screen.getByLabelText('Open sidebar')
        expect(trigger).toBeInTheDocument()

        // Clicking it should open the drawer (which renders content)
        fireEvent.click(trigger)

        // Since Drawer renders in a Portal, we need to check if content appears
        // waitFor is needed for animation/portal
        await waitFor(() => {
            // We should find the categories again (inside the drawer now)
            // Since they are also in the hidden desktop sidebar, getAllByText might return multiple if not careful with "hidden"
            // But jsdom doesn't process "hidden" CSS unless we verify visibility.
            // We can check if the Drawer Content is mounted.
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
    })
})
