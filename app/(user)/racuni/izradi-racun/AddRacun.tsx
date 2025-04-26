"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "../../../../hooks/use-toast"
import { Kupac, Racun, StavkaRacuna } from "@/types"

type Props = {
  form: Racun
  setForm: React.Dispatch<React.SetStateAction<Racun>>
  stavkaForm: StavkaRacuna
  setStavkaForm: React.Dispatch<React.SetStateAction<StavkaRacuna>>
}

export const emptyFormStavka: StavkaRacuna = {
  id: "",
  naziv: "",
  kolicina: 1,
  jedinica: "",
  cijena: 0,
}

export const emptyFormRacun: Racun = {
  kupac: "",
  adresa: "",
  grad: "",
  zip: "",
  oib: "",
  datum_racuna: "",
  vrijeme_racuna: "",
  mjesto_racuna: "",
  dospijece: "",
  datum_isporuke: "",
  stavke: [],
}

const inputFieldsRacun: {
  name: keyof Racun
  label: string
}[] = [
  { name: "kupac", label: "Ime kupca" },
  { name: "adresa", label: "Adresa" },
  { name: "grad", label: "Grad" },
  { name: "zip", label: "Poštanski broj" },
  { name: "oib", label: "OIB" },
  { name: "datum_racuna", label: "Datum računa" },
  { name: "vrijeme_racuna", label: "Vrijeme računa" },
  { name: "mjesto_racuna", label: "Mjesto izdavanja" },
  { name: "dospijece", label: "Dospijeće plaćanja" },
  { name: "datum_isporuke", label: "Datum isporuke" },
  { name: "stavke", label: "Stavke" },
]

const inputFieldsStavka: {
  name: keyof StavkaRacuna
  label: string
  placeholder?: string
}[] = [
  { name: "naziv", label: "Naziv" },
  { name: "kolicina", label: "Količina" },
  { name: "jedinica", label: "Jedinica" },
  { name: "cijena", label: "Cijena" },
]

