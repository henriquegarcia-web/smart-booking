import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

dotenv.config()

const TIMEOUT = 60000
const MAX_RETRIES = 3

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function setupBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(TIMEOUT)
    return { browser, page }
  } catch (error) {
    console.log('Erro ao inicializar o navegador:', error)
    throw new Error('Falha na inicialização do navegador')
  }
}

async function handleLogin(page, user, password, finalRedirectUrl) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await page.goto(process.env.TRAVELXS_URL, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT
      })

      await page.type('#login', user)
      await page.type('#senha1', password)

      await Promise.all([
        page.click('#btn-login'),
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: TIMEOUT })
      ])

      await page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: TIMEOUT
      })

      const currentUrl = page.url()
      if (currentUrl.includes(finalRedirectUrl)) {
        console.log(`Login bem-sucedido. URL final: ${currentUrl}`)
        return { success: true, message: 'Login realizado com sucesso' }
      } else {
        console.log(
          `Tentativa ${attempt}: Redirecionamento final não alcançado. URL atual: ${currentUrl}`
        )
      }
    } catch (error) {
      console.log(
        `Tentativa ${attempt}: Erro durante o processo de login:`,
        error
      )
      if (attempt === MAX_RETRIES) {
        throw new Error('Falha no login após várias tentativas')
      }
      await delay(5000)
    }
  }
  return { success: false, message: 'Falha no login após várias tentativas' }
}

async function handleFormSubmission(
  page,
  checkInDate,
  checkOutDate,
  apartments
) {
  try {
    // Aguarde o carregamento completo da página após o login
    await page.waitForNavigation({
      waitUntil: 'networkidle0',
      timeout: TIMEOUT
    })

    const startDateInput = await page.$(
      '.form-hospedagem input[ng-model="vm.dates.date"]'
    )
    const endDateInput = await page.$(
      '.form-hospedagem input[ng-model="vm.dates.endDate"]'
    )
    const searhButton = await page.$(
      '.form-hospedagem button.btn-client[uib-tooltip="Pesquisar"]'
    )

    // Preencha o formulário
    await startDateInput.type(checkInDate)
    await endDateInput.type(checkOutDate)

    // Envie o formulário
    await Promise.all([
      searhButton.click(),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: TIMEOUT })
    ])

    console.log('Formulário enviado e listagem carregada com sucesso')
    return { success: true, message: 'Busca realizada com sucesso' }
  } catch (error) {
    console.log(
      'Erro durante o preenchimento do formulário ou carregamento da listagem:',
      error
    )
    throw error
  }
}

