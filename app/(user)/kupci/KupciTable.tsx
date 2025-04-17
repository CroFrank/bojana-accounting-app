"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"

type Kupac = {
  id: string
  ime: string
  adresa: string
  grad: string
  zip: string
  oib: string
}

export function KupciTable({ refresh }: { refresh: boolean }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorDeletingKupac, setErrorDeletingKupac] = useState(false)
  const [kupci, setKupci] = useState<Kupac[]>([])
  const [errorGetKupci, setErrorGetKupci] = useState(false)

  const fetchKupci = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("Kupci").select("*")

    if (error) {
      setErrorGetKupci(true)
    } else {
      setKupci(data)
    }
  }

  const deleteKupac = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("Kupci").delete().eq("id", id)
      if (error) {
        setErrorDeletingKupac(true)
        setTimeout(() => {
          setErrorDeletingKupac(false)
        }, 4000)
      } else {
        fetchKupci()
      }
    } catch (err) {
      setErrorDeletingKupac(true)
      setTimeout(() => {
        setErrorDeletingKupac(false)
      }, 4000)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchKupci()
  }, [refresh])

  if (errorGetKupci) return <span>Greška pri dohvaćanju podataka!</span>
  if (!kupci || kupci.length === 0) return <span>Nema unesenih kupaca!</span>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Broj</TableHead>
          <TableHead>Ime</TableHead>
          <TableHead className="hidden sm:table-cell">Adresa</TableHead>
          <TableHead className="hidden sm:table-cell">Grad</TableHead>
          <TableHead className="hidden sm:table-cell">Poštanski broj</TableHead>
          <TableHead className="hidden sm:table-cell">OIB</TableHead>
          <TableHead className="text-right">Radnja</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kupci.map((kupac, index) => (
          <TableRow key={kupac.id ?? index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{kupac.ime}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {kupac.adresa}
            </TableCell>
            <TableCell className="hidden sm:table-cell">{kupac.grad}</TableCell>
            <TableCell className="hidden sm:table-cell">{kupac.zip}</TableCell>
            <TableCell className="hidden sm:table-cell">{kupac.oib}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                onClick={() => deleteKupac(kupac.id)}
                disabled={deletingId === kupac.id}
                className={
                  deletingId === kupac.id ? "cursor-not-allowed opacity-50" : ""
                }
              >
                {deletingId === kupac.id ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Obriši"
                )}
              </Button>
              {errorDeletingKupac ? (
                <span className="block text-red-500">error</span>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
