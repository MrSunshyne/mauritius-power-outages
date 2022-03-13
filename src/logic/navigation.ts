import { HomeIcon } from '@heroicons/vue/outline'
import { MenuItem } from '@/types'

const menu: MenuItem[] = [
  { path: '/', name: 'Home', icon: HomeIcon },
  {
    name: '404',
    path: '/xkcd',
    icon: HomeIcon,
  },
  { path: '/about', name: 'About', icon: HomeIcon },
  { path: '/theme', name: 'Theme', icon: HomeIcon },
  { path: '/charts', name: 'Charts', icon: HomeIcon },
]

export default menu
