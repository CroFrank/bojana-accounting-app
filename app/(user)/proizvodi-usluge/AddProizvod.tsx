"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export function AddProizvod({ onAdd }: { onAdd: () => void }) {
  const [form, setForm] = useState({
    naziv: "",
    jedinica: "",
    cijena: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addProizvod = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("Proizvodi").insert([form])
      console.log(form)

      if (error) {
        setError("Greška pri dodavanju proizvoda/usluge.")
        setTimeout(() => {
          setError(null)
        }, 4000)
      } else {
        onAdd()
      }
    } catch (err) {
      setError("Došlo je do neočekivane greške.")
      setTimeout(() => {
        setError(null)
      }, 4000)
    } finally {
      setForm({
        naziv: "",
        jedinica: "",
        cijena: "",
      })
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={addProizvod}
        className="flex flex-col md:flex-row gap-2 [&>input]:mb-3 mt-8 items-end"
      >
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="naziv">Naziv</Label>
          <Input
            name="naziv"
            value={form.naziv}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="jedinica">Jedinica mjere - kg, kom...</Label>
          <Input
            name="jedinica"
            value={form.jedinica}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="cijena">Cijena u €</Label>
          <Input name="cijena" value={form.cijena} onChange={handleChange} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`${loading} ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            "Dodaj proizvod"
          )}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </>
  )
}
