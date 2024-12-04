import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '@/services/filter'
import { IFilterData, IFilterResults } from '@/contexts/FilterProvider'

const useFilterAccommodations = (filterData: IFilterData | null) => {
  return useQuery<IFilterResults>({
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
