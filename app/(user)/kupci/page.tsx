"use client"

import { useState } from "react"
import { AddKupac } from "./AddKupac"
import { KupciTable } from "./KupciTable"

export default function KupciPage() {
  const [refresh, setRefresh] = useState(false)

  const handleRefresh = () => {
    setRefresh((prev) => !prev)
  }
  return (
    <div className="container">
      <section className="mt-20">
        <h1 className="text-2xl font-medium text-center pb-10">
          Unesite novog kupca
        </h1>
        <AddKupac onAdd={handleRefresh} />
      </section>

      <section className="my-20">
        <h1 className="text-2xl font-medium text-center pb-10">Popis kupaca</h1>
        <KupciTable refresh={refresh} />
      </section>
    </div>
  )
}
