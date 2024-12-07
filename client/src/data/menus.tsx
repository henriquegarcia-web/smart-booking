import { AccommodationSearchView, SettingsView, UsersAccessView } from '@/views'
import { FiSearch, FiSettings, FiUsers } from 'react-icons/fi'

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
    menuLabel: 'Usuários e Acessos',
    menuComponent: <UsersAccessView />,
    menuIcon: <FiUsers />,
    menuDisable: false,
    menuVisible: true
  }
]

const superAdminMenusData: IMenu[] = [
  {
    menuId: 'settings-menu',
    menuLabel: 'Configurações',
    menuComponent: <SettingsView />,
    menuIcon: <FiSettings />,
    menuDisable: false,
    menuVisible: true
  }
]

export { menusData, adminMenusData, superAdminMenusData }
