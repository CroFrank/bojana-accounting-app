export type CompanyInfo = {
  naziv: string
  adresa: string
  grad: string
  zip: string
  oib: string
  iban: string
  banka: string
}

export type Kupac = {
  id: string
  ime: string
  adresa: string
  grad: string
  zip: string
  oib: string
}

export type Proizvod = {
  id: string
  naziv: string
  jedinica: string
  cijena: string
}

export type Racun = {
  kupac: string
  adresa: string
  grad: string
  zip: string
  oib: string
  datum_racuna: string
  vrijeme_racuna: string
  mjesto_racuna: string
  dospijece: string
  datum_isporuke: string
  stavke: StavkaRacuna[]
}

export type StavkaRacuna = {
  id: string
  naziv: string
  kolicina: number | undefined
  jedinica: string
  cijena: number | undefined
}
