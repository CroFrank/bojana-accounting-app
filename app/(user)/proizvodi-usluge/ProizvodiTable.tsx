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
import { Proizvod } from "@/types"

export function ProizvodTable({ refresh }: { refresh: boolean }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [proizvodi, setProizvodi] = useState<Proizvod[]>([])
  const [loadingFetch, setLoadingFetch] = useState(true)
  const { toast } = useToast()

  const fetchProizvodi = async () => {
    setLoadingFetch(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("Proizvodi").select("*")
    if (error) {
      toast({
        variant: "destructive",
        title: " Error!",
        description: "Greška pri dohvaćanju podataka.",
      })
    } else {
      setProizvodi(data)
    }
    setLoadingFetch(false)
  }

  const deleteProizvod = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("Proizvodi").delete().eq("id", id)
      if (error) {
        toast({
          variant: "destructive",
          title: " Error!",
          description: "Greška pri brisanju proizvoda.",
        })
      } else {
        fetchProizvodi()
        toast({
          title: "Proizvod uspješno obrisan.",
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
    fetchProizvodi()
  }, [refresh])

  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        <span>Učitavanje...</span>
      </div>
    )
  }

  if (!proizvodi.length) {
    return <span className="text-center block">Nema unesenih proizvoda!</span>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Broj</TableHead>
          <TableHead>Naziv</TableHead>
          <TableHead>Jedinica mjere</TableHead>
          <TableHead>Cijena u €</TableHead>
          <TableHead className="text-right">Radnja</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proizvodi.map((proizvod, index) => (
          <TableRow key={proizvod.id ?? index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{proizvod.naziv}</TableCell>
            <TableCell>{proizvod.jedinica}</TableCell>
            <TableCell>{proizvod.cijena}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                onClick={() => deleteProizvod(proizvod.id)}
                disabled={deletingId === proizvod.id}
              >
                {deletingId === proizvod.id ? (
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
