"use client";

import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "@/database/firebase";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { updateOnlineStatus } from "@/utils/db";
import { set } from "firebase/database";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clear = async () => {
    try {
      setCurrentUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const authStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    if (currentUser) {
      setIsLoading(false);
      return;
    }
    console.log("aa");
    /*const userDoc = await getDoc(doc(db, "users", user.uid));: 
    Se o usuário estiver autenticado e não for o usuário atual, 
    a função busca os dados do usuário no Firestore na coleção 
    "users" com o ID do usuário.*/
    const userDoc = await getDoc(doc(db, "users", user.uid));
    setCurrentUser(userDoc.data());
    setIsLoading(false);
    updateOnlineStatus(user.uid, true); // Call updateOnlineStatus function
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();//Cria um novo provedor de autenticação do Google.
    signInWithPopup(auth, provider).then((result) => {//Faz o login com o Google usando um pop-up. Quando o login é bem-sucedido, a promessa é resolvida com o resultado do login.
      const docRef = doc(db, "users", result.user.uid);//Cria uma referência para o documento do usuário no Firestore.

      getDoc(docRef).then((docSnap) => {//Busca o documento do usuário no Firestore.
        if (docSnap.exists()) {
          /*Verifica se o documento do usuário existe. Se o documento existir, a função define o usuário atual como os dados do documento e 
          redireciona para a página inicial. Se o documento não existir, a função cria um novo documento para o usuário com as informações 
          do usuário e, em seguida, define o estado de carregamento como falso e redireciona para a página inicial.*/
          setCurrentUser(docSnap.data());
          router.push("/");
        } else {
          setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            name: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
            role: "user",
            createdAt: new Date(),
            isVerified: result.user.emailVerified,
            isActive: false,
            hideMe: false,
            isOnline: false,
          }).then(() => {
            setIsLoading(false)
            router.push("/");
          }
          );
        }
      });
    });
  };

  // logout
  const logout = () => {
    signOut(auth)
    router.push("/login");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(true);
      authStateChanged(user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
