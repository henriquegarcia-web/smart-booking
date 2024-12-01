export interface IRole {
  roleId: string
  roleLabel: string
}

const rolesData: IRole[] = [
  {
    roleId: 'admin',
    roleLabel: 'Admin'
  },
  {
    roleId: 'member',
    roleLabel: 'Membro'
  }
]

export { rolesData }
