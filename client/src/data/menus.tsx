import { AccommodationSearchView, UsersAccessView } from '@/views'
import { FiSearch, FiUsers } from 'react-icons/fi'

export interface IMenu {
  menuId: string
  menuLabel: string
  menuComponent: React.ReactNode
  menuIcon: React.ReactNode
  menuDisable: boolean
  menuVisible: boolean
}

const menusData: IMenu[] = [
  {
    menuId: 'accommodation-search-menu',
    menuLabel: 'Filtro de Hospedagens',
    menuComponent: <AccommodationSearchView />,
    menuIcon: <FiSearch />,
    menuDisable: false,
    menuVisible: true
  }
]

const adminMenusData: IMenu[] = [
  {
    menuId: 'users-menu',
    menuLabel: 'Usuários & Acessos',
    menuComponent: <UsersAccessView />,
    menuIcon: <FiUsers />,
    menuDisable: false,
    menuVisible: true
  }
]

export { menusData, adminMenusData }
