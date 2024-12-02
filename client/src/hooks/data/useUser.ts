import {
  QueryKey,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query'
import {
  fetchUserProfile,
  fetchUsersProfiles,
  deleteUser,
  toggleUserBlock
} from '@/services/user'
import { IUser } from '@/types/globals'
// import { queryClient } from '@/lib/react-query'

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

const useDeleteUser = (): UseMutationResult<any, Error, string, unknown> => {
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      const queryClient = useQueryClient()

      queryClient.invalidateQueries({ queryKey: ['usersProfiles'] })
    }
  })
}

const useToggleUserBlock = (): UseMutationResult<
  any,
  Error,
  { userId: string; blockStatus: boolean },
  unknown
> => {
  return useMutation({
    mutationFn: ({ userId, blockStatus }) =>
      toggleUserBlock(userId, blockStatus),
    onSuccess: () => {
      const queryClient = useQueryClient()

      queryClient.invalidateQueries({ queryKey: ['usersProfiles'] })
    }
  })
}

export { useUserProfile, useAllUsersProfile, useDeleteUser, useToggleUserBlock }
