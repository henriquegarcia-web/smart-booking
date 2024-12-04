import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '@/services/filter'
import { IFilterData, IFilterResultsData } from '@/contexts/FilterProvider'

const useFilterAccommodations = (filterData: IFilterData | null) => {
  return useQuery<IFilterResultsData>({
    queryKey: ['filterAccommodations', filterData],
    queryFn: () => fetchAccommodations(filterData),
    enabled:
      !!filterData?.checkInDate &&
      !!filterData?.checkOutDate &&
      !!filterData?.days &&
      !!filterData?.adultCount
  })
}

export { useFilterAccommodations }
