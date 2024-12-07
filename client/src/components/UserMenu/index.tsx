import * as S from './styles'

import { Avatar, Dropdown, Tag, theme } from 'antd'
import type { MenuProps } from 'antd'

import { useAuth } from '@/contexts/AuthProvider'
import { formatUsername } from '@/utils/functions/formatUsername'
import { rolesData } from '@/data/admin'

interface IUserMenu {}

const UserMenu = ({}: IUserMenu) => {
  const { token } = theme.useToken()

  const { user, handleLogout } = useAuth()

  const items: MenuProps['items'] = [
    {
      label: 'Sair',
      key: '1',
      onClick: handleLogout
    }
  ]

  if (!user || !user?.data || user.isLoading) return <>Carregando...</>

  const userRole = rolesData.find((role) => role.roleId === user.data.role)

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <S.UserMenu token={token}>
        <S.UserMenuInfos>
          <p style={{ color: token.colorTextHeading }}>
            Olá, <b>{user.data.name}</b>
          </p>
          {userRole && (
            <Tag color={userRole.roleColor}>
              {userRole.roleLabel.toUpperCase()}
            </Tag>
          )}
        </S.UserMenuInfos>
        <Avatar
          style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          size={34}
        >
          {formatUsername(user.data.name)}
        </Avatar>
      </S.UserMenu>
    </Dropdown>
  )
}

export default UserMenu
