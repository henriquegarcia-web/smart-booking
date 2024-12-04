import { useQuery } from '@tanstack/react-query'
import { fetchAccommodations } from '@/services/filter'
import { IAccommodation, IFilterData } from '@/contexts/FilterProvider'

const useFilterAccommodations = (filterData: IFilterData | null) => {
  return useQuery<IAccommodation[]>({
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
