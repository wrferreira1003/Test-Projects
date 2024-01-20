"use client";
import { useEffect, useState } from "react";
import { ref, get, set, push, onValue, off } from "firebase/database";
import { useParams } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { db, rtdb } from "@/database/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserComponent from "@/components/UserComponent";
import { UserInterface } from "@/types/User";
import { LuSend } from "react-icons/lu";


interface Chat {
  message: string;
  timestamp: number;
  sentTo: string;
}

// Esta é uma função assíncrona que busca chats entre dois usuários do banco de dados em tempo real do Firebase.
//em resumo, esse trecho de código define a estrutura de um objeto Chat e uma função para buscar chats entre dois usuários do Firebase Realtime Database.
const fetchChats = async (uid1: string, uid2: string) => {
  const snapshot = await get(ref(rtdb, `chats/${uid1}/${uid2}`));//chats/${uid1}/${uid2}));: Esta linha busca os chats entre os usuários uid1 e uid2 do Firebase Realtime Database. A função ref é usada para criar uma referência para a localização dos chats no banco de dados, e a função get é usada para buscar os dados nessa localização.
  const cachedChats = snapshot.val();//Esta linha extrai os dados do snapshot e os armazena na variável cachedChats.
  if (cachedChats) {// Esta parte do código verifica se cachedChats existe. Se existir, a função retorna cachedChats. Se não existir, a função retorna um objeto vazio.
    return cachedChats;
  } else {
    return {};
  }
};

