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
      noites: days,
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
  checkin
) {
  try {
    console.log('Fazendo requisição price para:', {
      servicePath,
      mealPath,
      checkin
    })
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
          modulesAmount: 1,
          checkin: checkin,
          value: null,
          included: [],
          requiredTags: []
        }
      }
    })
    console.log('Preço retornado:', response.data.value)
    return response.data
  } catch (error) {
    console.error('Erro na requisição price:', error.message)
    throw error
  }
}

export const findAccommodationsOnTravelXs = async (req, res) => {
  const {
    checkInDate,
    checkOutDate,
    days,
    adultCount,
    childsAges,
    mealType, // 'only_breakfast' | 'half_meal' | 'full_meal'
    unavailable
  } = req.query

  console.log('Iniciando busca de acomodações com parâmetros:', {
    checkInDate,
    checkOutDate,
    days,
    adultCount,
    childsAges
  })

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
        console.log(
          '==============> ',
          meal.service,
          meal.service !== 'Café da Manhã'
        )

        if (mealType === 'only_breakfast' && meal.service !== 'Café da Manhã') {
          continue
        }
        if (
          mealType === 'half_meal' &&
          !['Café da Manhã e Jantar', 'Café da Manhã e Almoço'].includes(
            meal.service
          )
        ) {
          continue
        }
        if (mealType === 'full_meal' && meal.service !== 'Pensão Completa') {
          continue
        }

        const mealPath = `${hotelInfo.hotelPath}|${meal.pathAsString}`
        const persons = Array(parseInt(adultCount))
          .fill()
          .map(() => ({
            id: 0,
            name: '',
            tag: 'Adulto',
            mailing: false,
            forSave: true
          }))

        const priceData = await makePriceRequest(
          token,
          'agencies/1996',
          hotelInfo.servicePath,
          hotelInfo.servicePathsAsString,
          mealPath,
          persons,
          checkInDate
        )

        filterResults.push({
          accommodationName: hotelInfo.hotelName,
          accommodationPrice: priceData.value,
          accommodationMeal: meal.service
        })
      }
    }

    console.log('Total de resultados filtrados:', filterResults.length)

    const response = {
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
