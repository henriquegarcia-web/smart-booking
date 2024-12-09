import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// await page.screenshot({ path: 'after-click-03.png' })

dotenv.config()

const DEFAULT_DELAY = 2000
const LONGER_DELAY = 10000

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const waitForNavigationAndSelector = async (
  page,
  expectedUrl,
  selector,
  timeout = 30000
) => {
  console.log(`Aguardando URL: ${expectedUrl} e elemento: ${selector}`)
  await page.waitForFunction(
    (url) => window.location.href === url,
    { timeout },
    expectedUrl
  )
  console.log(`Redirecionamento e elemento "${selector}" prontos.`)
}

const getUserInput = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close()
      resolve(answer)
    })
  )
}

export const authenticateUser = async (browser) => {
  console.log('Iniciando processo de autenticação...')

  const page = await browser.newPage()
  try {
    // 1. Acessa a página base
    console.log(`Acessando URL base: ${process.env.CONNECT_TRAVEL_BASE_URL}`)
    await page.goto(process.env.CONNECT_TRAVEL_BASE_URL, {
      waitUntil: 'domcontentloaded'
    })

    // 2. Verifica para onde foi redirecionado
    console.log('Verificando redirecionamento...')
    await delay(DEFAULT_DELAY)
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

    const currentUrl = page.url()
    if (
      currentUrl === process.env.CONNECT_TRAVEL_BASE_URL ||
      currentUrl === process.env.CONNECT_TRAVEL_LOGIN_URL
    ) {
      console.log('Página de login detectada...')
      // Preenche o formulário de login e clica em entrar
      console.log('Preenchendo formulário de login...')
      await page.type('#j_idt23', process.env.CONNECT_TRAVEL_USER, {
        delay: 50
      })
      await page.type('#j_idt25', process.env.CONNECT_TRAVEL_PASSWORD, {
        delay: 50
      })
      await page.click('#j_idt27')

      // Aguarda redirecionamento para a página de validação do código ou página principal
      console.log('Aguardando redirecionamento após login...')
      // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
      await delay(DEFAULT_DELAY)

      const postLoginUrl = page.url()
      if (postLoginUrl === process.env.CONNECT_TRAVEL_OTP_URL) {
        console.log('Página de validação de código detectada...')
        // Solicita o código ao cliente (input via terminal ou API)
        const validationCode = await getUserInput(
          'Digite o código de validação recebido por e-mail: '
        )

        // Insere o código e envia
        console.log('Inserindo código de validação...')
        await page.type('input[type="text"]', validationCode, { delay: 50 })
        await page.click('button[type="submit"]')

        // Aguarda redirecionamento para a página principal (home)
        console.log('Validando código e aguardando redirecionamento...')
        // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
        await delay(DEFAULT_DELAY)
      }

      if (page.url() === process.env.CONNECT_TRAVEL_REDIRECT_URL) {
        console.log('Autenticação finalizada com sucesso!')
      } else {
        throw new Error('Redirecionamento inesperado após a autenticação.')
      }
    } else if (currentUrl === process.env.CONNECT_TRAVEL_REDIRECT_URL) {
      console.log(
        'Usuário já autenticado, redirecionado diretamente para a página principal.'
      )
    } else {
      console.log(currentUrl)
      throw new Error('Redirecionamento inesperado ao acessar a URL base.')
    }

    // Retorna a sessão autenticada
    const clientCookies = await page.cookies()
    return clientCookies
  } catch (error) {
    console.error('Erro no processo de autenticação:', error)
    throw error
  } finally {
    await page.close()
  }
}

export const loadSession = async (browser, cookies) => {
  console.log('Reutilizando sessão autenticada...')
  const page = await browser.newPage()

  try {
    // Adiciona os cookies à nova página
    await page.setCookie(...cookies)
    console.log('Cookies carregados com sucesso.')

    return page
  } catch (error) {
    console.error('Erro ao carregar sessão:', error)
    throw error
  }
}

