"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "../../../hooks/use-toast"

export function AddKupac({ onAdd }: { onAdd: () => void }) {
  const initialForm = {
    ime: "",
    adresa: "",
    grad: "",
    zip: "",
    oib: "",
  }
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addKupac = async (e: React.FormEvent) => {
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
        .from("Kupci")
        .insert([{ ...form, user_id: user.id }])
      if (error) {
        toast({
          title: "Error!",
          description: "Greška pri dodavanju kupca.",
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
      onSubmit={addKupac}
      className="flex flex-col md:flex-row gap-2 [&>input]:mb-3 mt-8 items-end"
    >
      <div className="flex flex-col w-full gap-2">
        <Label htmlFor="ime">Ime</Label>
        <Input
          name="ime"
          value={form.ime}
          onChange={handleChange}
          required
          autoFocus
        />
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

      <Button type="submit" disabled={loading} className="min-w-fit">
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          "Dodaj kupca"
        )}
      </Button>
    </form>
  )
}
