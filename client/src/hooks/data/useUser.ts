import { useQuery } from '@tanstack/react-query'
import { fetchUserProfile } from '@/services/user'

const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile
  })
}

export { useUserProfile }
