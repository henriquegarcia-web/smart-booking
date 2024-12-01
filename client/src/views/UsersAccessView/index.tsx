import { useState } from 'react'

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
    render: (role) => <Tag color="geekblue">{role.toUpperCase()}</Tag>
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

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    email: 'john.brown@teste.com',
    blocked: false,
    role: 'admin'
  },
  {
    key: '2',
    name: 'Jim Green',
    email: 'jimgeen@teste.com',
    blocked: false,
    role: 'admin'
  },
  {
    key: '3',
    name: 'Joe Black',
    email: 'soealack@teste.com',
    blocked: true,
    role: 'admin'
  }
]

interface IUsersAccessView {}

const UsersAccessView = ({}: IUsersAccessView) => {
  const { token } = theme.useToken()

  const [createAccessModalOpen, setCreateAccessModalOpen] = useState(false)

  const handleOpenCreateAccessModal = () => setCreateAccessModalOpen(true)
  const handleCloseCreateAccessModal = () => setCreateAccessModalOpen(false)

  return (
    <>
      <S.UsersAccessView>
        <ViewHeader
          title="Usuários e Acessos"
          legend="Gerencie usuários e a criação de acessos"
        >
          <Button onClick={handleOpenCreateAccessModal}>Criar Acesso</Button>
        </ViewHeader>
        <Table<DataType> columns={columns} dataSource={data} />
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
