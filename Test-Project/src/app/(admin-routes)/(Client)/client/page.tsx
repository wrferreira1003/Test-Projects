
import ButtonComponent from "@/components/buttonComponent";
import Link from "next/link";


export default async function ClientRotas() {

  return (
    <div>
      <h1>Client Admin </h1>
      <p>Email: </p>
      <Link href='/'>
        Home
      </Link>
        <div>
          <ButtonComponent/>
        </div>
    </div>
  );
}