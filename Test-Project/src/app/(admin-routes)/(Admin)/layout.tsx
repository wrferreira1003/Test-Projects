import { ReactNode } from "react";
import AdminLayout from "./adminrouterlayout";


interface PrivateLayoutProps {
    children: ReactNode;
}

export default function PrivateLayoutAdmin ({children}:PrivateLayoutProps) {
 
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    )

}