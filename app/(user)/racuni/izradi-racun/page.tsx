"use client"

import { useState } from "react"
import { AddRacun, emptyFormRacun, emptyFormStavka } from "./AddRacun"
import TemplateRacun from "./TemplateRacun"
import { Racun, StavkaRacuna } from "@/types"

export default function IzradiRacunPage() {
  const [form, setForm] = useState<Racun>(emptyFormRacun)
  const [stavkaForm, setStavkaForm] = useState<StavkaRacuna>(emptyFormStavka)
  return (
    <div className="container">
      <section className="mt-20">
        <h1 className="text-2xl font-medium text-center pb-10">Novi Račun</h1>
        <AddRacun
          form={form}
          setForm={setForm}
          stavkaForm={stavkaForm}
          setStavkaForm={setStavkaForm}
        />
      </section>
      <section className="mt-20">
        <h1 className="text-2xl font-medium text-center pb-10">
          Račun za ispis
        </h1>
        <TemplateRacun form={form} />
      </section>
    </div>
  )
}
