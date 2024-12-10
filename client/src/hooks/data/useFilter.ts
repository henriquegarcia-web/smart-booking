import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '@/services/filter'
import { IFilterData, IFilterResultsData } from '@/contexts/FilterProvider'

const useFilterAccommodations = (
  filterData: IFilterData | null,
  filterMode: string
) => {
  return useQuery<IFilterResultsData>({
    // queryKey: ['filterAccommodations', filterData],
    queryKey: ['filterAccommodations', JSON.stringify(filterData), filterMode],
    queryFn: () => fetchAccommodations(filterData, filterMode),
    enabled: !!filterData
  })
}

export { useFilterAccommodations }
