import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { io } from '../../server.js'

// await page.screenshot({ path: 'after-click-02.png' })

dotenv.config()

const DEFAULT_DELAY = 1500
const LONGER_DELAY = 2500

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// const waitForSelector = async (page, selector, timeout = 30000) => {
//   console.log(`Aguardando elemento: ${selector}`)
//   return await page.waitForSelector(selector, {
//     visible: true,
//     hidden: true,
//     timeout
//   })
// }

const waitForSelector = async (page, selector, timeout = 30000) => {
  try {
    console.log(`Aguardando elemento: ${selector}`)
    await page.waitForSelector(selector, {
      visible: true,
      hidden: true,
      timeout
    })
    console.log(`Elemento "${selector}" encontrado.`)
    return true // Retorna true se o elemento for encontrado
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.warn(
        `Timeout: Elemento "${selector}" não encontrado após ${timeout}ms.`
      )
      return false // Retorna false se não encontrar o elemento no tempo limite
    }
    throw error // Re-lança outros erros que não sejam de timeout
  }
}

// const getUserInput = (query) => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })
//   return new Promise((resolve) =>
//     rl.question(query, (answer) => {
//       rl.close()
//       resolve(answer)
//     })
//   )
// }

const handleLogin = async (page) => {
  console.log('Iniciando processo de login...')
  await page.type('#j_idt23', process.env.CONNECT_TRAVEL_USER, { delay: 50 })
  await page.type('#j_idt25', process.env.CONNECT_TRAVEL_PASSWORD, {
    delay: 50
  })
  await page.click('#j_idt27')
  await delay(DEFAULT_DELAY)
}

// const handleOTP = async (page) => {
//   console.log('Página de validação de código detectada...')
//   const validationCode = await getUserInput(
//     'Digite o código de validação recebido por e-mail: '
//   )
//   await page.type('input[type="text"]', validationCode, { delay: 50 })
//   await page.click('button[type="submit"]')
//   await delay(DEFAULT_DELAY)
// }

const handleOTP = async (page) => {
  console.log('Página de validação de código detectada...')

  return new Promise((resolve) => {
    io.emit('enterOTP')

    const checkOTP = setInterval(() => {
      const connectedSockets = Array.from(io.sockets.sockets.values())
      for (const socket of connectedSockets) {
        if (socket.otp) {
          clearInterval(checkOTP)
          const validationCode = socket.otp
          socket.otp = null // Limpa o OTP após o uso

          page
            .type('input[type="text"]', validationCode, { delay: 50 })
            .then(() => page.click('button[type="submit"]'))
            .then(() => delay(DEFAULT_DELAY))
            .then(resolve)

          break
        }
      }
    }, 1000) // Verifica a cada segundo
  })
}

const authenticateUser = async (browser) => {
  console.log('Iniciando processo de autenticação...')
  const page = await browser.newPage()

  try {
    await page.goto(process.env.CONNECT_TRAVEL_REDIRECT_URL, {
      waitUntil: 'networkidle0'
    })
    await delay(DEFAULT_DELAY)

    const currentUrl = page.url()

    if (
      currentUrl === process.env.CONNECT_TRAVEL_BASE_URL ||
      currentUrl === process.env.CONNECT_TRAVEL_LOGIN_URL
    ) {
      await handleLogin(page)
    }

    if (page.url() === process.env.CONNECT_TRAVEL_OTP_URL) {
      await handleOTP(page)
    }

    if (page.url() === process.env.CONNECT_TRAVEL_REDIRECT_URL) {
      console.log('Autenticação finalizada com sucesso!')
    } else {
      throw new Error('Redirecionamento inesperado após a autenticação.')
    }

    return await page.cookies()
  } catch (error) {
    console.error('Erro no processo de autenticação:', error)
    throw error
  } finally {
    await page.close()
  }
}

const loadSession = async (browser, cookies) => {
  console.log('Reutilizando sessão autenticada...')
  const page = await browser.newPage()

  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (['image', 'font'].includes(request.resourceType())) {
      request.abort()
    } else {
      request.continue()
    }
  })

  await page.setCookie(...cookies)
  return page
}

const navigateToBooking = async (page) => {
  console.log('Navegando para a página de booking...')
  await page.goto(process.env.CONNECT_TRAVEL_REDIRECT_URL, {
    waitUntil: 'networkidle0'
  })
  await waitForSelector(page, 'li[id="menuform:sm_leftmenu_2"] > a')
  await page.click('#layout-menubar-resize')
  await delay(DEFAULT_DELAY)
  await page.click('.layout-menubar-container li:nth-of-type(3) > a')
  await delay(DEFAULT_DELAY)
}

