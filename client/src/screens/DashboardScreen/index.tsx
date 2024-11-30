import { useEffect, useMemo, useState } from 'react'

import * as S from './styles'

import { Logo, UserMenu } from '@/components'
import { Button, theme } from 'antd'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { adminMenusData, IMenu, menusData } from '@/data/menus'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

interface IDashboardScreen {}

const DashboardScreen = ({}: IDashboardScreen) => {
  const { token } = theme.useToken()

  const [showLogo, setShowLogo] = useState(true)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true)
  const [selectedMenu, setSelectedMenu] = useState(menusData[0])

  const handleToggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen)
  const handleCloseSideMenu = () => setIsSideMenuOpen(false)

  useEffect(() => {
    if (isSideMenuOpen) {
      const timeout = setTimeout(() => setShowLogo(true), 200)
      return () => clearTimeout(timeout)
    } else {
      setShowLogo(false)
    }
  }, [isSideMenuOpen])

  return (
    <S.DashboardScreen style={{ backgroundColor: token.colorBgBase }}>
      <S.DashboardMenu
        opened={isSideMenuOpen ? 1 : 0}
        style={{ borderRight: `1px solid ${token.colorBorder}` }}
      >
        <S.DashboardMenuLogo
          opened={isSideMenuOpen ? 1 : 0}
          style={{ borderBottom: `1px solid ${token.colorBorder}` }}
        >
          {isSideMenuOpen && showLogo && <Logo />}

          <Button
            icon={isSideMenuOpen ? <FiChevronLeft /> : <FiChevronRight />}
            onClick={handleToggleSideMenu}
          />
        </S.DashboardMenuLogo>
        <S.DashboardMenuWrapper opened={isSideMenuOpen ? 1 : 0}>
          <S.MenusWrapper>
            {menusData.map((menu: IMenu) => {
              if (!menu.menuVisible) return null
              const isSelected = menu.menuId === selectedMenu.menuId

              return (
                <Button
                  key={menu.menuId}
                  type={isSelected ? 'primary' : 'default'}
                  disabled={menu.menuDisable}
                  icon={menu.menuIcon}
                  iconPosition="start"
                  onClick={() => setSelectedMenu(menu)}
                >
                  {isSideMenuOpen && menu.menuLabel}
                </Button>
              )
            })}
          </S.MenusWrapper>
          <S.MenusWrapper>
            {adminMenusData.map((menu: IMenu) => {
              if (!menu.menuVisible) return null
              const isSelected = menu.menuId === selectedMenu.menuId

              return (
                <Button
                  key={menu.menuId}
                  type={isSelected ? 'primary' : 'default'}
                  disabled={menu.menuDisable}
                  icon={menu.menuIcon}
                  iconPosition="start"
                  onClick={() => setSelectedMenu(menu)}
                >
                  {isSideMenuOpen && menu.menuLabel}
                </Button>
              )
            })}
          </S.MenusWrapper>
        </S.DashboardMenuWrapper>
      </S.DashboardMenu>
      <S.DashboardContent opened={isSideMenuOpen ? 1 : 0}>
        <S.DashboardHeader
          style={{ borderBottom: `1px solid ${token.colorBorder}` }}
        >
          <S.DashboardNavigation>{/* <UserMenu /> */}</S.DashboardNavigation>
        </S.DashboardHeader>
        <S.DashboardView>
          <S.DashboardViewWrapper
            style={{ border: `1px solid ${token.colorBorder}` }}
          >
            {selectedMenu.menuComponent}
          </S.DashboardViewWrapper>
        </S.DashboardView>
      </S.DashboardContent>
    </S.DashboardScreen>
  )
}

export default DashboardScreen
