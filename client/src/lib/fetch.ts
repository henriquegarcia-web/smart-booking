import axios from 'axios'

export default axios.create({
  baseURL:
    import.meta.env.VITE_SERVER_BASE_URL || 'https://vmtcot-server.vercel.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})