const fillBookingForm = async (
  page,
  frame,
  destination,
  checkInDate,
  checkOutDate,
  accommodationsCount,
  adultCount
) => {
  console.log('Preenchendo formulário de booking...')

  const destinationModalSelector = '#frmMotorHotel\\:idDestinoHotel_panel'
  const destinationModalClose = '.FontBold.Fs14.hardblue'
  const destinationItemSelector =
    '#frmMotorHotel\\:idDestinoHotel_panel tr.ui-autocomplete-item'

  const bedroomsModalSelector =
    '#frmMotorHotel .ui-panel.ui-widget.ui-widget-content.ui-corner-all.pnlConfigUh'
  const bedroomsModalOpenSelector = '#frmMotorHotel .fakeInput > a'
  const bedroomsModalCloseSelector =
    '#frmMotorHotel .ui-overlaypanel-close.ui-state-default.btn-close-config-uh'
  const bedroomsAddAccommodationInputSelector =
    '#frmMotorHotel .ui-panel.ui-widget.ui-widget-content.ui-corner-all.pnlConfigUh table tbody tr:first-of-type td:nth-of-type(2) button'

  const bedroomsAddAdultInputSelector = '#frmMotorHotel .fakeInput > a'

  const destinationInputSelector =
    '#frmMotorHotel .motor-pesquisa-container > div > div:nth-of-type(2) > div > span > input:first-of-type'
  const checkinInputSelector = '#frmMotorHotel input[placeholder="Check-in"]'
  const checkoutInputSelector = '#frmMotorHotel input[placeholder="Check-out"]'

  await frame.type(destinationInputSelector, destination)
  await waitForSelector(frame, destinationModalSelector, 30000)
  await frame.click(destinationItemSelector)
  await delay(DEFAULT_DELAY)

  console.log('[CONCLUÍDO] - Preenchimento de: Destino')

  await frame.type(checkinInputSelector, checkInDate.toString())
  await frame.click(destinationModalClose)
  await frame.click(checkoutInputSelector)
  await frame.type(checkoutInputSelector, checkOutDate.toString())
  await frame.click(destinationModalClose)
  await delay(DEFAULT_DELAY)

  console.log('[CONCLUÍDO] - Preenchimento de: Datas')
  // await page.screenshot({ path: 'after-click-02.png' })

  await frame.click(bedroomsModalOpenSelector)
  await delay(DEFAULT_DELAY)
  // await page.screenshot({ path: 'after-click-03.png' })
  await waitForSelector(frame, bedroomsModalSelector, 30000)

  for (let i = 1; i < accommodationsCount; i++) {
    await frame.click(bedroomsAddAccommodationInputSelector)
    await delay(500)
  }

  console.log('[CONCLUÍDO] - Preenchimento de: Apartamentos')
  // await page.screenshot({ path: 'after-click-01.png' })

  await frame.click(bedroomsModalCloseSelector)

  await delay(LONGER_DELAY)

  const foiOuNao = await waitForSelector(frame, '#pnlTituloResultado', 10000)

  // await page.screenshot({ path: 'after-click-01.png' })

  if (!foiOuNao) {
    await frame.click('#pnlVenda .pnlBotaoPesquisa button')
    await delay(LONGER_DELAY)

    // await page.screenshot({ path: 'after-click-02.png' })
  }
}

