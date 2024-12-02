import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { fetchUserProfile, fetchUsersProfiles } from '@/services/user'
import { IUser } from '@/types/globals'

const useUserProfile = (
  options?: Partial<UseQueryOptions<IUser, Error, IUser, QueryKey>>
) => {
  return useQuery<IUser, Error, IUser, QueryKey>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    ...options
  })
}

const useAllUsersProfile = (
  options?: Partial<UseQueryOptions<IUser[], Error, IUser[], QueryKey>>
) => {
  return useQuery<IUser[], Error, IUser[], QueryKey>({
    queryKey: ['usersProfiles'],
    queryFn: fetchUsersProfiles,
    ...options
  })
}

export { useUserProfile, useAllUsersProfile }
