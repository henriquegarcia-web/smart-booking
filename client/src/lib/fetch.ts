import axios from 'axios'

export default axios.create({
  baseURL:
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/` ||
    'https://www.cotacoes.vilamiraturismo.com.br/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})
