// ==================================== ROLES

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
    schemeId: 'half_board',
    schemeLabel: 'Meia Pensão'
  },
  {
    schemeId: 'full_board',
    schemeLabel: 'Pensão Completa'
  }
]

// ==================================== DISCOUNTS

const discountRateData = 7

// ==================================== EXPORTS

export { rolesData, pensionSchemeData, discountRateData }
