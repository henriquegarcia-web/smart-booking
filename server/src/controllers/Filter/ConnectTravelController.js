import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Função para aguardar redirecionamentos e elemento específico
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

// Função para capturar input do terminal
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

// Autenticação com login e validação de código
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
    await delay(2000)
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

    const currentUrl = page.url()
    if (currentUrl === process.env.CONNECT_TRAVEL_LOGIN_URL) {
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
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

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
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
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

// Carrega cookies salvos em uma nova página
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

const executeScraping = async () => {
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

    // ===========================================================================

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
    await delay(2000)

    await page.click('.layout-menubar-container li:nth-of-type(3) > a')
    await delay(2000)

    console.log(
      '[SUCESSO] - Botão Booking clicado! Aguardando confirmação de redirecionamento'
    )

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
    await delay(2000)
    console.log('Processo concluído!')

    await frame.type(checkinInputSelector, '10/12/2024')
    await frame.type(checkoutInputSelector, '12/12/2024')

    await frame.click('.pnlBotaoPesquisa button[type="submit"]')
    console.log('[SUCESSO] - Formulário de pesquisa enviado!')

    await delay(10000)

    await frame.waitForSelector('#pnlTituloResultado', {
      visible: true,
      timeout: 30000
    })

    console.log('[SUCESSO] - Resultados encontrados!')

    const resultsHeaderSelector = '#pnlTituloResultado .FontBold'

    const elementText = await frame.evaluate((selector) => {
      const element = document.querySelector(selector)
      return element ? element.innerText : null
    }, resultsHeaderSelector)

    console.log('[SUCESSO] - Texto obtido: ', elementText)

    // ===========================================================================

    // await delay(2000)
    // console.log('Datas preenchidas!')

    // await page.screenshot({ path: 'after-click-03.png' })
  } catch (error) {
    console.error('Erro no fluxo de scraping:', error)
  } finally {
    await browser.close()
    console.log('Browser fechado.')
  }
}

// ========================================== CONNECT TRAVEL

export const findAccommodationsOnConnectTravel = async (req, res) => {
  try {
    executeScraping()
    res.json(true)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}
