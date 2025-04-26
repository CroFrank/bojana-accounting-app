"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "../../../hooks/use-toast"

export function AddProizvod({ onAdd }: { onAdd: () => void }) {
  const initialForm = { naziv: "", jedinica: "", cijena: "" }
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addProizvod = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return
    }
    try {
      const { error } = await supabase
        .from("Proizvodi")
        .insert([{ ...form, user_id: user.id }])
      if (error) {
        toast({
          title: "Error!",
          description: "Greška pri dodavanju proizvoda/usluge.",
          variant: "destructive",
        })
      } else {
        onAdd()
        toast({
          title: "Uspješno dodano!",
        })
      }
    } catch (err) {
      toast({
        title: "Error!",
        description: "Došlo je do neočekivane greške.",
        variant: "destructive",
      })
    } finally {
      setForm(initialForm)
      setLoading(false)
    }
  }

  return (
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
          autoFocus
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <Label htmlFor="jedinica">Jedinica mjere - kg, kom...</Label>
        <Input name="jedinica" value={form.jedinica} onChange={handleChange} />
      </div>
      <div className="flex flex-col w-full gap-2">
        <Label htmlFor="cijena">Cijena u €</Label>
        <Input name="cijena" value={form.cijena} onChange={handleChange} />
      </div>

      <Button type="submit" disabled={loading} className="min-w-fit">
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          "Dodaj proizvod"
        )}
      </Button>
    </form>
  )
}
