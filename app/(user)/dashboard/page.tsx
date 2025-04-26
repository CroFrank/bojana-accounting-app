"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { InfoIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "../../../hooks/use-toast"
import { CompanyInfo } from "@/types"

export const emptyCompanyInfo: CompanyInfo = {
  naziv: "",
  adresa: "",
  grad: "",
  zip: "",
  oib: "",
  iban: "",
  banka: "",
}

const inputFields: {
  name: keyof CompanyInfo
  label: string
  placeholder?: string
}[] = [
  { name: "naziv", label: "Naziv", placeholder: "WebLifeSupport, obrt za ..." },
  { name: "adresa", label: "Adresa" },
  { name: "grad", label: "Grad" },
  { name: "zip", label: "Poštanski broj" },
  { name: "oib", label: "OIB" },
  { name: "iban", label: "IBAN" },
  { name: "banka", label: "Ime banke" },
]

export default function Dashboard() {
  const [form, setForm] = useState<CompanyInfo>(emptyCompanyInfo)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<CompanyInfo[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loadingFetch, setLoadingFetch] = useState(true)
  const hasInfo = info.length > 0
  const { toast } = useToast()

  const fetchInfo = async () => {
    setLoadingFetch(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("Info").select("*")
    if (error) {
      toast({
        variant: "destructive",
        title: " Error!",
        description: "Greška pri dohvaćanju podataka.",
      })
    } else {
      setInfo(data)
    }
    setLoadingFetch(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (isEditing && hasInfo) {
        // update existing
        const { error } = await supabase
          .from("Info")
          .update(form)
          .eq("user_id", user.id)

        if (error) {
          toast({
            variant: "destructive",
            title: " Error!",
            description: "Greška pri spremanju podataka.",
          })
        } else {
          toast({
            title: "Podaci uspješno izmijenjeni.",
          })
        }
      } else {
        // insert new
        const { error } = await supabase
          .from("Info")
          .insert([{ ...form, user_id: user.id }])
        if (error) {
          toast({
            variant: "destructive",
            title: " Error!",
            description: "Greška pri spremanju podataka.",
          })
        } else {
          toast({
            title: "Podaci uspješno spremljeni.",
          })
        }
      }

      // refresh data
      await fetchInfo()
      setIsEditing(false)
    } catch (err) {
      toast({
        variant: "destructive",
        title: " Error!",
        description: "Došlo je do neočekivane greške.",
      })
    } finally {
      setForm(emptyCompanyInfo)
      setLoading(false)
    }
  }

  const deleteInfo = async () => {
    setLoadingDelete(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return
    }
    try {
      const { error } = await supabase
        .from("Info")
        .delete()
        .eq("user_id", user.id)
      if (error) {
        toast({
          variant: "destructive",
          title: " Error!",
          description: "Greška pri brisanju podataka.",
        })
      } else {
        toast({
          title: "Podaci uspješno obrisani.",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: " Error!",
        description: "Došlo je do neočekivane greške.",
      })
    } finally {
      setLoadingDelete(false)
      fetchInfo()
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const editInfo = () => {
    setIsEditing(true)
    setForm(info[0])
  }

  return (
    <div className="container">
      <section className="my-20 mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-center py-3">
              Podaci o poslovnom subjektu
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                {inputFields.map(({ name, label, placeholder }) => (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label htmlFor={name}>{label}</Label>
                    <Input
                      id={name}
                      placeholder={placeholder}
                      value={hasInfo ? info[0][name] : form[name]}
                      onChange={handleChange}
                      name={name}
                      disabled={hasInfo && !isEditing}
                      required
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            {loadingFetch && (
              <div className="flex items-center justify-center pb-5">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                <span>Učitavanje...</span>
              </div>
            )}
            <CardFooter className="flex justify-between">
              {/* DELETE BUTTON */}
              <Button
                variant="destructive"
                type="button"
                onClick={deleteInfo}
                disabled={loadingDelete || !hasInfo}
              >
                {loadingDelete ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Obriši"
                )}
              </Button>
              <div className="flex gap-2">
                {/* EDIT BUTTON */}
                <Button
                  variant="outline"
                  type="button"
                  onClick={editInfo}
                  disabled={!hasInfo}
                >
                  Uredi
                </Button>

                {/* SAVE BUTTON */}
                <Button
                  type="submit"
                  disabled={loading || (hasInfo && !isEditing)}
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : isEditing ? (
                    "Ažuriraj"
                  ) : (
                    "Spremi"
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mt-10">
          <InfoIcon size="32" strokeWidth={2} />
          Podaci o poslovnom subjektu se koriste za automatsko popunjavanje u
          računima, ponudama, knjizi prometa i ostalim dokumentima.
        </div>
      </section>
    </div>
  )
}
