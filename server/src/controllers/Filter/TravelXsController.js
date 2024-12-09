import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

// ========================================== TRAVELXS

export const authenticateTravelXs = async (user, password) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://travel3.novaxs.com.br/channel//login/login',
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json;charset=UTF-8',
        origin: 'https://travelxs.websiteseguro.com',
        referer: 'https://travelxs.websiteseguro.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0'
      },
      data: {
        login: user,
        password: password
      }
    })

    // console.log(
    //   `Token de autenticação obtido para ${user}:`,
    //   response.headers['x-token'].substring(0, 10) + '...'
    // )
    return response.headers['x-token']
  } catch (error) {
    console.error('Erro na autenticação:', error.message)
    throw error
  }
}

const makeTravelXsRequest = async (
  token,
  checkInDate,
  checkOutDate,
  days,
  adultCount,
  childsAges,
  unavailable = false,
  accommodationProvider
) => {
  try {
    const formattedChildsAges = childsAges
      ? childsAges.split(',').map((age) => age.trim())
      : []

    const data = {
      adulto: adultCount,
      checkin: checkInDate,
      noites: days.toString(),
      colo: '0',
      chd1: '0',
      chd2: '0',
      agencyPath:
        accommodationProvider === 'enjoy' ? 'agencies/4246' : 'agencies/1996',
      toAgencyPath:
        accommodationProvider === 'enjoy' ? 'agencies/24712' : 'agencies/24710',
      unavailable: unavailable
    }

    if (formattedChildsAges.length > 0) {
      data.chdsAges = formattedChildsAges
    }

    // console.log('Fazendo requisição para hoteisAvailabilityAndPrice:', {
    //   checkInDate,
    //   checkOutDate,
    //   days,
    //   adultCount
    // })
    const response = await axios({
      method: 'post',
      url: 'https://travel3.novaxs.com.br/channel/b2b/hoteisAvailabilityAndPrice',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'pt,en-US;q=0.9,en;q=0.8,pt-BR;q=0.7',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json;charset=UTF-8',
        origin: 'https://travelxs.websiteseguro.com',
        referer: 'https://travelxs.websiteseguro.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0'
      },
      data: data
    })

    // console.log('Número de hotéis retornados:', response.data.length)
    return response.data
  } catch (error) {
    console.error(
      'Erro na requisição hoteisAvailabilityAndPrice:',
      error.message
    )
    throw error
  }
}

const makeMealPathRequest = async (
  token,
  hotelPath,
  checkInDate,
  checkOutDate
) => {
  try {
    // console.log('Fazendo requisição mealPath para hotel:', hotelPath)
    const response = await axios({
      method: 'post',
      url: 'https://travel3.novaxs.com.br/channel//b2b/mealPath',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'pt,en-US;q=0.9,en;q=0.8,pt-BR;q=0.7',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json;charset=UTF-8',
        origin: 'https://travelxs.websiteseguro.com',
        referer: 'https://travelxs.websiteseguro.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0'
      },
      data: {
        hotel: hotelPath,
        date: checkInDate,
        endDate: checkOutDate
      }
    })
    // console.log('Número de opções de refeição:', response.data.length)
    return response.data
  } catch (error) {
    console.error('Erro na requisição mealPath:', error.message)
    throw error
  }
}

const makePriceRequest = async (
  token,
  agencyPath,
  servicePath,
  servicePathsAsString,
  mealPath,
  persons,
  checkin,
  days
) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://travel3.novaxs.com.br/channel//b2b/price',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'pt,en-US;q=0.9,en;q=0.8,pt-BR;q=0.7',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json;charset=UTF-8',
        origin: 'https://travelxs.websiteseguro.com',
        referer: 'https://travelxs.websiteseguro.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0'
      },
      data: {
        agencyPath: agencyPath,
        item: {
          persons: persons,
          servicePath: servicePath,
          servicePathsAsString: servicePathsAsString,
          mealPath: mealPath,
          modulesAmount: parseInt(days),
          checkin: checkin,
          value: null,
          included: [],
          requiredTags: []
        }
      }
    })
    // console.log('Preço retornado:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro na requisição price:', error.message)
    throw error
  }
}

