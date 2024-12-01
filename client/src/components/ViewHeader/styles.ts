import styled from 'styled-components'
import { Sizes } from '@/utils/styles/globals'

export const ViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: ${Sizes.spacing};
`

export const ViewHeaderLabels = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;

  h1 {
    font-size: 18px;
    line-height: 18px;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    line-height: 14px;
    font-weight: 300;
  }
`

export const ViewHeaderContent = styled.div`
  display: flex;
`
