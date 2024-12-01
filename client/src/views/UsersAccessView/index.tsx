import { useEffect, useMemo, useState } from 'react'

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
import { FiTrash, FiXCircle } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthProvider'

interface DataType {
  key: string
  name: string
  email: string
  role: string
  blocked: boolean
}

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
    render: (blocked) => <>{blocked ? 'Sim' : 'Não'}</>
  },
  {
    title: 'Opções',
    key: 'action',
    render: (_, record) => (
      <S.TableActions>
        <Tooltip placement="bottomRight" title="Deletar usuário" arrow={true}>
          <Popconfirm
            title="Deletar usuário"
            description="Tem certeza que deseja deletar esse usuário? Essa ação não poderá ser desfeita."
            onConfirm={() => console.log('AQUI')}
            okText="Sim, deletar"
            cancelText="Cancelar"
            placement="topRight"
          >
            <Button icon={<FiTrash />} />
          </Popconfirm>
        </Tooltip>
        <Tooltip placement="bottomRight" title="Bloquear usuário" arrow={true}>
          <Popconfirm
            title="Bloquear usuário"
            description="Tem certeza que deseja bloquear esse usuário?"
            onConfirm={() => console.log('AQUI')}
            okText="Sim, bloquear"
            cancelText="Cancelar"
            placement="topRight"
          >
            <Button icon={<FiXCircle />} />
          </Popconfirm>
        </Tooltip>
      </S.TableActions>
    )
  }
]

interface IUsersAccessView {}

const UsersAccessView = ({}: IUsersAccessView) => {
  const { token } = theme.useToken()
  const { allUsers } = useAuth()

  const [createAccessModalOpen, setCreateAccessModalOpen] = useState(false)

  const handleOpenCreateAccessModal = () => setCreateAccessModalOpen(true)
  const handleCloseCreateAccessModal = () => setCreateAccessModalOpen(false)

  // useEffect(() => {
  //   console.log(allUsers)
  // }, [allUsers])

  const formattedUsersList = useMemo(() => {
    if (!allUsers) return []

    return allUsers.map((user) => ({
      key: user.id,
      name: user?.name || 'Não autenticado',
      email: user.email,
      blocked: user.blocked,
      role: user.role
    }))
  }, [allUsers])

  return (
    <>
      <S.UsersAccessView>
        <ViewHeader
          title="Usuários e Acessos"
          legend="Gerencie usuários e a criação de acessos"
        >
          <Button onClick={handleOpenCreateAccessModal}>Criar Acesso</Button>
        </ViewHeader>
        <Table<DataType> columns={columns} dataSource={formattedUsersList} />
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
