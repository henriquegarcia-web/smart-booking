import styled from 'styled-components'
import { Form } from 'antd'
import { Sizes } from '@/utils/styles/globals'

export const SearchAccommodationForm = styled(Form)`
  display: flex;
  flex-direction: column;
  row-gap: 25px;
  padding: 10px 0;

  .ant-picker-range {
    width: 100%;
  }

  .ant-form-item {
    .ant-form-item-label {
      label {
        font-size: 13px;
      }
    }
  }
`

export const MainFormWrapper = styled.div`
  display: flex;
  width: 100%;
  column-gap: 10px;
`

export const FormInputDateRangeWrapper = styled.div`
  display: flex;
  width: calc((100% / 3) * 2);
  column-gap: 10px;
`

export const FormInputMealTypeWrapper = styled.div`
  display: flex;
  width: calc((100% / 3) * 1);
  column-gap: 10px;
`

export const ApartmentsFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 10px;
`

export const ApartmentSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${Sizes.spacing};
  border-radius: 6px;
`

export const ApartmentSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  h2 {
    font-size: 16px;
    line-height: 16px;
    font-weight: 500;
  }
`

export const ApartmentSectionWrapper = styled.div`
  display: flex;
  column-gap: 10px;
  width: 100%;
  margin-top: 20px;
`

export const FormInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  width: calc(100% / 3);

  h3 {
    margin-bottom: 4px;
    font-size: 13px;
    line-height: 13px;
    font-weight: 400;
  }
`

export const SearchAccommodationFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 10px;
  width: 100%;
`
