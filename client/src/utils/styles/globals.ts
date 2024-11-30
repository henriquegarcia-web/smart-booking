import styled, { createGlobalStyle } from 'styled-components'
import { Form } from 'antd'

export const responsiveDesktop = '1000px'
export const responsiveTablet = '760px'
export const responsiveMobile = '500px'

export const Sizes = {
  dashboard: {
    header: '60px',
    menu: '280px',
    viewMax: '1000px'
  }
}

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 14px;

    @media screen and (min-width: 1024px) {
      font-size: 16px;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    font-family: 'Roboto', sans-serif;
    /* font-family: "Montserrat", sans-serif; */
    /* font-family: "Baloo Paaji 2", sans-serif; */
    /* font-family: "Barlow", sans-serif; */
    /* font-family: "Open Sans", sans-serif; */
    text-decoration: none;
    user-select: none;

    -webkit-tap-highlight-color: transparent !important;
  }

  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 10px;
    z-index: 1000;
  }

  ::-webkit-scrollbar-track {
    background:  rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.4);
  }
`

export default GlobalStyle

export const Screen = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  min-height: 100vh;
`

export const AuthForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 10px;
  width: 100%;

  .ant-form-item {
    width: 100%;
    margin-bottom: 0px;

    .ant-form-item-label {
      padding-bottom: 5px;

      label {
        font-size: 12px;
      }
    }

    .ant-input {
      font-size: 14px;
    }

    .ant-form-item-explain-error {
      margin-top: 5px;

      font-size: 13px;
    }
  }

  button[type='submit'] {
    margin-top: 10px;
  }
`
