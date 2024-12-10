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

export interface IFilterMode {
  modeId: string
  modeLabel: string
}

const filterModeSchemeData: IFilterMode[] = [
  {
    modeId: '/filter/accommodations',
    modeLabel: 'Todos os portais'
  },
  {
    modeId: '/filter/accommodations/travel-xs',
    modeLabel: 'Apenas TravelXS'
  },
  {
    modeId: 'only_connect_travel/connect-travel',
    modeLabel: 'Apenas Connect Travel'
  }
]

export interface IFileType {
  typeId: string
  typeLabel: string
}

const fileTypesSchemeData: IFileType[] = [
  {
    typeId: 'type_txt',
    typeLabel: 'Exportar para TXT'
  },
  {
    typeId: 'type_pdf',
    typeLabel: 'Exportar para PDF'
  }
]

// ==================================== EXPORTS

export {
  rolesData,
  pensionSchemeData,
  filterModeSchemeData,
  fileTypesSchemeData,
  discountRate,
  filterCountsLimit
}
