// ==================================== ROLES

export interface IRole {
  roleId: string
  roleLabel: string
  roleColor: string
}

const rolesData: IRole[] = [
  {
    roleId: 'super_admin',
    roleLabel: 'Super Admin',
    roleColor: 'orangered'
  },
  {
    roleId: 'admin',
    roleLabel: 'Admin',
    roleColor: 'geekblue'
  },
  {
    roleId: 'member',
    roleLabel: 'Membro',
    roleColor: 'cyan'
  }
]

// ==================================== BOARD PLANS

export interface IPensionScheme {
  schemeId: string
  schemeLabel: string
}

const pensionSchemeData: IPensionScheme[] = [
  {
    schemeId: 'only_breakfast',
    schemeLabel: 'Café da Manhã'
  },
  {
    schemeId: 'half_meal',
    schemeLabel: 'Meia Pensão'
  },
  {
    schemeId: 'full_meal',
    schemeLabel: 'Pensão Completa'
  }
]

// ==================================== DISCOUNTS

const discountRate = 7

// ==================================== FILTER FORM

const filterCountsLimit = 8

// ==================================== EXPORTS

export { rolesData, pensionSchemeData, discountRate, filterCountsLimit }
