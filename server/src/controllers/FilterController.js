import dotenv from 'dotenv'

dotenv.config()

import { formatTravelXsData } from './Filter/TravelXsController.js'
import { executeScraping } from './Filter/ConnectTravelController.js'

// Nova função para formatar os dados de resposta
// const formatResponseData = (
//   travelXsData,
//   connectTravelData,
//   checkInDate,
//   checkOutDate,
//   adultCount,
//   childsAges
// ) => {
//   const filterDateRange = `${checkInDate} a ${checkOutDate}`
//   const filterAdults = parseInt(adultCount)
//   const filterChilds = childsAges ? childsAges.split(',').length : 0

//   const filterResults = [...travelXsData, ...connectTravelData.filterResults]

//   return {
//     filterDateRange,
//     filterAdults,
//     filterChilds,
//     filterResults
//   }
// }

// Nova função unificada para buscar acomodações
export const findAccommodations = async (req, res) => {
  // const {
  //   checkInDate,
  //   checkOutDate,
  //   days,
  //   adultCount,
  //   childsAges,
  //   mealType,
  //   unavailable,
  //   accommodationsCount
  // } = req.query

  // if (
  //   !checkInDate ||
  //   !checkOutDate ||
  //   !days ||
  //   !accommodationsCount ||
  //   !adultCount ||
  //   !childsAges ||
  //   !mealType
  // ) {
  //   return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' })
  // }

  const checkInDate = '12/12/2024'
  const checkOutDate = '14/12/2024'
  const days = '2'
  const adultCount = '2'
  const childsAges = ''
  const mealType = 'only_breakfast'
  const unavailable = 'true'
  const accommodationsCount = 1

  try {
    const [connectTravelResult, travelXsResult] = await Promise.allSettled([
      executeScraping(
        checkInDate,
        checkOutDate,
        accommodationsCount,
        parseInt(adultCount),
        childsAges ? childsAges.split(',').length : 0,
        mealType
      ),
      formatTravelXsData(
        checkInDate,
        checkOutDate,
        days,
        adultCount,
        childsAges,
        mealType,
        unavailable
      )
    ])

    let filterErrors = 'without_error'
    let filterResults = []

    if (connectTravelResult.status === 'fulfilled') {
      filterResults = [
        ...filterResults,
        ...connectTravelResult.value.filterResults
      ]
    } else {
      console.error(
        'Erro ao obter resultados do ConnectTravel:',
        connectTravelResult.reason
      )
      filterErrors = 'connect_travel'
    }

    if (travelXsResult.status === 'fulfilled') {
      filterResults = [...filterResults, ...travelXsResult.value.filterResults]
    } else {
      console.error(
        'Erro ao obter resultados do TravelXs:',
        travelXsResult.reason
      )
      filterErrors =
        filterErrors === 'connect_travel' ? 'all_portals' : 'travel_xs'
    }

    const response = {
      filterDateRange: `${checkInDate} a ${checkOutDate}`,
      filterAdults: parseInt(adultCount),
      filterChilds: childsAges ? childsAges.split(',').length : 0,
      filterResults: filterResults,
      filterErrors: filterErrors
    }

    console.log(
      'Resposta final preparada, número de resultados: ',
      response.filterResults.length
    )
    res.json(response)
  } catch (error) {
    console.error('Erro ao processar a busca de acomodações:', error.message)
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }

  // try {
  //   let connectTravelResults, travelXsResults
  //   let filterErrors = 'without_error'
  //   let filterResults = []

  //   try {
  //     connectTravelResults = await executeScraping(
  //       checkInDate,
  //       checkOutDate,
  //       accommodationsCount,
  //       parseInt(adultCount),
  //       childsAges ? childsAges.split(',').length : 0,
  //       mealType
  //     )
  //     filterResults = [...filterResults, ...connectTravelResults.filterResults]
  //   } catch (error) {
  //     console.error('Erro ao obter resultados do ConnectTravel:', error.message)
  //     filterErrors = 'connect_travel'
  //   }

  //   try {
  //     travelXsResults = await formatTravelXsData(
  //       checkInDate,
  //       checkOutDate,
  //       days,
  //       adultCount,
  //       childsAges,
  //       mealType,
  //       unavailable
  //     )
  //     filterResults = [...filterResults, ...travelXsResults.filterResults]
  //   } catch (error) {
  //     console.error('Erro ao obter resultados do TravelXs:', error.message)
  //     filterErrors =
  //       filterErrors === 'connect_travel' ? 'all_portals' : 'travel_xs'
  //   }

  //   const response = {
  //     filterDateRange: `${checkInDate} a ${checkOutDate}`,
  //     filterAdults: parseInt(adultCount),
  //     filterChilds: childsAges ? childsAges.split(',').length : 0,
  //     filterResults: filterResults,
  //     filterErrors: filterErrors
  //   }

  //   console.log(
  //     'Resposta final preparada, número de resultados: ',
  //     response.filterResults.length
  //   )
  //   res.json(response)
  // } catch (error) {
  //   console.error('Erro ao processar a busca de acomodações:', error.message)
  //   res.status(500).json({
  //     error: 'Erro ao obter disponibilidade de hotéis',
  //     details: error.message
  //   })
  // }
}
