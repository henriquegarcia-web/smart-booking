import { Router } from 'express'
import { findAccommodationsOnTravelXs } from '../controllers/Filter/TravelXsController.js'
import { findAccommodationsOnConnectTravel } from '../controllers/Filter/ConnectTravelController.js'
import { findAccommodations } from '../controllers/FilterController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/accommodations/travel-xs', findAccommodationsOnTravelXs)
router.get('/accommodations/connect-travel', findAccommodationsOnConnectTravel)
router.get('/accommodations', findAccommodations)

export default router

/**
 
  [ SEMI-OK ] - Implementar no puppeteer um recurso que identifica que ja esta
                logado (ou tenta acessar direto o main de inicio!!!) para
                encurtar tempo

  [  ] - Implementar funções assincronas de execução, mas retorna
    quando todas estiverem prontas
  - Colocar uma awaitforselector de forma otimizada no código e
    ver se resolve

    pedir para IA otimizar código

    remover imagens

    criar validação para quando uma das respoonse vem zerada

    modal de validação do código nao pdoe ser fechavel

 */
