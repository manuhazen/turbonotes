import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    getCategories,
    createCategory,
    CreateNoteData,
    CreateCategoryData
} from '@/lib/api/notes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useNotes = (category?: string) => {
    return useQuery({
        queryKey: ['notes', category],
        queryFn: () => getNotes(category),
    });
};

export const useNote = (id: string) => {
    return useQuery({
        queryKey: ['note', id],
        queryFn: () => getNote(id),
        enabled: !!id,
    });
};

export const useCreateNote = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNoteData) => createNote(data),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.setQueryData(['note', data.id], data);
            toast.success('Note created successfully');
        },
        onError: () => {
            toast.error('Failed to create note');
        }
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateNoteData> }) => updateNote(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['note', data.id] });
            toast.success('Note updated successfully');
        },
        onError: () => {
            toast.error('Failed to update note');
        }
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            toast.success('Note deleted successfully');
            router.push('/');
        },
        onError: () => {
            toast.error('Failed to delete note');
        }
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryData) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};
