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
import { useToast } from "../../../hooks/use-toast"
import { Kupac } from "@/types"

export function KupciTable({ refresh }: { refresh: boolean }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [kupci, setKupci] = useState<Kupac[]>([])
  const [loadingFetch, setLoadingFetch] = useState(true)
  const { toast } = useToast()

  const fetchKupci = async () => {
    setLoadingFetch(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("Kupci").select("*")
    if (error) {
      toast({
        variant: "destructive",
        title: " Error!",
        description: "Greška pri dohvaćanju podataka.",
      })
    } else {
      setKupci(data)
    }
    setLoadingFetch(false)
  }

  const deleteKupac = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("Kupci").delete().eq("id", id)
      if (error) {
        toast({
          variant: "destructive",
          title: " Error!",
          description: "Greška pri brisanju kupca.",
        })
      } else {
        fetchKupci()
        toast({
          title: "Kupac uspješno obrisan.",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: " Error!",
        description: "Došlo je do neočekivane greške.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchKupci()
  }, [refresh])

  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        <span>Učitavanje...</span>
      </div>
    )
  }
  if (!kupci.length)
    return <span className="text-center block">Nema unesenih kupaca!</span>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Broj</TableHead>
          <TableHead>Ime</TableHead>
          <TableHead>Adresa</TableHead>
          <TableHead>Grad</TableHead>
          <TableHead>Poštanski broj</TableHead>
          <TableHead>OIB</TableHead>
          <TableHead className="text-right">Radnja</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kupci.map((kupac, index) => (
          <TableRow key={kupac.id ?? index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{kupac.ime}</TableCell>
            <TableCell>{kupac.adresa}</TableCell>
            <TableCell>{kupac.grad}</TableCell>
            <TableCell>{kupac.zip}</TableCell>
            <TableCell>{kupac.oib}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                onClick={() => deleteKupac(kupac.id)}
                disabled={deletingId === kupac.id}
              >
                {deletingId === kupac.id ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Obriši"
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
