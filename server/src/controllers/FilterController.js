import dotenv from 'dotenv'
import axios from 'axios'
import queryString from 'query-string'
import xml2js from 'xml2js'

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

async function makeTravelXsRequest(token) {
  try {
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
      data: {
        adulto: '2',
        colo: '0',
        chd1: '0',
        chd2: '0',
        chdsAges: ['0', '5', '6'],
        checkin: '02/12/2024',
        noites: '1',
        agencyPath: 'agencies/1996',
        toAgencyPath: 'agencies/24710',
        unavailable: true
      }
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

export const findAccommodationsOnTravelXs = async (req, res) => {
  const { checkInDate, days, adultCount, childsAges } = req

  try {
    const token = await authenticateTravelXs()
    const data = await makeTravelXsRequest(token)
    res.json(data)
  } catch (error) {
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
