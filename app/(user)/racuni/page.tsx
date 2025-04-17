"use client"

import { Button } from "@/components/ui/button"

export default function KupciPage() {
  return (
    <div className="container">
      <div className="text-right">
        <Button>Novi račun</Button>
      </div>
      <section className="mt-20">
        <h1 className="text-2xl font-medium text-center pb-10">Popis Računa</h1>
      </section>
    </div>
  )
}