const handleFilterPage = async (page, frame, mealType) => {
  console.log('Iniciando o processo de filtro e scraping...')

  try {
    // Verifica se o elemento pai existe
    const pnlResultadoHotel = await frame.$('#pnlResultadoHotel')
    if (!pnlResultadoHotel) {
      console.log('Elemento #pnlResultadoHotel não encontrado')
      return []
    }

    // Coleta os dados brutos dos cards
    const cardsRawData = await frame.$$eval(
      'span#pnlResultadoHotel > div:not(.paginacao)',
      (cards, mealType) => {
        return cards.map((card) => {
          const name =
            card.querySelector('.Fs22.hardblue')?.textContent.trim() || ''
          const rooms = Array.from(card.querySelectorAll('.ui-g.Fs12.hoverQrt'))
          const roomsData = rooms.map((room) => ({
            mealText:
              room.querySelector('.ui-g-11.ui-md-6.ui-lg-6')?.textContent || '',
            priceText:
              room
                .querySelector('.ui-g-4.ui-md-3.ui-lg-3.TexAlRight')
                ?.textContent?.trim() || ''
          }))
          return { name, roomsData, html: card.outerHTML }
        })
      },
      mealType
    )

    console.log(`Número de cards encontrados: ${cardsRawData.length}`)

    // Processa os dados coletados
    const processedData = cardsRawData
      .map((cardData, index) => {
        console.log(`Processando card ${index + 1}`)
        console.log('OPÇÕES ===>', cardData.roomsData.length)
        // console.log('CARD HTML ===>\n', cardData.html)

        const mealTypeMap = {
          only_breakfast: 'Café da manhã' || 'Breakfast',
          half_meal: 'Meia pensão' || 'Half board',
          full_meal: 'Pensão completa' || 'Full board'
        }
        const desiredMealType = mealTypeMap[mealType]

        let lowestPrice = Infinity
        let selectedRoom = null

        cardData.roomsData.forEach((room) => {
          if (room.mealText.includes(desiredMealType)) {
            const match = room.priceText.match(/R\$\s?([\d.,]+)/)
            if (!match) return

            const valueString = match[1]

            const floatValue = parseFloat(
              valueString.replace(/\./g, '').replace(',', '.')
            )

            if (floatValue < lowestPrice) {
              lowestPrice = floatValue
              selectedRoom = room
            }
          }
        })

        if (selectedRoom) {
          return {
            accommodationName: cardData.name,
            accommodationPrice: `R$ ${lowestPrice.toFixed(2)}`,
            accommodationMeal: desiredMealType,
            accommodationProvider: 'Connect Travel'
          }
        }

        return null
      })
      .filter((data) => data !== null)

    console.log(`Total de cards processados: ${processedData.length}`)
    return processedData
  } catch (error) {
    console.error('Erro ao processar a página:', error)
    return []
  }
}

