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
const filterCountsLimits = 8

// ==================================== EXPORTS

export { rolesData, pensionSchemeData, discountRate, filterCountsLimit }