const scrapeAccommodations = async (page, frame, mealType) => {
  console.log('Iniciando scraping de acomodações...')
  // await delay(2000)

  // await page.screenshot({ path: 'after-click-03.png' })

  await waitForSelector(frame, '#pnlTituloResultado', 60000)

  const getAllAccommodations = async () => {
    return await frame.evaluate((mealType) => {
      const mealTypeMap = {
        only_breakfast: 'Café da manhã',
        half_meal: 'Meia pensão',
        full_meal: 'Pensão completa'
      }
      const desiredMealType = mealTypeMap[mealType]

      const cards = document.querySelectorAll(
        'span#pnlResultadoHotel > div:not(.paginacao)'
      )

      return Array.from(cards)
        .map((card) => {
          const name =
            card.querySelector('.Fs22.hardblue')?.textContent.trim() || ''
          const rooms = Array.from(card.querySelectorAll('.ui-g.Fs12.hoverQrt'))
          let lowestPrice = Infinity
          let selectedRoom = null

          rooms.forEach((room) => {
            const mealText =
              room.querySelector('.ui-g-11.ui-md-6.ui-lg-6')?.textContent || ''
            const priceText =
              room
                .querySelector('.ui-g-4.ui-md-3.ui-lg-3.TexAlRight')
                ?.textContent?.trim() || ''

            if (mealText.includes(desiredMealType)) {
              const match = priceText.match(/R\$\s?([\d.,]+)/)
              if (match) {
                const price = parseFloat(
                  match[1].replace(/\./g, '').replace(',', '.')
                )
                if (price < lowestPrice) {
                  lowestPrice = price
                  selectedRoom = { mealText, price }
                }
              }
            }
          })

          if (selectedRoom) {
            return {
              accommodationName: name,
              accommodationPrice: `R$ ${selectedRoom.price.toFixed(2)}`,
              accommodationMeal: desiredMealType,
              accommodationProvider: 'connect_travel'
            }
          }
          return null
        })
        .filter((item) => item !== null)
    }, mealType)
  }

  const getPageCount = async () => {
    return await frame.evaluate(() => {
      const paginationOptionSelector =
        'span#pnlResultadoHotel > div.paginacao > table > tbody > tr > td'
      const paginationOptions = document.querySelectorAll(
        paginationOptionSelector
      )

      if (paginationOptions.length <= 5) {
        return 1
      } else {
        return paginationOptions.length - 4
      }
    })
  }

  const pageCount = await getPageCount()
  console.log(`Total de páginas: ${pageCount}`)

  let allAccommodations = []

  for (let i = 0; i < pageCount; i++) {
    console.log(`Scraping página ${i + 1} de ${pageCount}`)

    const pageAccommodations = await getAllAccommodations()
    allAccommodations = allAccommodations.concat(pageAccommodations)

    if (i < pageCount - 1) {
      await frame.evaluate(() => {
        const nextPageButton = document.querySelector(
          'span#pnlResultadoHotel > div.paginacao > table > tbody > tr > td:nth-last-child(2)'
        )
        if (nextPageButton) {
          nextPageButton.click()
        }
      })

      await delay(DEFAULT_DELAY)
    }
  }

  console.log(`Total de acomodações encontradas: ${allAccommodations.length}`)
  return allAccommodations
}

export const executeScraping = async (
  checkInDate,
  checkOutDate,
  accommodationsCount,
  filterAdults,
  filterChilds,
  mealType
) => {
  console.log('Iniciando o processo de scraping...')

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const userDataDir = path.join(__dirname, 'user_data')
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir)
  }

  const browser = await puppeteer.launch({
    headless: true,
    userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  })

  try {
    const clientCookies = await authenticateUser(browser)
    const page = await loadSession(browser, clientCookies)

    await navigateToBooking(page)

    const frame = await page.frames().find((f) => f.name() === 'myiFrame')
    await fillBookingForm(
      page,
      frame,
      'Olimpia',
      checkInDate,
      checkOutDate,
      accommodationsCount,
      filterAdults
    )

    const accommodations = await scrapeAccommodations(page, frame, mealType)

    return {
      filterAdults,
      filterChilds,
      filterDateRange: `${checkInDate} a ${checkOutDate}`,
      filterResults: accommodations
    }
  } catch (error) {
    console.error('Erro no fluxo de scraping:', error)
    throw error
  } finally {
    await browser.close()
    console.log('Browser fechado.')
  }
}

// ========================================== CONNECT TRAVEL

export const findAccommodationsOnConnectTravel = async (req, res) => {
  const {
    checkInDate,
    checkOutDate,
    accommodationsCount,
    adultCount,
    childsAges,
    mealType
  } = req.query

  if (
    !checkInDate ||
    !checkOutDate ||
    !accommodationsCount ||
    !adultCount ||
    !childsAges ||
    !mealType
  ) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' })
  }

  try {
    // const checkInDate = '12/12/2024'
    // const checkOutDate = '14/12/2024'
    // const accommodationsCount = 1
    // const adultCount = '2'
    // const childsAges = ''
    // const mealType = 'only_breakfast'

    const response = await executeScraping(
      checkInDate,
      checkOutDate,
      accommodationsCount,
      parseInt(adultCount),
      childsAges ? childsAges.split(',').length : 0,
      mealType
    )
    res.json(response)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}
