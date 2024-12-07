import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import readline from 'readline'

dotenv.config()

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
  // await page.waitForSelector(selector, { visible: true, timeout })
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
    // 1. Acessa a página de login
    console.log(
      `Acessando URL de login: ${process.env.CONNECT_TRAVEL_LOGIN_URL}`
    )
    await page.goto(process.env.CONNECT_TRAVEL_LOGIN_URL, {
      waitUntil: 'domcontentloaded'
    })

    // 2. Preenche o formulário de login e clica em entrar
    console.log('Preenchendo formulário de login...')
    await page.type('#j_idt23', process.env.CONNECT_TRAVEL_USER, { delay: 50 })
    await page.type('#j_idt25', process.env.CONNECT_TRAVEL_PASSWORD, {
      delay: 50
    })
    await page.click('#j_idt27')

    // 3. Aguarda redirecionamento para página de validação do código
    console.log('Aguardando página de validação de código...')
    // await page.waitForSelector('#validation-code-input', {
    //   visible: true,
    //   timeout: 30000
    // })
    await page.waitForFunction(
      (url) => window.location.href === url,
      30000,
      process.env.CONNECT_TRAVEL_OTP_URL
    )

    // 4. Solicita o código ao cliente (input via terminal ou API)
    const validationCode = await getUserInput(
      'Digite o código de validação recebido por e-mail: '
    )

    // 5. Insere o código e envia
    console.log('Inserindo código de validação...')
    await page.type('input[type="text"]', validationCode, { delay: 50 })
    await page.click('button[type="submit"]')

    // 6. Aguarda redirecionamento para a página principal (home)
    console.log('Validando código e aguardando redirecionamento...')
    // await page.waitForSelector('.banner-principal', {
    //   visible: true,
    //   timeout: 30000
    // })
    await page.waitForFunction(
      (url) => window.location.href === url,
      30000,
      process.env.CONNECT_TRAVEL_REDIRECT_URL
    )

    console.log('Autenticação finalizada com sucesso!')

    // 7. Retorna a sessão autenticada
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
  const browser = await puppeteer.launch({ headless: true })

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
    console.log('[SUCESSO] - Botão Booking encontrado!')

    // Executa a função JavaScript no contexto da página
    await page.evaluate(() => {
      const menuItem = document.querySelector(
        'li[id="menuform:sm_leftmenu_2"] > a'
      )

      if (menuItem) {
        PF('widget_menuform_sm_leftmenu').toggleSubMenu(menuItem)
        montaMenu.addTab('Booking', '/infotravel/admin/venda/venda.xhtml')
      } else {
        console.error('Menu item not found')
      }
    })

    // await page.click('#menuform ul li:nth-child(3) a')
    // iframe[name="myiFrame"]
    await page.waitForSelector('#frmMotorHotel', {
      visible: true,
      timeout: 30000
    })
    console.log('[SUCESSO] - Página de booking acessada')

    // **1. Localizar e digitar no campo de destino**
    const destinationInputSelector = '#frmMotorHotel .ui-g input:nth-of-type(1)'
    const checkinInputSelector = '#frmMotorHotel .ui-g input:nth-of-type(2)'
    const checkoutInputSelector = '#frmMotorHotel .ui-g input:nth-of-type(3)'

    // console.log('Localizando o campo de input...');
    // await page.waitForSelector(destinationInputSelector, { visible: true });
    await page.type(destinationInputSelector, 'Olimpia')
    console.log('Campo localizado. Digitado "Olimpia"...')

    // **2. Aguardar a abertura do modal**
    const modalSelector = '#frmMotorHotel\\:idDestinoHotel_panel' // Selector direto do modal
    console.log('Aguardando o modal abrir...')
    await page.waitForSelector(modalSelector, { visible: true })
    console.log('Modal encontrado e visível.')

    // **3. Selecionar o primeiro elemento na lista do modal**
    const firstItemSelector = `${modalSelector} tr.ui-autocomplete-item` // Seleção do primeiro item no modal
    console.log('Localizando o primeiro item na lista...')
    await page.waitForSelector(firstItemSelector, { visible: true })
    console.log('Primeiro item localizado.')

    // Clique no primeiro item
    console.log('Clicando no primeiro item...')
    await page.click(firstItemSelector)

    // **4. Aguardar 2 segundos**
    console.log('Aguardando 2 segundos...')
    await page.waitForTimeout(2000)
    console.log('Processo concluído!')

    await page.type(checkinInputSelector, '08/12/2024')
    await page.type(checkoutInputSelector, '12/12/2024')

    await page.click('button[type="submit"]')
    console.log('[SUCESSO] - Formulário de pesquisa enviado!')

    await page.waitForSelector('#pnlTituloResultado', {
      visible: true,
      timeout: 30000
    })

    console.log('[SUCESSO] - Resultados encontrados!')

    const resultsHeaderSelector = '#pnlTituloResultado .FontBold'

    const elementText = await page.evaluate((selector) => {
      const element = document.querySelector(selector)
      return element ? element.innerText : null
    }, resultsHeaderSelector)

    console.log('[SUCESSO] - Texto obtido: ', elementText)

    // ===========================================================================
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
    // const token = await authenticateConnectTravel()
    // const data = await makeConnectTravelRequest(token)
    executeScraping()
    res.json(true)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter disponibilidade de hotéis',
      details: error.message
    })
  }
}
