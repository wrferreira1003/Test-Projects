'use client'
// Exemplo de um AdminLayout
import { useSession, signOut} from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout ({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    //console.log(session)
    const type = session?.user.type
    console.log(type)

    useEffect(() => {
        if (status !== 'loading' && (!session || session.user.type !== 'Admin')) {
            console.log('Não é admin')
            signOut()
            router.replace('/')
             // Redireciona para a página de login
        }
    }, [session, status, router]);

    return (
    <div>
        {children}
    </div>
    )
};
