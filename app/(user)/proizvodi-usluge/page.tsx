"use client"

import { useState } from "react"
import { AddProizvod } from "./AddProizvod"
import { ProizvodTable } from "./ProizvodiTable"

export default function ProizvodiIUslugePage() {
  const [refresh, setRefresh] = useState(false)

  const handleRefresh = () => {
    setRefresh((prev) => !prev)
  }
  return (
    <div className="container">
      <section className="mt-20">
        <h1 className="text-2xl font-medium text-center pb-10">
          Unesite novi proizvod/uslugu
        </h1>
        <AddProizvod onAdd={handleRefresh} />{" "}
      </section>

      <section className="mt-20">
        <h1 className="text-2xl font-medium text-center pb-10">
          Popis proizvoda/usluga
        </h1>
        <ProizvodTable refresh={refresh} />
      </section>
    </div>
  )
}
