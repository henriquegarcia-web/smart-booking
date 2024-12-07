import styled from 'styled-components'
import { Sizes } from '@/utils/styles/globals'
import { Form } from 'antd'

export const SettingsView = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${Sizes.spacing};
  width: 100%;
`

export const CTAuthentication = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border-radius: 8px;
`

export const CTAuthenticationInfos = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`

export const CTAuthenticationStatus = styled.div`
  display: flex;
  align-items: center;
  column-gap: 4px;

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;

  b {
    display: flex;
    align-items: center;
    column-gap: 4px;

    font-weight: 600;

    svg {
      font-size: 18px;
    }
  }
`

export const CTAuthenticationForm = styled(Form)`
  display: flex;
  align-items: center;
  column-gap: 10px;
`
