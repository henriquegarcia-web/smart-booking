import { useQuery } from '@tanstack/react-query'
import { fetchTemplate } from '@/services/template'

const useGetTemplate = () => {
  return useQuery({
    queryKey: ['template'],
    queryFn: async () => fetchTemplate()
  })
}

export { useGetTemplate }