export function AddRacun({ form, setForm, stavkaForm, setStavkaForm }: Props) {
  const [loading, setLoading] = useState(false)
  const [suggestionsKupac, setSuggestionsKupac] = useState<Kupac[]>([])
  const [showSuggestionsKupac, setShowSuggestionsKupac] = useState(false)
  const [suggestionsProizvodi, setSuggestionsProizvodi] = useState<
    StavkaRacuna[]
  >([])
  const [showSuggestionsProizvod, setShowSuggestionsProizvod] = useState(false)

  const { toast } = useToast()
  const fetchKupci = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("Kupci").select("*")
    setSuggestionsKupac(data ?? [])
  }

  const fetchProizvodi = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("Proizvodi").select("*")
    setSuggestionsProizvodi(data ?? [])
  }

  const handleChangeRacun = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === "kupac") {
      setShowSuggestionsKupac(true)
    }
  }

  const handleChangeStavka = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStavkaForm({ ...stavkaForm, [e.target.name]: e.target.value })
    if (e.target.name === "naziv") {
      setShowSuggestionsProizvod(true)
    }
  }

  const handleSelectKupac = (name: string) => {
    const selected = suggestionsKupac.find((s) => s.ime === name)
    if (selected) {
      setForm({
        ...form,
        kupac: selected.ime,
        adresa: selected.adresa || "",
        grad: selected.grad || "",
        zip: selected.zip || "",
        oib: selected.oib || "",
      })
    }
    setShowSuggestionsKupac(false)
  }

  const handleSelectProizvod = (name: string) => {
    const selected = suggestionsProizvodi.find((s) => s.naziv === name)
    if (selected) {
      setStavkaForm({
        ...stavkaForm,
        naziv: selected.naziv,
        jedinica: selected.jedinica,
        cijena: selected.cijena,
      })
    }
    setShowSuggestionsProizvod(false)
  }

  const handleAddStavka = () => {
    if (!stavkaForm.naziv || !stavkaForm.kolicina || !stavkaForm.cijena) {
      toast({
        title: "Greška!",
        description: "Unesite podatke za proizvod ili uslugu.",
        variant: "destructive",
      })
      return
    }

    setForm((prev) => ({
      ...prev,
      stavke: [...prev.stavke, stavkaForm],
    }))
    setStavkaForm(emptyFormStavka)
  }

  const addRacun = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setForm({
      ...form,
      vrijeme_racuna: new Date().toLocaleTimeString("hr-HR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    })
    // try {
    //   const supabase = createClient()
    //   const { error } = await supabase
    //     .from("Kupci")
    //     .insert([{ ime: form.kupac }])

    //   if (error) {
    //     toast({
    //       title: "Error!",
    //       description: "Greška pri dodavanju kupca.",
    //       variant: "destructive",
    //     })
    //   }
    // } catch (err) {
    //   toast({
    //     title: "Error!",
    //     description: "Došlo je do neočekivane greške.",
    //     variant: "destructive",
    //   })
    // } finally {
    //   //   setForm({ kupac: "" })
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    fetchKupci()
    fetchProizvodi()
  }, [])
  return (
    <>
      <form onSubmit={addRacun}>
        <div className="flex flex-col w-full gap-2">
          <section className="mb-8">
            <h3 className="font-semibold text-xl text-center mb-5">
              Podaci o računu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="relative flex flex-col space-y-1.5">
                {" "}
                <Label htmlFor="kupac">Ime Kupca</Label>
                <Input
                  name="kupac"
                  value={form.kupac}
                  onChange={handleChangeRacun}
                  onFocus={() => setShowSuggestionsKupac(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestionsKupac(false), 100)
                  }
                  className="border p-2 rounded"
                  autoComplete="off"
                  required
                />
                {showSuggestionsKupac && (
                  <ul className="absolute top-full mt-1 w-full bg-white border rounded shadow z-20 max-h-40 overflow-y-auto">
                    {suggestionsKupac
                      .filter((s) =>
                        s.ime.toLowerCase().includes(form.kupac.toLowerCase())
                      )
                      .map((s) => (
                        <li
                          key={s.ime}
                          onClick={() => handleSelectKupac(s.ime)}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          {s.ime}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {inputFieldsRacun.slice(1, -1).map(({ name, label }) => (
                <div
                  key={name}
                  className={`flex flex-col space-y-1.5 ${name === "vrijeme_racuna" ? "hidden" : ""}`}
                >
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    value={form[name] as string}
                    onChange={handleChangeRacun}
                    name={name}
                    type={
                      name === "datum_racuna" ||
                      name === "dospijece" ||
                      name === "datum_isporuke"
                        ? "date"
                        : "text"
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="font-semibold text-xl text-center mb-5">
              Stavke računa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="relative flex flex-col space-y-1.5">
                {" "}
                <Label htmlFor="naziv">Proizvod/Usluga</Label>
                <Input
                  name="naziv"
                  value={stavkaForm.naziv}
                  onChange={handleChangeStavka}
                  onFocus={() => setShowSuggestionsProizvod(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestionsProizvod(false), 100)
                  }
                  className="border p-2 rounded"
                  autoComplete="off"
                  required
                />
                {showSuggestionsProizvod && (
                  <ul className="absolute top-full mt-1 w-full bg-white border rounded shadow z-20 max-h-40 overflow-y-auto">
                    {suggestionsProizvodi
                      .filter((s) =>
                        s.naziv
                          .toLowerCase()
                          .includes(stavkaForm.naziv.toLowerCase())
                      )
                      .map((s) => (
                        <li
                          key={s.naziv}
                          onClick={() => handleSelectProizvod(s.naziv)}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          {s.naziv}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {inputFieldsStavka.slice(1).map(({ name, label }) => (
                <div key={name} className={`flex flex-col space-y-1.5 `}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    value={stavkaForm[name]}
                    onChange={handleChangeStavka}
                    name={name}
                    // type={
                    //   name === "datum_racuna" ||
                    //   name === "dospijece" ||
                    //   name === "datum_isporuke"
                    //     ? "date"
                    //     : "text"
                    // }
                  />
                </div>
              ))}
            </div>
            <div className="text-right mt-10">
              <Button
                type="button"
                onClick={handleAddStavka}
                disabled={loading}
                className={` ${loading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Dodaj stavku"
                )}
              </Button>
            </div>
          </section>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={loading ? "cursor-not-allowed opacity-50" : ""}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            "Dodaj kupca"
          )}
        </Button>
      </form>
    </>
  )
}
