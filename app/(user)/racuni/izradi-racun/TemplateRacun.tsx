"use client"

import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { emptyCompanyInfo } from "../../dashboard/page"
import { CompanyInfo, Racun } from "@/types"

type Props = {
  form: Racun
}

export default function TemplateRacun({ form }: Props) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([
    emptyCompanyInfo,
  ])
  const [loadingFetch, setLoadingFetch] = useState(true)
  const { toast } = useToast()

  const fetchCompanyInfo = async () => {
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
      setCompanyInfo(data)
    }
    setLoadingFetch(false)
  }

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const osnovica = form.stavke.reduce(
    (acc, stavka) => acc + stavka.kolicina! * stavka.cijena!,
    0
  )
  const ukupno = osnovica

  const formatDateEU = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("hr-HR").format(date)
  }
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
        <div className="absolute top-4 right-4"></div>
        <section
          id="invoice-print"
          className="w-full max-w-[794px] aspect-[210/297] bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold break-words max-w-md">
                  {companyInfo[0].naziv +
                    "trgovinu i proizvodnju cvijeća nedjeljom"}
                </h2>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-800">RAČUN</h1>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-600">Kupac:</h3>
                <p className="text-sm">{form.kupac}</p>
                <p className="text-sm">
                  {form.adresa}, {form.zip} {form.grad}
                </p>
                <p className="text-sm">OIB: {form.oib}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Račun br. #123</p>
                <p className="text-sm">
                  Račun: {formatDateEU(form.datum_racuna)},{form.vrijeme_racuna}
                  , {form.mjesto_racuna}
                </p>
                <p className="text-sm">
                  Dospijeće plaćanja: {formatDateEU(form.dospijece)}
                </p>
                <p className="text-sm">
                  Datum isporuke: {formatDateEU(form.datum_isporuke)}
                </p>
              </div>
            </div>
            <table className="w-full text-sm border-t border-b mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Opis</th>
                  <th className="p-2">Količina</th>
                  <th className="p-2">Cijena</th>
                  <th className="p-2 text-right">Ukupno</th>
                </tr>
              </thead>
              <tbody>
                {form.stavke.map((stavka, i) => (
                  <tr key={i}>
                    <td className="p-2">{stavka.naziv}</td>
                    <td className="p-2">{stavka.kolicina}</td>
                    <td className="p-2">{stavka.cijena}€</td>
                    <td className="p-2 text-right">
                      {stavka.kolicina! * stavka.cijena!}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-full md:w-1/3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Osnovica:</span>
                  <span>{osnovica.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>PDV (25%):</span>
                  <span></span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Ukupni iznos:</span>
                  <span>{ukupno.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>Napomene</div>
          </div>
          <div>
            <div className="mt-10 text-sm text-gray-500 text-center">
              <p>
                {companyInfo[0].naziv}, {companyInfo[0].adresa},{" "}
                {companyInfo[0].zip} {companyInfo[0].grad} OIB:
                {companyInfo[0].oib}
              </p>
              <p>
                Račun za uplatu - IBAN: {companyInfo[0].iban} otvoren u{" "}
                {companyInfo[0].banka}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
