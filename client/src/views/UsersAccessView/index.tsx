import { useMemo, useState } from 'react'

import * as S from './styles'

import { CreateUserAccessForm, ViewHeader } from '@/components'
import {
  Button,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  theme,
  Tooltip
} from 'antd'
import type { TableProps } from 'antd'
import { FiLock, FiTrash, FiUnlock } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthProvider'

interface DataType {
  key: string
  name: string
  email: string
  role: string
  blocked: boolean
}

interface IUsersAccessView {}

const UsersAccessView = ({}: IUsersAccessView) => {
  const { token } = theme.useToken()
  const {
    user,
    users,
    handleDeleteUser,
    handleToggleUserBlock,
    isUserOperationsLoading
  } = useAuth()

  const [createAccessModalOpen, setCreateAccessModalOpen] = useState(false)

  const handleOpenCreateAccessModal = () => setCreateAccessModalOpen(true)
  const handleCloseCreateAccessModal = () => setCreateAccessModalOpen(false)

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <>{text}</>
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <>{text}</>
    },

    {
      title: 'Permissão',
      key: 'role',
      dataIndex: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'geekblue' : 'cyan'}>
          {role === 'admin' ? 'ADMIN' : 'MEMBRO'}
        </Tag>
      )
    },
    {
      title: 'Bloqueado?',
      dataIndex: 'blocked',
      key: 'blocked',
      render: (blocked) => <>{blocked ? 'Bloqueado' : 'Não'}</>
    },
    {
      title: 'Opções',
      key: 'action',
      render: (_, record) => (
        <S.TableActions>
          <Tooltip
            placement="bottomRight"
            title="Deletar usuário"
            arrow={true}
            open={record.key !== user.data.id ? undefined : false}
          >
            <Popconfirm
              title="Deletar"
              description="Tem certeza que deseja deletar esse usuário? Essa ação não poderá ser desfeita."
              onConfirm={() => handleDeleteUser(record.key)}
              okButtonProps={{ loading: isUserOperationsLoading }}
              okText="Sim"
              cancelText="Cancelar"
              placement="topRight"
              disabled={record.key === user.data.id}
            >
              <Button
                icon={<FiTrash />}
                disabled={record.key === user.data.id}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip
            placement="bottomRight"
            title={!record.blocked ? 'Bloquear usuário' : 'Desbloquear usuário'}
            arrow={true}
            open={record.key !== user.data.id ? undefined : false}
          >
            <Popconfirm
              title={!record.blocked ? 'Bloquear' : 'Desbloquear'}
              description={
                !record.blocked
                  ? 'Tem certeza que deseja bloquear esse usuário?'
                  : 'Tem certeza que deseja desbloquear esse usuário?'
              }
              onConfirm={() =>
                handleToggleUserBlock(record.key, !record.blocked)
              }
              okButtonProps={{ loading: isUserOperationsLoading }}
              okText="Sim"
              cancelText="Cancelar"
              placement="topRight"
              disabled={record.key === user.data.id}
            >
              <Button
                icon={record.blocked ? <FiLock /> : <FiUnlock />}
                disabled={record.key === user.data.id}
              />
            </Popconfirm>
          </Tooltip>
        </S.TableActions>
      )
    }
  ]

  const formattedUsersList = useMemo(() => {
    if (!users) return []

    return users.data.map((userData) => ({
      key: userData.id,
      name: userData?.name
        ? `${userData.name}${userData?.id === user?.data.id ? ' (Você)' : ''}`
        : 'Não autenticado',
      email: userData.email,
      blocked: userData.blocked,
      role: userData.role
    }))
  }, [users])

  return (
    <>
      <S.UsersAccessView>
        <ViewHeader
          title="Usuários e Acessos"
          legend="Gerencie usuários e a criação de acessos"
        >
          <Button onClick={handleOpenCreateAccessModal}>Criar Acesso</Button>
        </ViewHeader>
        <Table<DataType>
          columns={columns}
          dataSource={formattedUsersList}
          rowClassName={(record) => (record.blocked ? 'blocked-row' : '')}
        />
      </S.UsersAccessView>

      <Modal
        title={
          <S.CreateAccessModalTitle>Criar novo acesso</S.CreateAccessModalTitle>
        }
        open={createAccessModalOpen}
        onCancel={handleCloseCreateAccessModal}
        footer={null}
      >
        <CreateUserAccessForm closeModal={handleCloseCreateAccessModal} />
      </Modal>
    </>
  )
}

export default UsersAccessView
