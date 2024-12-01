import styled from 'styled-components'
import { Form } from 'antd'

export const SearchAccommodationForm = styled(Form)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  column-gap: 10px;
  row-gap: 14px;
  padding: 10px 0;

  .ant-picker-range {
    width: 340px;
  }

  .ant-form-item {
    .ant-form-item-label {
      label {
        font-size: 13px;
      }
    }
  }
`

export const SearchAccommodationFormFooter = styled.div`
  display: flex;
  column-gap: 10px;
`
