import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { loginUser, registerUser, logoutUser, getCurrentUser, LoginCredentials, RegisterCredentials } from '@/lib/api/auth';

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
        onSuccess: (data) => {
            Cookies.set('token', data.auth_token, { expires: 7 }); // Expires in 7 days
            router.push('/');
        },
    });
};

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
        onSuccess: () => {
            // router.push('/sign-in');
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            Cookies.remove('token');
            queryClient.clear();
            router.push('/sign-in');
        },
    });
};

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        retry: false,
    });
};
