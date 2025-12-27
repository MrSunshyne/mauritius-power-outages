export enum District {
  blackriver = 'blackriver',
  flacq = 'flacq',
  grandport = 'grandport',
  moka = 'moka',
  pamplemousses = 'pamplemousses',
  plainewilhems = 'plainewilhems',
  portlouis = 'portlouis',
  rivieredurempart = 'rivieredurempart',
  savanne = 'savanne',
  rodrigues = 'rodrigues',
}

export interface Record {
  date: string
  locality: string
  streets: string
  district: District
  from: Date
  to: Date
  id: string
}

export interface Dataset {
  [name: string]: Record[]
}
