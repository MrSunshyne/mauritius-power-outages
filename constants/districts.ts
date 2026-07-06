import { District } from '~/types'

export const DISTRICT_NAMES: { [key in District]: string } = {
  [District.blackriver]: 'Black River',
  [District.flacq]: 'Flacq',
  [District.grandport]: 'Grand Port',
  [District.moka]: 'Moka',
  [District.pamplemousses]: 'Pamplemousses',
  [District.plainewilhems]: 'Plaines Wilhems',
  [District.portlouis]: 'Port Louis',
  [District.rivieredurempart]: 'Rivière du Rempart',
  [District.savanne]: 'Savanne',
  [District.rodrigues]: 'Rodrigues',
}
