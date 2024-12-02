import styled from 'styled-components'
import { Sizes } from '@/utils/styles/globals'

export const UsersAccessView = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${Sizes.spacing};
  width: 100%;

  .blocked-row {
    background-color: rgb(235, 235, 235);

    td {
      background-color: rgb(235, 235, 235) !important;
    }
  }
`

export const TableActions = styled.div`
  display: flex;
  column-gap: 10px;
`

// ===================================== MODAL CREATE ACCESS

export const CreateAccessModalTitle = styled.h2`
  font-size: 18px;
  line-height: 18px;
  font-weight: 600;
`
