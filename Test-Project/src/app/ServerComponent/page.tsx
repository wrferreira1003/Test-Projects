import ButtonComponent from "@/components/buttonComponent";


const ApiData = async () => {
  const data = await fetch('https://jsonplaceholder.typicode.com/users');
  return (await data.json()) as {
  id: number;
  name: string;
}[];
}

export default async function TesteServer() {

  const data = await ApiData();
  console.log(data);
  return (
    <>
      <h1>Server Component</h1>

      {data.map((item) => (
        <div key={item.id} className="text-white">
          <h1>{item.name}</h1>
        </div>
      ))}

      {/* Temos um componente renderizado pelo servido recebendo um componente renderizado pelo cliente */}
      <ButtonComponent />

    </>
  )
}