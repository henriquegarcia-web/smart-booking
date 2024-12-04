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

type MealType = 'only_breakfast' | 'half_meal' | 'full_meal'

export interface IFilterData {
  checkInDate: string
  checkOutDate: string
  days: number
  adultCount: number
  childsAges: number[]
  mealType?: string
  unavailable?: boolean
  discount?: number
}

export interface IAccommodation {
  accommodationName: string
  accommodationPrice: string
  accommodationMeal: string
}

export interface IFilterResults {
  filterAdults: number
  filterChilds: number
  filterDateRange: string
  filterResults: IAccommodation[]
}

interface IFilterContextData {
  filterData: IFilterData
  filterResults: {
    data: IFilterResults | undefined
    isLoading: boolean
    error: Error | null
    withoutSearch: boolean
  }
  handleFilter: (newFilterData: IFilterData) => Promise<boolean>
}

export const FilterContext = createContext<IFilterContextData>(
  {} as IFilterContextData
)

const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()
  const [filterData, setFilterData] = useState<IFilterData>({} as IFilterData)

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

  // useEffect(() => {
  //   // console.log('FILTER DATA ===>', filterData)
  //   // console.log('FILTER RESULTS DATA ===>', filterResults.data)
  //   console.log('FILTER RESULTS LOADING DATA ===>', filterResults.isLoading)
  // }, [filterResults])

  const FilterContextData = useMemo(
    () => ({
      filterData,
      filterResults: {
        data: filterResults?.data,
        isLoading: filterResults?.isLoading ?? false,
        error: filterResults?.error ?? null,
        withoutSearch: !filterData.checkInDate
      },
      handleFilter
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