const compareMealTypeAndService = (mealType, mealService) => {
  const mealServiceLower = mealService.toLowerCase()
  switch (mealType) {
    case 'only_breakfast':
      return mealServiceLower === 'café da manhã'
    case 'half_meal':
      return (
        mealServiceLower.includes('café da manhã e jantar') ||
        mealServiceLower.includes('café da manhã e almoço')
      )
    case 'full_meal':
      return mealServiceLower === 'pensão completa'
    default:
      return false
  }
}

const getMealTypeDescription = (mealType) => {
  switch (mealType) {
    case 'only_breakfast':
      return 'Café da Manhã'
    case 'half_meal':
      return 'Meia Pensão'
    case 'full_meal':
      return 'Pensão Completa'
    default:
      return 'Tipo de refeição desconhecido'
  }
}

// Função separada para buscar os dados de hospedagem
export const fetchAccommodationsData = async (
  token,
  checkInDate,
  checkOutDate,
  days,
  adultCount,
  childsAges,
  mealType,
  unavailable,
  accommodationProvider
) => {
  const hoteisData = await makeTravelXsRequest(
    token,
    checkInDate,
    checkOutDate,
    days,
    adultCount,
    childsAges,
    unavailable,
    accommodationProvider
  )

  console.log('Dados de hotéis ANTES do filtro:', hoteisData.length)
  const filterResults = []

  for (const hotel of hoteisData) {
    let lowestPrice = Infinity
    let bestOption = null

    for (const roomOption of hotel.result) {
      const mealPathData = await makeMealPathRequest(
        token,
        roomOption.hotelPath,
        checkInDate,
        checkOutDate
      )

      for (const mealOption of mealPathData) {
        const validation = compareMealTypeAndService(
          mealType,
          mealOption.service
        )

        if (validation) {
          const mealPath = `${roomOption.hotelPath}|${mealOption.pathAsString}`
          const adultsAmount = Array(parseInt(adultCount))
            .fill()
            .map(() => ({
              id: 0,
              name: '',
              tag: 'Adulto',
              mailing: false,
              forSave: true
            }))
          const childsAmount = childsAges
            ? Array(childsAges.length)
                .fill()
                .map(() => ({
                  id: 0,
                  name: '',
                  tag: 'Colo',
                  mailing: false,
                  forSave: true
                }))
            : []

          const persons = [...adultsAmount, ...childsAmount]

          const priceData = await makePriceRequest(
            token,
            accommodationProvider === 'enjoy'
              ? 'agencies/4246'
              : 'agencies/1996',
            roomOption.servicePath,
            roomOption.servicePathsAsString,
            mealPath,
            persons,
            checkInDate,
            days
          )

          if (priceData?.value) {
            const numericPrice = parseFloat(priceData.value.replace(',', ''))
            // console.log(`${roomOption.hotelName}: `, numericPrice)

            if (numericPrice < lowestPrice) {
              lowestPrice = numericPrice
              bestOption = {
                accommodationName: roomOption.hotelName,
                accommodationPrice: priceData.value,
                accommodationMeal: getMealTypeDescription(mealType),
                accommodationProvider: accommodationProvider
              }
            }
          }
        }
      }
    }

    if (bestOption) {
      filterResults.push(bestOption)
    }
  }

  console.log('Dados de hotéis DEPOIS do filtro:', filterResults.length)

  return filterResults
}

export const findAccommodationsOnTravelXs = async (req, res) => {
  // const {
  //   checkInDate,
  //   checkOutDate,
  //   days,
  //   adultCount,
  //   childsAges,
  //   mealType,
  //   unavailable
  // } = req.query

  // console.log(req.query)

  const checkInDate = '12/12/2024'
  const checkOutDate = '14/12/2024'
  const days = '2'
  const adultCount = '2'
  const childsAges = ''
  const mealType = 'only_breakfast'
  const unavailable = 'true'

  if (!checkInDate || !checkOutDate || !days || !adultCount) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' })
  }

  try {
    // Primeiro login e busca com TRAVELXS_FIRST_USER
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

    // Segundo login e busca com TRAVELXS_SECOND_USER
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

    const finalResults = [...resultsFirstUser, ...resultsSecondUser]

    const response = {
      filterDateRange: `${checkInDate} a ${checkOutDate}`,
      filterAdults: parseInt(adultCount),
      filterChilds: childsAges ? childsAges.split(',').length : 0,
      filterResults: finalResults
    }

    console.log(
      'Resposta final preparada, número de resultados: ',
      finalResults.length
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
