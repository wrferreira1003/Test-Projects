import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

interface PrivateLayoutProps {
    children: ReactNode;
}

export default async function PublicLayout ({children}:PrivateLayoutProps) {

    return (
        <div>
            {children}
        </div>
    )

}