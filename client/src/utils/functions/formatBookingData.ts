import { ISearchForm } from '@/components/SearchAcommodationForm'
import { IFilterData } from '@/contexts/FilterProvider'

const handleFormatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const formatBookingData = (bookingData: ISearchForm): IFilterData => {
  const checkInDate: any = new Date(bookingData.checkInOutDate[0])
  const checkOutDate: any = new Date(bookingData.checkInOutDate[1])

  const formattedCheckInDate = handleFormatDate(checkInDate)
  const formattedCheckOutDate = handleFormatDate(checkOutDate)

  const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))

  const adultCount = bookingData.apartments.reduce(
    (sum, apt) => sum + apt.adultCount,
    0
  )

  const childsAges = bookingData.apartments.reduce((ages, apt) => {
    return ages.concat(apt.childrenAges)
  }, [])

  return {
    checkInDate: formattedCheckInDate,
    checkOutDate: formattedCheckOutDate,
    days,
    adultCount,
    childsAges,
    mealType: bookingData.mealType,
    unavailable: true,
    discount: bookingData.discountRate
  }
}

export { formatBookingData }
