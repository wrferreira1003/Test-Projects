import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthOptions } from "@/lib/auth";


interface PrivateLayoutProps {
    children: ReactNode;
}

export default async function PrivateLayout ({children}:PrivateLayoutProps) {
    const session = await getServerSession(AuthOptions);
    if (!session) {
        return redirect("/");
    }

    return (
        <div>
            {children}
        </div>
    )

}