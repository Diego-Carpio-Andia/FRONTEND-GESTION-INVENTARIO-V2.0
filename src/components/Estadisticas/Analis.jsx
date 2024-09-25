import { Grid, Card, Stack, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { ArrowUpward, ArrowDownward, ShoppingBasket, ShoppingCart } from '@mui/icons-material'; // Importar los iconos necesarios

export default function Analis({ color = 'primary', title, count, isLoss, extra = [], type }) {
    return (
        <Card sx={{ p: 2.25, border: '2px solid #e6ebf1', boxShadow: '2px 2px 4px #e6ebf1' }}>
            <Stack spacing={0.5}>
                <Typography variant="h6" sx={{color:"#5a1acb"}}>
                    {title}
                </Typography>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography variant="h4" color="inherit">
                            {count}
                        </Typography>
                    </Grid>
                   
                        <Grid item>
                            <Chip
                                variant="combined"
                                color={color}
                                icon={type === 'sales' ? <ArrowUpward /> : <ShoppingCart />}
                                
                                sx={{ ml: 1.25, pl: 1 }}
                                size="small"
                            />
                        </Grid>
                    
                </Grid>
            </Stack>
            <Box sx={{ pt: 2.25 }}>
                <Typography variant="caption" color="text.secondary">
                    {extra[0]}{' '}
                    <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
                        {extra[1]}
                    </Typography>{' '}
                    {extra[2]}
                </Typography>
            </Box>
        </Card>
    );
}
