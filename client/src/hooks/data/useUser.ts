import { useQuery } from '@tanstack/react-query'
import { fetchUserProfile, fetchUsersProfiles } from '@/services/user'

const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile
  })
}

const useAllUsersProfile = () => {
  return useQuery({
    queryKey: ['usersProfiles'],
    queryFn: fetchUsersProfiles
  })
}

export { useUserProfile, useAllUsersProfile }
