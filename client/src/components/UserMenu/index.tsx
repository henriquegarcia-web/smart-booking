import * as S from './styles'

import { Avatar, Dropdown, theme } from 'antd'
import type { MenuProps } from 'antd'

import { useAuth } from '@/contexts/AuthProvider'
import { formatUsername } from '@/utils/functions/formatUsername'

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

  if (!user) return <>Carregando...</>

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <S.UserMenu token={token}>
        <p style={{ color: token.colorTextHeading }}>
          Olá, <b>{user.name}</b>
        </p>
        <Avatar
          style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          size={28}
        >
          {formatUsername(user.name)}
        </Avatar>
      </S.UserMenu>
    </Dropdown>
  )
}

export default UserMenu
