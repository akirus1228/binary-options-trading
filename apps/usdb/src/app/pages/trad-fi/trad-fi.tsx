import { Button, Grid, Icon, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';
import LongArrowRight from '../../../assets/icons/long-arrow-right.svg';
import DepositChoice from './deposit-choice/deposit-choice';
import style from './trad-fi.module.scss';
import tradFiGraph from '../../../assets/images/trad-fi-graph.svg';
import creditCards from '../../../assets/icons/credit-cards.svg';
import doughnutChart from '../../../assets/icons/doughnut-chart.svg';
import shield from '../../../assets/icons/shield.svg';
import USDBLogoLight from '../../../assets/images/USDB-logo.svg';
import { RootState } from "../../store";
  
import Faq from './faq/faq';
import Logo from '../../components/logo/logo';
/* eslint-disable-next-line */
export interface TradfiProps {}

export const TradFi = (props: TradfiProps): JSX.Element => {
  return (
    <>
      <Box sx={{
        paddingTop: '300px'
      }}
      className={`${style['hero']} flexCenterCol`}
    >
      <h1 className={style['heroH1']}>Take your investing to the next level</h1>
      <Typography variant="h2">The safest way to earn up to 32.5% on your stables.</Typography>
      <Typography variant="h2">No risk. No surprises.</Typography>
      <Button sx={{marginTop: '55px', px: '3em', py: '1em'}} variant="outlined">
        Get started 
        <img src={LongArrowRight} alt="Arrow to the right" style={{marginLeft: '2em'}}/>
      </Button>
    </Box>
    <Box className={`${style['tradFiBlock']} flexCenterCol`}>
      <Box sx={{height: '10em'}}/>
      <Typography variant="h1">Simple & safe returns</Typography>
      <Typography variant="h2" maxWidth="sm" sx={{textAlign: 'center'}}>USDB offers the safest way to earn up to 20% on your stables. No risk. No surprises.</Typography>
      <Box className={`${style['graphContainer']} ${style['lightBG']}`} sx={{my: '2em'}}>
        <img src={tradFiGraph} alt="Graph showing APR for various investments" />
      </Box>
      <Grid container spacing={2} maxWidth="md">
        <Grid item xs={12} md={4}>
          <Box className={`${style['infoIcon']} ${style['lightBG']}`}>
            <img src={creditCards} alt="Credit Cards" />
            <span>no investment fee</span>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={`${style['infoIcon']} ${style['lightBG']}`}>
            <img src={doughnutChart} alt="Doughnut chart with a quarter filled" />
            <span>no management fee</span>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={`${style['infoIcon']} ${style['lightBG']}`}>
            <img src={shield} alt="Shield with lock" />
            <span>no risk of capital loss</span>
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Box className={`${style['tradFiBlock']} flexCenterCol`}>
      <Box sx={{height: '10em'}}/>
      <Typography variant="h1">Get started today</Typography>
      <Typography variant="h2" maxWidth="sm" sx={{textAlign: 'center'}}>Lorem ipsum dolor sit amet, conctetur adipiscing elit. Etiam auctor commodo.</Typography>
    </Box>
    <DepositChoice />
    <Outlet />
    <Faq />
    <Box className={`${style['tradFiBlock']} flexCenterCol`}>
      <Box sx={{height: '10em'}}/>
      <Typography variant="h1">Simple & safe returns</Typography>
      <Typography variant="h2" maxWidth="sm" sx={{textAlign: 'center'}}>USDB offers the safest way to earn up to 20% on your stables. No risk. No surprises.</Typography>
    </Box>
    <Box className={`${style['tradFiBlock']} flexCenterCol`}>
      <Logo />
    </Box>
  </>
  );
}

export default TradFi;
