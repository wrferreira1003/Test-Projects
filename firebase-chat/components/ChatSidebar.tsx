"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/database/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { UserInterface } from "@/types/User";
import UserComponent from "./UserComponent";
import { LuArrowRight, LuSearch } from "react-icons/lu";
import { Input, Spacer } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";

// get all users from firestore / Busca todos os usários no Firestore
const fetchUsers = async (): Promise<UserInterface[]> => {
  const q = query(collection(db, "users"), where("hideMe", "==", false));//Cria uma consulta para a coleção "users" no Firestore, onde o campo hideMe é igual a false.
  const usersSnapshot = await getDocs(q);//Executa a consulta e espera os resultados. O resultado é um "snapshot" dos documentos que correspondem à consulta.
  const users: UserInterface[] = []; // Inicializa um array vazio para armazenar os usuários.
  usersSnapshot.forEach((doc) => {
    users.push({ uid: doc.id, ...doc.data() } as UserInterface);//Para cada documento no snapshot, cria um objeto de usuário com o ID do documento e os dados do documento, e adiciona esse objeto ao array de usuários.
  });
  return users;
};


const ChatSidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsersAndSaveToState = async () => {
      let users = await fetchUsers(); //Chama a função assíncrona fetchUsers que busca todos os usuários do Firestore. A função retorna uma promessa que resolve para um array de usuários, e o await faz com que o código espere até que a promessa seja resolvida.
      // remove current user from users list
      users = users.filter((user) => user.uid !== currentUser.uid);//Filtra o array de usuários para remover o usuário atual. A função filter retorna um novo array que inclui apenas os usuários cujo uid é diferente do uid do usuário atual.
      setUsers(users);
    };
    fetchUsersAndSaveToState();
  }, []);

  console.log(users);

  //manipulador de eventos que é chamado quando o usuário digita algo em um campo de pesquisa
  const handleSearch = (e: any) => {
    setSearch(e.target.value);//Atualiza o estado de search com o valor atual do campo de pesquisa. e.target.value é o valor atual do campo de pesquisa.
    const filteredUsers = users.filter((user) => {//Filtra a lista de usuários para incluir apenas aqueles cujo nome inclui o valor de pesquisa. 
      return user.name.toLowerCase().includes(search.toLowerCase());///A função toLowerCase é usada para tornar a pesquisa insensível a maiúsculas e minúsculas.
    });
    setFilteredUsers(filteredUsers);//Atualiza o estado de filteredUsers com a lista de usuários filtrados.
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 ">
      {/* searchbar */}
      <div className=" flex flex-row bg-white p-4 m-2 rounded-2xl items-center space-x-2 shadow-2xl shadow-gray-200   ">
        <input
          className="w-full outline-none text-lg"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
        />
        <SearchIcon className="text-xl cursor-pointer text-gray-600" />
      </div>
      <Spacer y={2} />
      <div>
        {search.length > 0
          ? filteredUsers.map((user) => (
              <div
                key={user.uid}
                className="p-4 m-2 bg-white cursor-pointer rounded-2xl"
                onClick={() => router.push(`/chat/${user.uid}`)}
              >
                <UserComponent {...user} />
              </div>
            ))
          : users.map((user) => (
              <div
                key={user.uid}
                className="p-4 m-2 bg-white cursor-pointer rounded-2xl"
                onClick={() => router.push(`/chat/${user.uid}`)}
              >
                <UserComponent {...user} />
              </div>
            ))}
      </div>
      {/* footer for setting page */}
      <div className="absolute bottom-0 w-full">
        <div
          className="flex flex-row items-center w-full shadow-2xl shadow-gray-300  rounded-t-2xl p-4 font-medium bg-white text-gray-700 cursor-pointer justify-between "
          onClick={() => router.push("/chat/settings")}
        >
          <p>Settings</p>
          <LuArrowRight />
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
