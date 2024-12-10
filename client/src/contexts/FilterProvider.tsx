import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useFilterAccommodations } from '@/hooks/data/useFilter'
import { filterModeSchemeData } from '@/data/admin'

type MealType = 'only_breakfast' | 'half_meal' | 'full_meal'

export interface IFilterData {
  checkInDate: string
  checkOutDate: string
  days: number
  adultCount: number
  childsAges: number[]
  mealType?: string
  unavailable?: boolean
  accommodationsCount?: number
  discount?: number
  filterMode?: string
}

export interface IAccommodation {
  accommodationName: string
  accommodationPrice: string
  accommodationMeal: string
  accommodationProvider: string
}

export interface IFilterResultsData {
  filterAdults: number
  filterChilds: number
  filterDateRange: string
  filterResults: IAccommodation[]
  filterErrors?: string
}

export interface IFilterResults {
  data: IFilterResultsData
  isLoading: boolean
  error: Error
  withoutSearch: boolean
}

interface IFilterContextData {
  filterData: IFilterData
  // filterMode: string
  filterResults: IFilterResults
  handleFilter: (newFilterData: IFilterData) => Promise<boolean>
  // handleChangeFilterMode: (type: string) => void
}

export const FilterContext = createContext<IFilterContextData>(
  {} as IFilterContextData
)

const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()

  const [filterData, setFilterData] = useState<IFilterData>({} as IFilterData)
  // const [filterMode, setFilterMode] = useState(filterModeSchemeData[0].modeId)

  const filterResults = useFilterAccommodations(filterData)

  const handleFilter = async (newFilterData: IFilterData) => {
    try {
      setFilterData(newFilterData)
      await queryClient.invalidateQueries({
        queryKey: ['filterAccommodations']
      })

      toast('Filtro aplicado com sucesso')
      return true
    } catch (error: any) {
      console.error('Falha ao aplicar filtro', error)
      toast.error(error.message || 'Erro ao aplicar filtro')
      return false
    }
  }

  // const handleChangeFilterMode = (modeId: string) => {
  //   setFilterMode(modeId)
  // }

  // useEffect(() => {
  //   // console.log('FILTER DATA ===>', filterData)
  //   // console.log('FILTER RESULTS DATA ===>', filterResults.data)
  //   console.log('FILTER RESULTS LOADING DATA ===>', filterResults.isLoading)
  // }, [filterResults])

  const FilterContextData: IFilterContextData = useMemo(
    () => ({
      filterData,
      // filterMode,
      filterResults: {
        data: filterResults?.data,
        isLoading: filterResults?.isLoading ?? false,
        error: filterResults?.error ?? null,
        withoutSearch: !filterData.checkInDate
      },
      handleFilter
      // handleChangeFilterMode
    }),
    [filterData, filterResults]
  )

  return (
    <FilterContext.Provider value={FilterContextData}>
      {children}
    </FilterContext.Provider>
  )
}

function useFilter(): IFilterContextData {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter precisa estar dentro de um FilterProvider')
  }
  return context
}

export { FilterProvider, useFilter }
