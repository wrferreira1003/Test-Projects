import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const AuthOptions: NextAuthOptions = {

    //Aqui configuramos o provider de autenticação(Ex: Google, Facebook, Twitter, email)
    providers: [
      CredentialsProvider({
        //Nome do provedor, quando for usar, precisa ser o mesmo nome
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: {  label: "Password", type: "password" }
        },
        //Aqui é onde fazemos a validação do usuário
        async authorize(credentials, req) {
          const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          })
          //se ele conseguir logar, ele retorna o usuário, se não, retorna null
          const user = await response.json()
          if (user && response.ok) {
            return user
          } else {
            return null
          }
        },
        
      })
    ],
    //Fora dos providers, podemos configurar a page de login, logout, etc
    //Precisamos configurar tambem o .env com as variaveis de ambiente
    pages: {
      signIn: '/',
    },
  
    callbacks: {
      async jwt({token, user}) {
        user && (token.user = user)
        return token
      },
      async session({session, token}) {
        session = token.user as any
        return session
      }
    } 
  }