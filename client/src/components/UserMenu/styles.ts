import styled from 'styled-components'

export const UserMenu = styled.div<{ token: any }>`
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;

  p {
    font-size: 14px;
    line-height: 14px;
    font-weight: 300;

    b {
      font-weight: 500;
    }
  }

  .ant-avatar-string {
    font-size: 12px;
    line-height: 12px;
  }

  &:hover {
    background-color: ${(props) => props.token.colorBgElevated};
  }
`
