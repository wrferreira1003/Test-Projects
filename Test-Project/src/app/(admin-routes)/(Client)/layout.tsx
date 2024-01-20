
import { ReactNode } from "react";
import AdminLayout from "../(Admin)/adminrouterlayout";


interface PrivateLayoutProps {
    children: ReactNode;
}

export default async function PrivateLayoutClient ({children}:PrivateLayoutProps) {
    

    return (
      
            {children}
    
    )

}