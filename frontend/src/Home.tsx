import {Container, Grid, Typography} from "@mui/material";
import mrx from "./resources/mrx.png"
import {useNavigate} from "react-router-dom";
import {Add, MergeType} from "@mui/icons-material";
import {BigCardButton} from "./components/BigCardButton";

export default function Home() {
    const navigate = useNavigate()
    const itemSx = {
        width: "100%",
        flexGrow: 1
    } as const

    return <Container maxWidth="sm" sx={{height: "100%"}}>
        <Grid container direction="column" spacing={2} sx={{height: "100%"}} alignItems="center" wrap="nowrap">
            <Grid item>
                <img
                    src={mrx}
                    alt=""
                    style={{objectFit: "contain"}}
                    height={150}
                />
            </Grid>
            <Grid item>
                <Typography
                    component="h1"
                    variant="h3"
                    align="center"
                    children="Mr. X Annihilator"
                />
            </Grid>


            <Grid item sx={itemSx}>
                <BigCardButton
                    icon={Add}
                    onClick={() => navigate("/create")}
                    title="Create game"
                />
            </Grid>
            <Grid item sx={itemSx}>
                <BigCardButton
                    icon={MergeType}
                    onClick={() => navigate("/join")}
                    title="Join game"
                />
            </Grid>
        </Grid>

    </Container>
}