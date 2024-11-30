import styled from 'styled-components'
import { Screen, Sizes } from '@/utils/styles/globals'

export const DashboardScreen = styled(Screen)`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${Sizes.dashboard.header};
  padding: 0 20px;
`

export const DashboardLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const DashboardNavigation = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
`

export const DashboardContent = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100% - ${Sizes.dashboard.header});
  padding: 20px;
`

export const DashboardContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: ${Sizes.dashboard.viewMax};
  height: fit-content;
  padding: 20px;
`

// export const OtherDashboardScreen = styled.div`
//   display: flex;
// `
