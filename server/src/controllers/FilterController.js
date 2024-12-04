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

    return response.headers['x-token']
  } catch (error) {
    console.error(
      'Erro na autenticação:',
      error.response ? error.response.data : error.message
    )
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

    return response.data
  } catch (error) {
    console.error(
      'Erro na requisição:',
      error.response ? error.response.data : error.message
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
    return response.data
  } catch (error) {
    console.error(
      'Erro na requisição mealPath:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

// Nova função para chamar a API price
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
    return response.data
  } catch (error) {
    console.error(
      'Erro na requisição price:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const findAccommodationsOnTravelXs = async (req, res) => {
  const { checkInDate, checkOutDate, days, adultCount, childsAges } = req.query

  if (!checkInDate || !checkOutDate || !days || !adultCount) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' })
  }

  try {
    const formattedCheckInDate = formatDate(checkInDate)
    const formattedCheckOutDate = formatDate(checkOutDate)

    const token = await authenticateTravelXs()
    const hoteisData = await makeHoteisAvailabilityAndPriceRequest(
      token,
      formattedCheckInDate,
      formattedCheckOutDate,
      days,
      adultCount,
      childsAges,
      true
    )

    const filterResults = []

    for (const hotel of hoteisData) {
      const hotelInfo = hotel.result[0]
      const mealPathData = await makeMealPathRequest(
        token,
        hotelInfo.hotelPath,
        formattedCheckInDate,
        formattedCheckOutDate
      )

      for (const meal of mealPathData) {
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
          formattedCheckInDate
        )

        filterResults.push({
          accommodationName: hotelInfo.hotelName,
          accommodationPrice: priceData.value,
          accommodationMeal: meal.service
        })
      }
    }

    const response = {
      filterDateRange: `${formattedCheckInDate} a ${formattedCheckOutDate}`,
      filterAdults: parseInt(adultCount),
      filterChilds: childsAges ? childsAges.split(',').length : 0,
      filterResults: filterResults
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}

// const applyAdditionalFilters = (data, filters) => {
//   // Implemente a lógica de filtragem adicional aqui
//   // Por exemplo, filtrar por preço, classificação, etc.
//   return data
// }

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
