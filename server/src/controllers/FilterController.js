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

// async function handleLogin(page, user, password, redirectUrl) {
//   for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//     try {
//       await page.goto(process.env.TRAVELXS_URL, {
//         waitUntil: 'networkidle0',
//         timeout: TIMEOUT
//       })

//       await page.type('#login', user)
//       await page.type('#senha1', password)

//       await Promise.all([
//         page.click('#btn-login'),
//         page.waitForNavigation({ waitUntil: 'networkidle0', timeout: TIMEOUT })
//       ])

//       const currentUrl = page.url()
//       if (currentUrl.includes(redirectUrl)) {
//         return { success: true, message: 'Login realizado com sucesso' }
//       } else {
//         console.log(`Tentativa ${attempt}: Falha no login ou redirecionamento`)
//       }
//     } catch (error) {
//       console.log(
//         `Tentativa ${attempt}: Erro durante o processo de login:`,
//         error
//       )
//       if (attempt === MAX_RETRIES) {
//         throw new Error('Falha no login após várias tentativas')
//       }
//       await delay(5000)
//     }
//   }
//   return { success: false, message: 'Falha no login após várias tentativas' }
// }

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

export const findAccommodations = async (req, res) => {
  const { checkInDate, checkOutDate, apartments } = req.body
  let browser

  try {
    const { browser: newBrowser, page } = await setupBrowser()
    browser = newBrowser

    const resultado = await handleLogin(
      page,
      process.env.TRAVELXS_FIRST_USER,
      process.env.TRAVELXS_PASSWORD,
      process.env.TRAVELXS_REDIRECT_URL
    )

    res.json(resultado)
  } catch (error) {
    console.log('Erro ao realizar login:', error)
    res
      .status(500)
      .json({ error: 'Erro ao realizar login', details: error.message })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
