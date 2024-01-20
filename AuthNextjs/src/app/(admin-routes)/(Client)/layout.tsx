
import { ReactNode } from "react";
import AdminLayout from "../(Admin)/adminrouterlayout";
import ClientLayout from "./adminrouterlayout";


interface PrivateLayoutProps {
    children: ReactNode;
}

export default async function PrivateLayoutClient ({children}:PrivateLayoutProps) {
    

    return (
            <ClientLayout>
            {children}
            </ClientLayout>
    )

}