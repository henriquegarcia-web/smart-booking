import api from '@/lib/fetch'
import { IFilterData } from '@/contexts/FilterProvider'

const fetchAccommodations = async (filterData: IFilterData) => {
  try {
    const {
      checkInDate,
      checkOutDate,
      days,
      adultCount,
      childsAges,
      mealType,
      unavailable,
      accommodationsCount
    } = filterData

    const response = await api.get(filterData.filterMode, {
      params: {
        checkInDate,
        checkOutDate,
        days,
        adultCount,
        childsAges: childsAges.join(','),
        mealType,
        unavailable,
        accommodationsCount
      }
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export { fetchAccommodations }
