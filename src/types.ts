
export interface Record {
  date: string,
  locality: string,
  streets: string,
  district: District,
  from: Date,
  to: Date,
  id: string
}

export enum District {
  blackriver,
  flacq,
  grandport,
  moka,
  pamplemousses,
  plainewilhems,
  portlouis,
  rivieredurempart,
  savanne,
  rodrigues,
}

export interface Dataset {
  [name: string]: Record[]
}