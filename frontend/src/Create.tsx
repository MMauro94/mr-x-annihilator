import {Card, CardContent, Container, Grid, Typography} from "@mui/material";
import {useState} from "react";
import {Board, Player} from "./types/apis";
import BoardAutocomplete from "./components/BoardAutocomplete";
import PlayersForm from "./components/PlayersForm";
import {BigCardButton} from "./components/BigCardButton";
import {PlayArrow} from "@mui/icons-material";
import {useAsync} from "react-async";
import {useSnackbar} from "notistack";


export default function Create() {
    const [board, setBoard] = useState<Board | null>(null)
    const [players, setPlayers] = useState<Partial<Player>  []>([])
    const {enqueueSnackbar} = useSnackbar()

    const create = useAsync({
        deferFn: async () => {
            const res = await fetch("/api/game", {
                method: "POST",
                body: JSON.stringify({
                    board: board!.id,
                    players
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!res.ok) {
                throw new Error(res.statusText)
            }
        },
        onReject: (err) => {
            enqueueSnackbar(`Error createing game: ${err.message}`, {
                variant: "error"
            })
        }
    })

    const ok = board !== null && players.length > 1 && players.every(p => p.name && p.name.length > 0 && p.color && p.initialNode)

    return <Container maxWidth="sm" sx={{pb: 2}}>
        <Grid container direction="column" spacing={2}>

            <Grid item>
                <Typography variant="h2" component="h1">Create game</Typography>
            </Grid>


            <Grid item>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{mb: 2}}>
                            1. Select board
                        </Typography>
                        <BoardAutocomplete board={board} setBoard={setBoard}/>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{mb: 2}}>
                            2. Add Players
                        </Typography>
                        <PlayersForm players={players} setPlayers={setPlayers}/>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item>
                <BigCardButton
                    onClick={() => create.run()}
                    loading={create.isLoading}
                    // disabled={!ok || create.isPending}
                    icon={PlayArrow}
                    title="Start game"
                />
            </Grid>
        </Grid>
    </Container>
}