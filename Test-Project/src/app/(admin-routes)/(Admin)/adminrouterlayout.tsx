'use client'
// Exemplo de um AdminLayout
import { useSession, signIn, signOut } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    //console.log(session)
    const type = session?.user.type
    console.log(type)

    useEffect(() => {
        if (status !== 'loading' && (!session || session.user.type !== 'Admin')) {
            signIn(); // Redireciona para a página de login
        }
    }, [session, status, router]);

    return <div>{children}</div>;
};

export default AdminLayout;