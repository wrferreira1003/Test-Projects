const ApiData = async () => {
  const data = await fetch('https://jsonplaceholder.typicode.com/users');
  return (await data.json()) as {
  id: number;
  name: string;
}[];
}

export default async function RSC() {

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
    </>
  )
}