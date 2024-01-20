'use client'

import { useState } from "react"
import RSC from "../ServerComponent/RSC"


export default function Button() {

  const [inputvalue, setInputValue] = useState('')

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    console.log(event.target.value)
  }

  /* Esse componente foi renderizado pelo servidor, no componente Server Component. E nesse componente
  fiz o teste trazer um componente Renderizado pelo servidor, entao teremos um componente cliente renderizando um componente server.
  
  
  */


  return (
    <>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Button
    </button>
    
    <input 
      type="text" 
      name="name" 
      id="name"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      value={inputvalue}
      onChange={handleInput}
      />

      {/* Aqui temo um componente servidor sendo renderizado pelo cliente, gracas ao uso do ProviderServer no layout principal
      esse provider fica como um componente pai de todos os componentes. */}
        <RSC />

    </>
  )
} 