const executeScraping = async (
  checkInDate,
  checkOutDate,
  filterAdults,
  filterChilds,
  mealType
) => {
  console.log('Iniciando o scraping com fluxo de autenticação...')

  // Configura o diretório para armazenar dados do usuário
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const userDataDir = path.join(__dirname, 'user_data')
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir)
  }

  const browser = await puppeteer.launch({
    headless: true,
    userDataDir
  })

  try {
    // 1. Realiza o login e autenticação (uma única vez)
    const clientCookies = await authenticateUser(browser)

    // 2. Reutiliza a sessão para novas operações
    const page = await loadSession(browser, clientCookies)

    // 3. Executa operações na página autenticada
    console.log('Acessando a página principal usando a sessão existente...')
    await page.goto(process.env.CONNECT_TRAVEL_REDIRECT_URL, {
      waitUntil: 'domcontentloaded'
    })

    console.log('Executando operações pós-autenticação...')

    await page.waitForSelector('li[id="menuform:sm_leftmenu_2"] > a')

    const buttonText = await page.evaluate((sel) => {
      const element = document.querySelector(sel)
      return element ? element.textContent.trim() : null
    }, 'li[id="menuform:sm_leftmenu_2"] > a')

    console.log(
      '[SUCESSO] - Botão Booking encontrado! Texto obtido: ',
      buttonText
    )

    await page.click('#layout-menubar-resize')
    await delay(DEFAULT_DELAY)

    await page.click('.layout-menubar-container li:nth-of-type(3) > a')
    await delay(DEFAULT_DELAY)

    console.log(
      '[SUCESSO] - Botão Booking clicado! Aguardando confirmação de redirecionamento'
    )

    // =========================================================================== INÍCIO LÓGICA IFRAME

    await page.waitForSelector('iframe[name="myiFrame"]', {
      visible: true,
      timeout: 30000
    })
    const frame = await page.frames().find((f) => f.name() === 'myiFrame')
    await frame.waitForSelector('#frmMotorHotel', {
      visible: true,
      timeout: 30000
    })

    console.log('[SUCESSO] - Página de booking acessada')

    // **1. Localizar e digitar no campo de destino**
    const destinationInputSelector =
      '#frmMotorHotel .ui-g input.ui-inputfield:nth-of-type(1)'
    const checkinInputSelector =
      '#frmMotorHotel .ui-g input[placeholder="Check-in"]'
    const checkoutInputSelector =
      '#frmMotorHotel .ui-g input[placeholder="Check-out"]'

    await frame.type(destinationInputSelector, 'Olimpia')
    console.log('Campo localizado. Digitado "Olimpia"...')

    // **2. Aguardar a abertura do modal**
    const modalSelector = '#frmMotorHotel\\:idDestinoHotel_panel' // Selector direto do modal
    console.log('Aguardando o modal abrir...')
    await frame.waitForSelector(modalSelector, { visible: true })
    console.log('Modal encontrado e visível.')

    // await page.screenshot({ path: 'after-click-01.png' })

    // **3. Selecionar o primeiro elemento na lista do modal**
    const firstItemSelector = `${modalSelector} tr.ui-autocomplete-item` // Seleção do primeiro item no modal
    console.log('Localizando o primeiro item na lista...')
    await frame.waitForSelector(firstItemSelector, { visible: true })
    console.log('Primeiro item localizado.')

    // Clique no primeiro item
    console.log('Clicando no primeiro item...')
    await frame.click(firstItemSelector)

    // **4. Aguardar 2 segundos**
    console.log('Aguardando 2 segundos...')
    await delay(DEFAULT_DELAY)
    console.log('Processo concluído!')

    await frame.type(checkinInputSelector, checkInDate)
    await frame.type(checkoutInputSelector, checkOutDate)

    await frame.click('.pnlBotaoPesquisa button[type="submit"]')
    console.log('[SUCESSO] - Formulário de pesquisa enviado!')

    await delay(LONGER_DELAY)
    // await page.screenshot({ path: 'after-click-01.png' })

    await frame.waitForSelector('#pnlTituloResultado', {
      visible: true,
      timeout: 30000
    })

    console.log('[SUCESSO] - Resultados encontrados!')

    const accommodations = await handleFilterPage(page, frame, mealType)

    // =========================================================================== FIM LÓGICA IFRAME

    return {
      filterAdults: filterAdults,
      filterChilds: filterChilds,
      filterDateRange: `${checkInDate} a ${checkOutDate}`,
      filterResults: accommodations
    }
  } catch (error) {
    console.error('Erro no fluxo de scraping:', error)
  } finally {
    await browser.close()
    console.log('Browser fechado.')
  }
}

// ========================================== CONNECT TRAVEL

export const findAccommodationsOnConnectTravel = async (req, res) => {
  const { checkInDate, checkOutDate, days, adultCount, childsAges, mealType } =
    req.query

  try {
    // const response = await executeScraping(
    //   checkInDate,
    //   checkOutDate,
    //   parseInt(adultCount),
    //   childsAges ? childsAges.split(',').length : 0,
    //   mealType
    // )
    const response = await executeScraping(
      '11/12/2024',
      '12/12/2024',
      2,
      0,
      'only_breakfast'
    )
    res.json(response)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}
