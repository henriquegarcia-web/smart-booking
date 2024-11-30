import styled from 'styled-components'

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  padding: 30px 25px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
`

export const AuthHeader = styled.div`
  display: flex;

  h2 {
    font-size: 30px;
    line-height: 30px;
    font-weight: 500;
  }
`

export const AuthContent = styled.div`
  display: flex;
`

export const AuthFooter = styled.div`
  display: flex;
  justify-content: center;

  p {
    font-size: 13px;
    line-height: 13px;
    font-weight: 300;
    text-align: center;

    a {
      font-weight: 500;
    }
  }
`
