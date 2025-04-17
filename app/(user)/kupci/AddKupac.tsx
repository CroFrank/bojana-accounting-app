"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export function AddKupac({ onAdd }: { onAdd: () => void }) {
  const [form, setForm] = useState({
    ime: "",
    adresa: "",
    grad: "",
    zip: "",
    oib: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addKupac = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("Kupci").insert([form])

      if (error) {
        setError("Greška pri dodavanju kupca.")
      } else {
        onAdd()
      }
    } catch (err) {
      setError("Došlo je do neočekivane greške.")
    } finally {
      setForm({
        ime: "",
        adresa: "",
        grad: "",
        zip: "",
        oib: "",
      })
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={addKupac}
        className="flex flex-col md:flex-row gap-2 [&>input]:mb-3 mt-8 items-end"
      >
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="ime">Ime</Label>
          <Input name="ime" value={form.ime} onChange={handleChange} required />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="adresa">Adresa</Label>
          <Input name="adresa" value={form.adresa} onChange={handleChange} />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="grad">Grad</Label>
          <Input name="grad" value={form.grad} onChange={handleChange} />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="zip">Poštanski broj</Label>
          <Input name="zip" value={form.zip} onChange={handleChange} />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="oib">OIB</Label>
          <Input name="oib" value={form.oib} onChange={handleChange} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`${loading} ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            "Dodaj kupca"
          )}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </>
  )
}
