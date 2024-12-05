import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

// ========================================== TRAVELXS

async function authenticateTravelXs() {
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
        login: process.env.TRAVELXS_FIRST_USER,
        password: process.env.TRAVELXS_PASSWORD
      }
    })

    console.log(
      'Token de autenticação obtido:',
      response.headers['x-token'].substring(0, 10) + '...'
    )
    return response.headers['x-token']
  } catch (error) {
    console.error('Erro na autenticação:', error.message)
    throw error
  }
}

async function makeTravelXsRequest(
  token,
  checkInDate,
  checkOutDate,
  days,
  adultCount,
  childsAges,
  unavailable = false
) {
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
      agencyPath: 'agencies/1996',
      toAgencyPath: 'agencies/24710',
      unavailable: unavailable
    }

    if (formattedChildsAges.length > 0) {
      data.chdsAges = formattedChildsAges
    }

    console.log('Fazendo requisição para hoteisAvailabilityAndPrice:', {
      checkInDate,
      checkOutDate,
      days,
      adultCount
    })
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

    console.log('Número de hotéis retornados:', response.data.length)
    return response.data
  } catch (error) {
    console.error(
      'Erro na requisição hoteisAvailabilityAndPrice:',
      error.message
    )
    throw error
  }
}

async function makeMealPathRequest(
  token,
  hotelPath,
  checkInDate,
  checkOutDate
) {
  try {
    console.log('Fazendo requisição mealPath para hotel:', hotelPath)
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
    console.log('Número de opções de refeição:', response.data.length)
    return response.data
  } catch (error) {
    console.error('Erro na requisição mealPath:', error.message)
    throw error
  }
}

async function makePriceRequest(
  token,
  agencyPath,
  servicePath,
  servicePathsAsString,
  mealPath,
  persons,
  checkin,
  days
) {
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
    console.log('Preço retornado:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro na requisição price:', error.message)
    throw error
  }
}

// function compareMealTypeAndService(mealType, mealService) {
//   switch (mealType) {
//     case 'only_breakfast':
//       return mealService === 'Café da Manhã'
//     case 'half_meal':
//       return (
//         mealService === 'Café da Manhã e Jantar' ||
//         mealService === 'Café da Manhã e Almoço'
//       )
//     case 'full_meal':
//       return mealService === 'Pensão Completa'
//     default:
//       return false
//   }
// }

function compareMealTypeAndService(mealType, mealService) {
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

function getMealTypeDescription(mealType) {
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

export const findAccommodationsOnTravelXs = async (req, res) => {
  const {
    checkInDate,
    checkOutDate,
    days,
    adultCount,
    childsAges,
    mealType,
    unavailable
  } = req.query

  // console.log('Iniciando busca de acomodações com parâmetros:', {
  //   checkInDate,
  //   checkOutDate,
  //   days,
  //   adultCount,
  //   childsAges
  // })

  if (!checkInDate || !checkOutDate || !days || !adultCount) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' })
  }

  try {
    const token = await authenticateTravelXs()
    const hoteisData = await makeTravelXsRequest(
      token,
      checkInDate,
      checkOutDate,
      days,
      adultCount,
      childsAges,
      unavailable
    )

    console.log('Dados de hotéis recebidos:', hoteisData.length)

    const filterResults = []

    for (const hotel of hoteisData) {
      const hotelInfo = hotel.result[0]
      const mealPathData = await makeMealPathRequest(
        token,
        hotelInfo.hotelPath,
        checkInDate,
        checkOutDate
      )

      for (const meal of mealPathData) {
        const validation = compareMealTypeAndService(mealType, meal.service)

        if (validation) {
          const mealPath = `${hotelInfo.hotelPath}|${meal.pathAsString}`
          const adultsAmount = Array(parseInt(adultCount))
            .fill()
            .map(() => ({
              id: 0,
              name: '',
              tag: 'Adulto',
              mailing: false,
              forSave: true
            }))
          const childsAmount = !!childsAges
            ? Array(Array(childsAges).length)
                .fill()
                .map(() => ({
                  id: 0,
                  name: '',
                  tag: 'Colo',
                  mailing: false,
                  forSave: true
                }))
            : null

          const persons = childsAges
            ? adultsAmount.concat(childsAmount)
            : adultsAmount

          console.log('=================>', childsAges, persons)

          // console.log(
          //   '==========================================================='
          // )
          // console.log('Fazendo requisição price para:', {
          //   hotelName: hotelInfo.hotelName,
          //   hotelPath: hotelInfo.hotelPath,
          //   mealService: meal.service,
          //   servicePath: hotelInfo.servicePath,
          //   servicePathsAsString: hotelInfo.servicePathsAsString,
          //   mealPath,
          //   checkInDate,
          //   persons
          // })

          const priceData = await makePriceRequest(
            token,
            'agencies/1996',
            hotelInfo.servicePath,
            hotelInfo.servicePathsAsString,
            mealPath,
            persons,
            checkInDate,
            days
          )

          if (
            !!priceData &&
            !!priceData?.value &&
            priceData?.value !== undefined &&
            priceData?.value !== null &&
            priceData?.value !== ''
          )
            filterResults.push({
              accommodationName: hotelInfo.hotelName,
              accommodationPrice: priceData.value,
              accommodationMeal: getMealTypeDescription(mealType)
            })
        }
      }
    }

    console.log('Total de resultados filtrados:', filterResults.length)

    const response = {
      filterProvider: 'Travel XS',
      filterDateRange: `${checkInDate} a ${checkOutDate}`,
      filterAdults: parseInt(adultCount),
      filterChilds: childsAges ? childsAges.split(',').length : 0,
      filterResults: filterResults
    }

    console.log('Resposta final preparada')
    res.json(response)
  } catch (error) {
    console.error('Erro ao processar a busca de acomodações:', error.message)
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}

// ========================================== CONNECT TRAVEL

export const findAccommodationsOnConnectTravel = async (req, res) => {
  try {
    // const token = await authenticateConnectTravel()
    // const data = await makeConnectTravelRequest(token)
    res.json(true)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}
