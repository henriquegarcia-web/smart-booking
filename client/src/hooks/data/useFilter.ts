import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '@/services/filter'
import { IFilterData, IFilterResultsData } from '@/contexts/FilterProvider'

const useFilterAccommodations = (filterData: IFilterData | null) => {
  return useQuery<IFilterResultsData>({
    // queryKey: ['filterAccommodations', filterData],
    queryKey: ['filterAccommodations', JSON.stringify(filterData)],
    queryFn: () => fetchAccommodations(filterData),
    enabled: !!filterData
  })
}

export { useFilterAccommodations }
