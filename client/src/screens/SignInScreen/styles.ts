import styled from 'styled-components'
import { AuthForm, Screen } from '@/utils/styles/globals'

export const SignInScreen = styled(Screen)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

export const SignInForm = styled(AuthForm)`
  display: flex;
`

export const SignInFormFirstAccess = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 8px;
  width: 100%;

  p {
    padding-top: 1px;

    font-size: 13px;
    line-height: 13px;
    font-weight: 300;
  }
`
