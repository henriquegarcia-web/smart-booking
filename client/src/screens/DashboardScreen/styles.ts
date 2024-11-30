import styled from 'styled-components'
import { Screen, Sizes } from '@/utils/styles/globals'

export const DashboardScreen = styled(Screen)`
  display: flex;
  flex-direction: row;
  height: 100vh;
`

export const DashboardMenu = styled.div<{ opened: number }>`
  display: flex;
  flex-direction: column;
  width: ${({ opened }) =>
    opened ? Sizes.dashboard.menuOpened : Sizes.dashboard.menu};
  transition: 0.3s;
`

export const DashboardMenuLogo = styled.div<{ opened: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${Sizes.dashboard.header};
  padding: 0 ${Sizes.spacing};
`

export const DashboardMenuWrapper = styled.div<{ opened: number }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 4px;
  width: 100%;
  padding: ${Sizes.spacing};

  button {
    svg {
      font-size: 16px;
    }

    span {
      font-size: 14px;
    }
  }
`

export const MenusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const DashboardContent = styled.div<{ opened: number }>`
  display: flex;
  flex-direction: column;
  width: ${({ opened }) =>
    opened
      ? `calc(100% - ${Sizes.dashboard.menuOpened})`
      : `calc(100% - ${Sizes.dashboard.menu})`};
  height: 100%;
`

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${Sizes.dashboard.header};
  padding: 0 20px;
`

export const DashboardNavigation = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
`

export const DashboardView = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100% - ${Sizes.dashboard.header});
  padding: 20px;
`

export const DashboardViewWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: ${Sizes.dashboard.viewMax};
  height: fit-content;
  padding: 20px;
`

// export const OtherDashboardScreen = styled.div`
//   display: flex;
// `
