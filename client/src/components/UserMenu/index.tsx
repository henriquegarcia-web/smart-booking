import * as S from './styles'

import { Avatar, Dropdown, Tag, theme } from 'antd'
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

  if (!user || !user?.data || user.isLoading) return <>Carregando...</>

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <S.UserMenu token={token}>
        <S.UserMenuInfos>
          <p style={{ color: token.colorTextHeading }}>
            Olá, <b>{user.data.name}</b>
          </p>
          <Tag color={user.data.role === 'admin' ? 'geekblue' : 'cyan'}>
            {user.data.role === 'admin' ? 'ADMIN' : 'MEMBRO'}
          </Tag>
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