const ChatPage = () => {
  const { uid } = useParams();
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [message, setMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);

  useEffect(() => {
    const fetchChatsAndSaveToCache = async () => {
      console.log("Getting Data: chat");
      const snapshot = await get(ref(rtdb, `chats/${currentUser.uid}/${uid}`));//Busca os chats entre o usuário atual e o usuário com o ID uid do Firebase Realtime Database.
      const cachedChats = snapshot.val();//Extrai os dados do snapshot e os armazena na variável cachedChats.
      if (cachedChats) {//xistir (ou seja, se houver chats entre o usuário atual e o usuário com o ID uid no cache), a função setChats é chamada para atualizar o estado dos chats no componente.
        setChats(cachedChats);
      } else {//Se cachedChats não existir (ou seja, se não houver chats entre o usuário atual e o usuário com o ID uid no cache), a função fetchChats é chamada para buscar os chats do Firebase Realtime Database, e a função setChats é chamada para atualizar o estado dos chats no componente.
        const fetchedChats = await fetchChats(currentUser.uid, uid.toString());
        setChats(fetchedChats);
      }
      //em resumo, este hook useEffect busca chats do Firebase Realtime Database quando o componente é montado, verifica se os chats estão no cache, e salva os chats no estado do componente.
    };
    fetchChatsAndSaveToCache();

    //função assíncrona que busca as informações de um usuário específico do Firestore e salva essas informações no estado do componente. Aqui está o que cada parte da função faz:
    const fetchUserInfoAndSaveToState = async () => {
      console.log("Getting Data: user");
      const docRef = await getDoc(doc(db, "users", uid.toString()))// Busca o documento do usuário com o ID uid da coleção "users" no Firestore. A função doc é usada para criar uma referência para o documento do usuário, e a função getDoc é usada para buscar o documento.
        .then((doc) => {//Esta é uma promessa que é resolvida com o documento do usuário. O código dentro do bloco then é executado quando a promessa é resolvida.
          if (doc.exists()) {//Verifica se o documento do usuário existe. Se existir, o código dentro do bloco if é executado.
            const data = doc.data();//Extrai os dados do documento do usuário e os armazena na variável data.
            setUserInfo(data as UserInterface);//Chama a função setUserInfo para atualizar o estado das informações do usuário no componente.
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    };
    fetchUserInfoAndSaveToState(); //Chama a função fetchUserInfoAndSaveToState para buscar as informações do usuário e salvá-las no estado do componente.

    //Este trecho de código está usando o Firebase Realtime Database para lidar com chats em tempo real entre dois usuários
    const myChat = ref(rtdb, `chats/${currentUser.uid}/${uid}`);//Cria uma referência para a localização dos chats entre o usuário atual e o usuário com o ID uid no Firebase Realtime Database.
    const chatRef = ref(rtdb, `chats/${uid}/${currentUser.uid}`);//Cria uma referência para a localização dos chats entre o usuário com o ID uid e o usuário atual no Firebase Realtime Database. Observe que a ordem dos IDs dos usuários é invertida em comparação com a primeira referência.
    onValue(myChat, (snapshot) => {//Configura um ouvinte de valor para a primeira referência. O ouvinte é chamado sempre que os dados na localização da referência são alterados.
      const updatedChats = snapshot.val();//Extrai os dados do snapshot e os armazena na variável updatedChats.
      setChats(updatedChats);//Chama a função setChats para atualizar o estado dos chats no componente.
    //em resumo, este trecho de código busca as informações do usuário e os chats do Firebase quando o componente é montado, atualiza o estado dos chats em tempo real quando novos chats são adicionados ao Firebase, e remove os ouvintes de valor quando o componente é desmontado.
    });
    //Este trecho de código é a função de limpeza de um hook useEffect no React. A função de limpeza é executada quando o componente é desmontado.
    return () => {
      off(chatRef);//Aqui, off(chatRef); e off(myChat); estão usando a função off do Firebase para remover todos os ouvintes de eventos de chatRef e myChat.
      off(myChat);//chatRef e myChat são referências a locais específicos no Firebase Realtime Database, provavelmente onde os chats estão sendo armazenados.
      //quando o componente é desmontado, todos os ouvintes de eventos dessas duas referências são removidos, evitando possíveis vazamentos de memória ou comportamentos inesperados.
    };
  }, [uid]);

  //função sendMessage é usada para enviar uma nova mensagem de chat. Aqui está o que cada parte da função faz:
  const sendMessage = async () => {
    if (message.trim() !== "") {//Verifica se a mensagem não está vazia. Se a mensagem estiver vazia, a função retorna e não faz nada.
      const newChat: Chat = {//Cria um novo objeto de chat com a mensagem, o timestamp atual e o ID do usuário para quem a mensagem está sendo enviada.
        message,
        timestamp: Date.now(),
        sentTo: uid.toString(), //// Substitua isso pelo ID do destinatário Caso sempre seja o mesmo destinatario
      };
      /*Criam novas referências no Firebase Realtime Database para a nova mensagem de chat. A primeira referência é para a 
      localização dos chats do usuário atual para o usuário com o ID uid, e a segunda referência é para a localização dos 
      chats do usuário com o ID uid para o usuário atual.*/
      const newChatRef = push(ref(rtdb, `chats/${currentUser.uid}/${uid}`));
      const newChatRef2 = push(ref(rtdb, `chats/${uid}/${currentUser.uid}`));// Substitua "ID_DO_DESTINATARIO" pelo ID do destinatário

      //Salvam a nova mensagem de chat nas duas localizações no Firebase Realtime Database.
      await set(newChatRef, newChat);
      await set(newChatRef2, newChat);
      setMessage("");//Limpa a mensagem digitada pelo usuário.
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="bg-white border-b-1  p-4">
        <div className="flex items-center justify-between">
          {
            userInfo && <UserComponent {...(userInfo as UserInterface)} />
          }
        </div>
      </header>
      <main className="flex-grow flex flex-col p-4 gap-4 overflow-y-scroll">
        {chats && Object.values(chats).map((chat) => (
          <div
            key={chat.timestamp}
            className={`flex flex-col ${
              chat.sentTo !== currentUser.uid ? "items-end" : "justify-start"
            }`}
          >
            <div className={`flex flex-col w-fit p-4 rounded-2xl ${ chat.sentTo !== currentUser.uid ? "bg-blue-500 text-white" : "bg-gray-100" }`}>
              <div className="flex-grow">
                <p>{chat.message}</p>
              </div>
              <div className="flex-shrink">
                <p className="text-xs">
                  {new Date(chat.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </main>
      <footer className="bg-white border-t-1 p-4 ">
        <div className="flex space-x-2 flex-row items-center">
          <Input
            placeholder="Type a message"
            value={message}
            radius="full"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="rounded-full"
          />
          <Button onClick={sendMessage} className="h-14 bg-blue-600 text-xl text-white w-8 rounded-full">
          <LuSend  />

          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