export const findAccommodations = async (req, res) => {
  const { checkInDate, checkOutDate, apartments } = req.body
  let browser

  try {
    const { browser: newBrowser, page } = await setupBrowser()
    browser = newBrowser

    const loginResponse = await handleLogin(
      page,
      process.env.TRAVELXS_FIRST_USER,
      process.env.TRAVELXS_PASSWORD,
      process.env.TRAVELXS_REDIRECT_URL
    )

    if (!loginResponse.success) res.status(401).json(loginResponse)

    const formSubmissionResponse = await handleFormSubmission(
      page,
      '04/12/2024',
      '06/12/2024',
      apartments
    )
    res.json(formSubmissionResponse)
  } catch (error) {
    console.log('Erro ao fazer scraping:', error)
    res
      .status(500)
      .json({ error: 'Erro ao fazer scraping', details: error.message })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// // ==============================================================================

// // const handleLogin = async (axiosInstance, user, password, finalRedirectUrl) => {
// //   const MAX_REDIRECT_CHECKS = 5
// //   const REDIRECT_CHECK_INTERVAL = 2000 // 2 segundos

// //   for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
// //     try {
// //       console.log(`Tentativa de login ${attempt} iniciada.`)

// //       const loginPageResponse = await axiosInstance.get(
// //         process.env.TRAVELXS_URL
// //       )
// //       console.log(
// //         `Página de login carregada. Status: ${loginPageResponse.status}`
// //       )

// //       const $ = cheerio.load(loginPageResponse.data)
// //       console.log('HTML da página de login carregado no Cheerio.')

// //       const loginData = new URLSearchParams()
// //       loginData.append('login', user)
// //       loginData.append('senha1', password)
// //       console.log('Dados de login preparados:', loginData.toString())

// //       const loginResponse = await axiosInstance.post(
// //         process.env.TRAVELXS_URL,
// //         loginData,
// //         {
// //           headers: {
// //             'Content-Type': 'application/x-www-form-urlencoded'
// //           },
// //           maxRedirects: 0,
// //           validateStatus: (status) => status >= 200 && status < 400
// //         }
// //       )
// //       console.log(`Resposta do login recebida. Status: ${loginResponse.status}`)

// //       // Função para verificar a URL atual
// //       const checkCurrentUrl = async () => {
// //         const response = await axiosInstance.get(finalRedirectUrl)
// //         return response.request.res.responseUrl
// //       }

// //       // Polling para verificar o redirecionamento final
// //       for (let i = 0; i < MAX_REDIRECT_CHECKS; i++) {
// //         await delay(REDIRECT_CHECK_INTERVAL)
// //         const currentUrl = await checkCurrentUrl()
// //         console.log(`Verificação de URL ${i + 1}: ${currentUrl}`)

// //         if (currentUrl.includes(finalRedirectUrl)) {
// //           console.log(`Login bem-sucedido. URL final: ${currentUrl}`)
// //           return { success: true, message: 'Login realizado com sucesso' }
// //         }
// //       }

// //       console.log(
// //         `Tentativa ${attempt}: URL final esperada não alcançada após ${MAX_REDIRECT_CHECKS} verificações.`
// //       )
// //     } catch (error) {
// //       console.log(
// //         `Tentativa ${attempt}: Erro durante o processo de login:`,
// //         error.message
// //       )
// //       console.log(
// //         'Detalhes do erro:',
// //         error.response ? error.response.data : 'Sem dados de resposta'
// //       )

// //       if (attempt === MAX_RETRIES) {
// //         console.log('Número máximo de tentativas atingido. Lançando erro.')
// //         throw new Error('Falha no login após várias tentativas')
// //       }
// //       console.log(`Aguardando ${5000}ms antes da próxima tentativa...`)
// //       await delay(5000)
// //     }
// //   }
// //   console.log('Todas as tentativas de login falharam.')
// //   return { success: false, message: 'Falha no login após várias tentativas' }
// // }

// import axios from 'axios'
// import * as cheerio from 'cheerio'
// import dotenv from 'dotenv'

// dotenv.config()

// const TIMEOUT = 60000
// const MAX_RETRIES = 3

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// const setupAxiosInstance = () => {
//   return axios.create({
//     timeout: TIMEOUT,
//     headers: {
//       'User-Agent':
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//     }
//   })
// }

// const handleLogin = async (axiosInstance, user, password, finalRedirectUrl) => {
//   const MAX_REDIRECT_CHECKS = 5
//   const REDIRECT_CHECK_INTERVAL = 2000

//   for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//     try {
//       console.log(`Tentativa de login ${attempt} iniciada.`)

//       const loginPageResponse = await axiosInstance.get(
//         process.env.TRAVELXS_URL
//       )
//       console.log(
//         `Página de login carregada. Status: ${loginPageResponse.status}`
//       )

//       const loginData = new URLSearchParams()
//       loginData.append('login', user)
//       loginData.append('senha1', password)
//       console.log('Dados de login preparados.')

//       await axiosInstance.post(process.env.TRAVELXS_URL, loginData, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         maxRedirects: 0,
//         validateStatus: (status) => status >= 200 && status < 400
//       })
//       console.log('Requisição de login enviada.')

//       const checkCurrentUrl = async () => {
//         try {
//           const response = await axiosInstance.get(finalRedirectUrl, {
//             maxRedirects: 5,
//             validateStatus: (status) => status >= 200 && status < 400
//           })
//           return response.request.res.responseUrl
//         } catch (error) {
//           console.log('Erro ao verificar URL atual:', error.message)
//           return null
//         }
//       }

//       for (let i = 0; i < MAX_REDIRECT_CHECKS; i++) {
//         await delay(REDIRECT_CHECK_INTERVAL)
//         const currentUrl = await checkCurrentUrl()
//         console.log(`Verificação de URL ${i + 1}: ${currentUrl}`)

//         if (currentUrl && currentUrl.includes(finalRedirectUrl)) {
//           console.log(`Login bem-sucedido. URL final: ${currentUrl}`)
//           return { success: true, message: 'Login realizado com sucesso' }
//         }
//       }

//       console.log(
//         `Tentativa ${attempt}: URL final esperada não alcançada após ${MAX_REDIRECT_CHECKS} verificações.`
//       )
//     } catch (error) {
//       console.log(
//         `Tentativa ${attempt}: Erro durante o processo de login:`,
//         error.message
//       )
//       console.log(
//         'Detalhes do erro:',
//         error.response ? error.response.data : 'Sem dados de resposta'
//       )

//       if (attempt === MAX_RETRIES) {
//         console.log('Número máximo de tentativas atingido. Lançando erro.')
//         throw new Error('Falha no login após várias tentativas')
//       }
//       console.log(`Aguardando ${5000}ms antes da próxima tentativa...`)
//       await delay(5000)
//     }
//   }
//   console.log('Todas as tentativas de login falharam.')
//   return { success: false, message: 'Falha no login após várias tentativas' }
// }

// // const handleFormSubmission = async (
// //   axiosInstance,
// //   checkInDate,
// //   checkOutDate,
// //   apartments
// // ) => {
// //   try {
// //     const formPageResponse = await axiosInstance.get(
// //       process.env.TRAVELXS_REDIRECT_URL
// //     )
// //     const $ = cheerio.load(formPageResponse.data)

// //     const formData = new URLSearchParams()
// //     formData.append('checkInDate', checkInDate)
// //     formData.append('checkOutDate', checkOutDate)

// //     const searchResponse = await axiosInstance.post(
// //       process.env.TRAVELXS_SEARCH_URL,
// //       formData,
// //       {
// //         headers: {
// //           'Content-Type': 'application/x-www-form-urlencoded'
// //         }
// //       }
// //     )

// //     if (searchResponse.status === 200) {
// //       console.log('Formulário enviado e listagem carregada com sucesso')
// //       return { success: true, message: 'Busca realizada com sucesso' }
// //     } else {
// //       throw new Error('Falha ao enviar o formulário de busca')
// //     }
// //   } catch (error) {
// //     console.log(
// //       'Erro durante o preenchimento do formulário ou carregamento da listagem:',
// //       error
// //     )
// //     throw error
// //   }
// // }

// // const handleFormSubmission = async (
// //   axiosInstance,
// //   checkInDate,
// //   checkOutDate,
// //   // apartments
// // ) => {
// //   try {
// //     console.log('Iniciando submissão do formulário...');

// //     const formPageResponse = await axiosInstance.get(
// //       process.env.TRAVELXS_REDIRECT_URL
// //     );
// //     const $ = cheerio.load(formPageResponse.data);

// //     console.log('Página do formulário carregada. Extraindo dados...');

// //     // Encontrar o formulário e extrair os dados
// //     const formData = new URLSearchParams();

// //     // Adicionar as datas usando os seletores fornecidos
// //     const startDateInput = $('.form-hospedagem input[uib-datepicker-popup="dd/MM/yyyy"][ng-model="vm.dates.date"]');
// //     const endDateInput = $('.form-hospedagem input[uib-datepicker-popup="dd/MM/yyyy"][ng-model="vm.dates.endDate"]');
// //     const submitFormButton = $('.form-hospedagem button.btn-client[uib-tooltip="Pesquisar"]');

// //     formData.append('startDate', startDateInput.val() || checkInDate);
// //     formData.append('endDate', endDateInput.val() || checkOutDate);

// //     // Adicionar outros campos necessários
// //     // Nota: Você pode precisar ajustar isso dependendo da estrutura exata do formulário
// //     // formData.append('apartments', apartments);

// //     console.log('Dados do formulário preparados:', formData.toString());

// //     // Encontrar a URL de busca no formulário, se possível
// //     const formAction = $('.form-hospedagem').attr('action');

// //     console.log(`Enviando formulário para: ${formAction}`);

// //     const searchResponse = await axiosInstance.post(
// //       formAction,
// //       formData,
// //       {
// //         headers: {
// //           'Content-Type': 'application/x-www-form-urlencoded',
// //           'X-Requested-With': 'XMLHttpRequest'  // Para simular uma requisição AJAX
// //         }
// //       }
// //     );

// //     if (searchResponse.status === 200) {
// //       console.log('Formulário enviado e listagem carregada com sucesso');

// //       // Verificar se a resposta contém os dados esperados
// //       if (searchResponse.data && searchResponse.data.success) {
// //         return {
// //           success: true,
// //           message: 'Busca realizada com sucesso',
// //           data: searchResponse.data  // Incluir os dados retornados, se houver
// //         };
// //       } else {
// //         console.log('Resposta recebida, mas sem os dados esperados');
// //         return {
// //           success: false,
// //           message: 'Busca realizada, mas sem resultados válidos'
// //         };
// //       }
// //     } else {
// //       throw new Error(`Falha ao enviar o formulário de busca. Status: ${searchResponse.status}`);
// //     }
// //   } catch (error) {
// //     console.log(
// //       'Erro durante o preenchimento do formulário ou carregamento da listagem:',
// //       error
// //     );
// //     throw error;
// //   }
// // };

// // Função auxiliar para extrair URL de uma string ng-click
// // const extractUrlFromNgClick = (ngClickAttr) => {
// //   // Esta é uma implementação simplificada. Você pode precisar ajustá-la
// //   // dependendo do formato exato do atributo ng-click
// //   const match = ngClickAttr.match(/'(.*?)'/)
// //   return match ? match[1] : process.env.TRAVELXS_SEARCH_URL
// // }

// // const handleFormSubmission = async (
// //   axiosInstance,
// //   checkInDate,
// //   checkOutDate,
// //   apartments
// // ) => {
// //   try {
// //     console.log('Iniciando processo de submissão do formulário...')

// //     const formPageResponse = await axiosInstance.get(
// //       process.env.TRAVELXS_REDIRECT_URL
// //     )
// //     const $ = cheerio.load(formPageResponse.data)

// //     console.log('Página do formulário carregada. Extraindo elementos...')

// //     const startDateInput = $(
// //       '.form-hospedagem input[uib-datepicker-popup="dd/MM/yyyy"][ng-model="vm.dates.date"]'
// //     )
// //     const endDateInput = $(
// //       '.form-hospedagem input[uib-datepicker-popup="dd/MM/yyyy"][ng-model="vm.dates.endDate"]'
// //     )
// //     const submitFormButton = $(
// //       '.form-hospedagem button.btn-client[uib-tooltip="Pesquisar"]'
// //     )

// //     console.log(
// //       !startDateInput.length,
// //       !endDateInput.length,
// //       !submitFormButton.length
// //     )

// //     if (
// //       !startDateInput.length ||
// //       !endDateInput.length ||
// //       !submitFormButton.length
// //     ) {
// //       throw new Error('Elementos do formulário não encontrados')
// //     }

// //     console.log('Elementos do formulário encontrados. Preparando dados...')

// //     // Extrair os nomes dos campos e os valores atuais
// //     const startDateName = startDateInput.attr('name') || 'startDate'
// //     const endDateName = endDateInput.attr('name') || 'endDate'
// //     const currentStartDate = startDateInput.val() || checkInDate
// //     const currentEndDate = endDateInput.val() || checkOutDate

// //     // Preparar os dados do formulário
// //     const formData = {
// //       [startDateName]: currentStartDate,
// //       [endDateName]: currentEndDate,
// //       apartments: apartments
// //     }

// //     console.log('Dados do formulário preparados:', formData)

// //     // Simular o clique no botão de pesquisa
// //     console.log('Simulando clique no botão de pesquisa...')

// //     // Extrair a URL de ação do botão ou usar uma URL padrão
// //     const actionUrl = submitFormButton.attr('ng-click')
// //       ? extractUrlFromNgClick(submitFormButton.attr('ng-click'))
// //       : process.env.TRAVELXS_SEARCH_URL

// //     console.log(`URL de ação determinada: ${actionUrl}`)

// //     const searchResponse = await axiosInstance.post(actionUrl, formData, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'X-Requested-With': 'XMLHttpRequest'
// //       }
// //     })

// //     if (searchResponse.status === 200) {
// //       console.log('Requisição enviada com sucesso. Analisando resposta...')

// //       if (searchResponse.data && typeof searchResponse.data === 'object') {
// //         return {
// //           success: true,
// //           message: 'Busca realizada com sucesso',
// //           data: searchResponse.data
// //         }
// //       } else {
// //         console.log('Resposta recebida, mas sem os dados esperados')
// //         return {
// //           success: false,
// //           message: 'Busca realizada, mas sem resultados válidos'
// //         }
// //       }
// //     } else {
// //       throw new Error(`Falha na requisição. Status: ${searchResponse.status}`)
// //     }
// //   } catch (error) {
// //     console.log('Erro durante o processo de submissão:', error)
// //     throw error
// //   }
// // }

// // Função auxiliar para extrair URL de uma string ng-click
// const extractUrlFromNgClick = (ngClickAttr) => {
//   const match = ngClickAttr.match(/'(.*?)'/)
//   return match ? match[1] : process.env.TRAVELXS_SEARCH_URL
// }

// const handleFormSubmission = async (
//   axiosInstance,
//   checkInDate,
//   checkOutDate,
//   apartments
// ) => {
//   try {
//     console.log('Iniciando processo de submissão do formulário...')

//     const formPageResponse = await axiosInstance.get(
//       process.env.TRAVELXS_REDIRECT_URL
//     )
//     console.log(
//       'Página do formulário carregada. Status:',
//       formPageResponse.status
//     )

//     const $ = cheerio.load(formPageResponse.data)
//     console.log('HTML carregado no Cheerio. Buscando elementos...')

//     // Logging para debug
//     console.log('Conteúdo HTML:', $.html())

//     const startDateInput = $(
//       '.form-hospedagem input[uib-datepicker-popup="dd/MM/yyyy"][ng-model="vm.dates.date"]'
//     )
//     const endDateInput = $(
//       '.form-hospedagem input[uib-datepicker-popup="dd/MM/yyyy"][ng-model="vm.dates.endDate"]'
//     )
//     const submitFormButton = $(
//       '.form-hospedagem button.btn-client[uib-tooltip="Pesquisar"]'
//     )

//     console.log('Elementos encontrados:')
//     console.log('startDateInput:', startDateInput.length)
//     console.log('endDateInput:', endDateInput.length)
//     console.log('submitFormButton:', submitFormButton.length)

//     if (
//       !startDateInput.length ||
//       !endDateInput.length ||
//       !submitFormButton.length
//     ) {
//       console.log(
//         'Alguns elementos não foram encontrados. Tentando seletores alternativos...'
//       )

//       // Tente seletores mais genéricos
//       const allInputs = $('input')
//       const allButtons = $('button')

//       console.log('Total de inputs encontrados:', allInputs.length)
//       console.log('Total de botões encontrados:', allButtons.length)

//       allInputs.each((index, element) => {
//         console.log(`Input ${index}:`, $(element).attr('ng-model'))
//       })

//       allButtons.each((index, element) => {
//         console.log(
//           `Botão ${index}:`,
//           $(element).text(),
//           $(element).attr('uib-tooltip')
//         )
//       })

//       throw new Error(
//         'Elementos do formulário não encontrados com os seletores específicos'
//       )
//     }

//     console.log(
//       'Todos os elementos do formulário encontrados. Preparando dados...'
//     )

//     // Resto da função permanece o mesmo...

//     // Preparar os dados do formulário
//     const formData = {
//       [startDateInput.attr('name') || 'startDate']: checkInDate,
//       [endDateInput.attr('name') || 'endDate']: checkOutDate,
//       apartments: apartments
//     }

//     console.log('Dados do formulário preparados:', formData)

//     // Simular o clique no botão de pesquisa
//     const actionUrl = submitFormButton.attr('ng-click')
//       ? extractUrlFromNgClick(submitFormButton.attr('ng-click'))
//       : process.env.TRAVELXS_SEARCH_URL

//     console.log(`URL de ação determinada: ${actionUrl}`)

//     const searchResponse = await axiosInstance.post(actionUrl, formData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest'
//       }
//     })

//     console.log('Resposta recebida. Status:', searchResponse.status)

//     if (searchResponse.status === 200) {
//       console.log('Requisição enviada com sucesso. Analisando resposta...')

//       if (searchResponse.data && typeof searchResponse.data === 'object') {
//         return {
//           success: true,
//           message: 'Busca realizada com sucesso',
//           data: searchResponse.data
//         }
//       } else {
//         console.log('Resposta recebida, mas sem os dados esperados')
//         return {
//           success: false,
//           message: 'Busca realizada, mas sem resultados válidos'
//         }
//       }
//     } else {
//       throw new Error(`Falha na requisição. Status: ${searchResponse.status}`)
//     }
//   } catch (error) {
//     console.log('Erro durante o processo de submissão:', error)
//     throw error
//   }
// }

// export const findAccommodations = async (req, res) => {
//   const { checkInDate, checkOutDate, apartments } = req.body
//   const axiosInstance = setupAxiosInstance()

//   try {
//     const loginResponse = await handleLogin(
//       axiosInstance,
//       process.env.TRAVELXS_FIRST_USER,
//       process.env.TRAVELXS_PASSWORD,
//       process.env.TRAVELXS_REDIRECT_URL
//     )

//     if (!loginResponse.success) {
//       return res.status(401).json(loginResponse)
//     }

//     // res.json(loginResponse)

//     const formSubmissionResponse = await handleFormSubmission(
//       axiosInstance,
//       '06/12/2024',
//       '08/12/2024',
//       apartments
//     )

//     res.json(formSubmissionResponse)
//   } catch (error) {
//     console.log('Erro ao fazer scraping:', error)
//     res
//       .status(500)
//       .json({ error: 'Erro ao fazer scraping', details: error.message })
//   }
// }
