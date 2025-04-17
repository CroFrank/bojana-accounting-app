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

type Proizvod = {
  id: string
  naziv: string
  jedinica: string
  cijena: string
}

export function ProizvodTable({ refresh }: { refresh: boolean }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorDeletingProizvod, setErrorDeletingProizvod] = useState(false)
  const [proizvodi, setProizvodi] = useState<Proizvod[]>([])
  const [errorGetProizvodi, setErrorGetProizvodi] = useState(false)

  const fetchProizvodi = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("Proizvodi").select("*")

    if (error) {
      setErrorGetProizvodi(true)
    } else {
      setProizvodi(data)
    }
  }

  const deleteKupac = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("Proizvodi").delete().eq("id", id)
      if (error) {
        setErrorDeletingProizvod(true)
        setTimeout(() => {
          setErrorDeletingProizvod(false)
        }, 4000)
      } else {
        fetchProizvodi()
      }
    } catch (err) {
      setErrorDeletingProizvod(true)
      setTimeout(() => {
        setErrorDeletingProizvod(false)
      }, 4000)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchProizvodi()
  }, [refresh])

  if (errorGetProizvodi) return <span>Greška pri dohvaćanju podataka!</span>
  if (!proizvodi || proizvodi.length === 0)
    return <span>Nema unesenih kupaca!</span>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Broj</TableHead>
          <TableHead>Naziv</TableHead>
          <TableHead className="hidden sm:table-cell">Jedinica mjere</TableHead>
          <TableHead className="hidden sm:table-cell">Cijena u €</TableHead>
          <TableHead className="text-right">Radnja</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proizvodi.map((proizvod, index) => (
          <TableRow key={proizvod.id ?? index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{proizvod.naziv}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {proizvod.jedinica}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {proizvod.cijena}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                onClick={() => deleteKupac(proizvod.id)}
                disabled={deletingId === proizvod.id}
                className={
                  deletingId === proizvod.id
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              >
                {deletingId === proizvod.id ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Obriši"
                )}
              </Button>
              {errorDeletingProizvod ? (
                <span className="block text-red-500">error</span>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
