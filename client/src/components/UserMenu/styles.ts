import styled from 'styled-components'

export const UserMenu = styled.div<{ token: any }>`
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 8px 0;
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
    font-size: 14px;
    line-height: 14px;
  }

  &:hover {
    background-color: ${(props) => props.token.colorBgElevated};
  }
`

export const UserMenuInfos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 4px;

  .ant-tag {
    margin: 0;
    padding: 0 4px;
    border-radius: 4px;

    font-size: 8px;
    font-weight: 500;
    line-height: 14px;
  }
`
