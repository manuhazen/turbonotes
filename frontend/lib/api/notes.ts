import { api } from '@/lib/axios';

export interface Category {
    id: string;
    name: string;
    color: string;
    creator: number;
    created_at: string;
    updated_at: string;
}

export interface Note {
    id: string;
    title: string;
    description: string;
    audio_file?: string | null;
    category: string | null; // Category ID
    category_name?: string;
    category_color?: string;
    creator: number;
    created_at: string;
    updated_at: string;
}

export interface CreateNoteData {
    title: string;
    description?: string;
    category?: string | null;
    audio_file?: File | null;
}

export interface CreateCategoryData {
    name: string;
    color: string;
}

export const getNotes = async (category?: string): Promise<Note[]> => {
    const params = category ? { category } : {};
    const { data } = await api.get<Note[]>('/notes/', { params });
    return data;
};

export const getNote = async (id: string): Promise<Note> => {
    const { data } = await api.get<Note>(`/notes/${id}/`);
    return data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
    // If audio_file is present, we might need FormData. 
    // Djoser/DRF usually handles JSON, but File uploads need FormData.
    if (noteData.audio_file) {
        const formData = new FormData();
        formData.append('title', noteData.title);
        if (noteData.description) formData.append('description', noteData.description);
        if (noteData.category) formData.append('category', noteData.category);
        formData.append('audio_file', noteData.audio_file);

        const { data } = await api.post<Note>('/notes/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    const { data } = await api.post<Note>('/notes/', noteData);
    return data;
};

export const updateNote = async (id: string, noteData: Partial<CreateNoteData>): Promise<Note> => {
    // If audio_file is present, we might need FormData. 
    if (noteData.audio_file) {
        const formData = new FormData();
        if (noteData.title) formData.append('title', noteData.title);
        if (noteData.description) formData.append('description', noteData.description);
        if (noteData.category) formData.append('category', noteData.category);
        formData.append('audio_file', noteData.audio_file);

        const { data } = await api.patch<Note>(`/notes/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    const { data } = await api.patch<Note>(`/notes/${id}/`, noteData);
    return data;
};

export const deleteNote = async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}/`);
};

export const getCategories = async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories/');
    return data;
};

export const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
    const { data } = await api.post<Category>('/categories/', categoryData);
    return data;
};
