import dotenv from 'dotenv'

dotenv.config()

import {
  authenticateTravelXs,
  fetchAccommodationsData
} from './Filter/TravelXsController.js'
import { executeScraping } from './Filter/ConnectTravelController.js'

// Nova função para formatar os dados de resposta
const formatResponseData = (
  travelXsData,
  connectTravelData,
  checkInDate,
  checkOutDate,
  adultCount,
  childsAges
) => {
  const filterDateRange = `${checkInDate} a ${checkOutDate}`
  const filterAdults = parseInt(adultCount)
  const filterChilds = childsAges ? childsAges.split(',').length : 0

  const filterResults = [...travelXsData, ...connectTravelData.filterResults]

  return {
    filterDateRange,
    filterAdults,
    filterChilds,
    filterResults
  }
}

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

  const checkInDate = '12/12/2024'
  const checkOutDate = '14/12/2024'
  const days = '2'
  const adultCount = '2'
  const childsAges = ''
  const mealType = 'only_breakfast'
  const unavailable = 'true'
  const accommodationsCount = 1

  if (!checkInDate || !checkOutDate || !days || !adultCount) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' })
  }

  try {
    // Busca de dados do TravelXs
    const tokenFirstUser = await authenticateTravelXs(
      process.env.TRAVELXS_FIRST_USER,
      process.env.TRAVELXS_PASSWORD
    )
    const resultsFirstUser = await fetchAccommodationsData(
      tokenFirstUser,
      checkInDate,
      checkOutDate,
      days,
      adultCount,
      childsAges,
      mealType,
      unavailable,
      'hot_beach'
    )

    const tokenSecondUser = await authenticateTravelXs(
      process.env.TRAVELXS_SECOND_USER,
      process.env.TRAVELXS_PASSWORD
    )
    const resultsSecondUser = await fetchAccommodationsData(
      tokenSecondUser,
      checkInDate,
      checkOutDate,
      days,
      adultCount,
      childsAges,
      mealType,
      unavailable,
      'enjoy'
    )

    const travelXsResults = [...resultsFirstUser, ...resultsSecondUser]

    // Busca de dados do ConnectTravel
    const connectTravelResults = await executeScraping(
      checkInDate,
      checkOutDate,
      accommodationsCount,
      parseInt(adultCount),
      childsAges ? childsAges.split(',').length : 0,
      mealType
    )

    // Formatação dos dados de resposta
    const response = formatResponseData(
      travelXsResults,
      connectTravelResults,
      checkInDate,
      checkOutDate,
      adultCount,
      childsAges
    )

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
}
