import { Title } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import { Button, Toolbar, Typography } from '@mui/material';

export const JulieAppBar = () => {
    return (
        <AppBar style={{ background: '#000000' }}>
            <Toolbar sx={{ justifyContent: "space-between", marginX: 40 }}>
                <Typography>JULIE SYSTEM</Typography>
                <Button>Button1</Button>
                <Button>Button2</Button>
                <Button>Button3</Button>
            </Toolbar>
        </AppBar>
    )
}