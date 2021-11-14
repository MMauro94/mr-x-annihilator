import {Player} from "../types/apis";
import {Autocomplete, Box, BoxProps, Button, Grid, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Add, ArrowDownward, ArrowUpward, Delete} from "@mui/icons-material";
import {green, indigo, orange, red, yellow} from "@mui/material/colors";

export default function PlayersForm({players, setPlayers}: {
    players: Partial<Player>[]
    setPlayers: (players: Partial<Player>[]) => void
}) {
    return <Grid container direction="column" spacing={2}>
        <Grid item>
            <Button
                variant="outlined"
                startIcon={<Add/>}
                onClick={() => setPlayers([...players, {}])}
                children="Add player"
            />
        </Grid>
        {players.map((player, i) => {
            return <Grid item key={i}>
                <PlayerRow
                    index={i}
                    count={players.length}
                    player={player}
                    setPlayer={p => {
                        const newPlayers = [...players]
                        newPlayers.splice(i, 1, p)
                        setPlayers(newPlayers)
                    }}
                    deletePlayer={() => {
                        const newPlayers = [...players]
                        newPlayers.splice(i, 1)
                        setPlayers(newPlayers)
                    }}
                    moveUp={() => {
                        const newPlayers = [...players]
                        newPlayers.splice(i, 1)
                        newPlayers.splice(i - 1, 0, player)
                        setPlayers(newPlayers)
                    }}
                    moveDown={() => {
                        const newPlayers = [...players]
                        newPlayers.splice(i, 1)
                        newPlayers.splice(i + 1, 0, player)
                        setPlayers(newPlayers)
                    }}
                />
            </Grid>
        })}
    </Grid>
}

type NamedColor = {
    name: string
    color: string
}
const COLORS: NamedColor[] = [
    {
        name: "Red",
        color: red[700]
    },
    {
        name: "Green",
        color: green[600]
    },
    {
        name: "Blue",
        color: indigo[500]
    },
    {
        name: "Yellow",
        color: yellow[600]
    },
    {
        name: "Orange",
        color: orange[600]
    },
]

function PlayerRow({index, count, player, setPlayer, deletePlayer, moveUp, moveDown}: {
    index: number
    count: number
    player: Partial<Player>
    setPlayer: (player: Partial<Player>) => void
    deletePlayer: () => void
    moveUp: () => void
    moveDown: () => void
}) {
    const color = COLORS.find(c => c.color === player.color) ?? null

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <Grid container wrap="nowrap">
                <Grid item style={{flexGrow: 1}}>
                    <Typography variant="h6" component="h3">Player {index + 1}</Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={moveUp} disabled={index === 0}>
                        <ArrowUpward/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton onClick={moveDown} disabled={index === count - 1}>
                        <ArrowDownward/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton onClick={deletePlayer}>
                        <Delete/>
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>

        <Grid item xs={12}>
            <TextField
                fullWidth
                label="Nome giocatore"
                value={player.name ?? ""}
                onChange={e => setPlayer({...player, name: e.target.value})}
            />
        </Grid>

        <Grid item xs={6}>
            <Autocomplete
                fullWidth
                options={COLORS}
                getOptionLabel={c => c.name}
                value={color}
                onChange={(e, value) => setPlayer({...player, color: value?.color})}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        label="Color"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: <InputAdornment position="start">
                                {color && <ColorCircle color={color.color} sx={{ml: 1, mr: -0.5}}/>}
                            </InputAdornment>
                        }}
                    />
                }}
                renderOption={(props, option) => {
                    return <Box component="li" {...props}>
                        <ColorCircle color={option.color} sx={{mr: 1}}/>
                        {option.name}
                    </Box>
                }}
            />
        </Grid>

        <Grid item xs={6}>
            <TextField
                fullWidth
                label="Posizione iniziale"
                value={player.initialNode}
                type="number"
                inputProps={{min: 1}}
                onChange={e => setPlayer({...player, initialNode: parseInt(e.target.value)})}
            />
        </Grid>
    </Grid>
}

function ColorCircle({color, sx}: { color: string, sx?: BoxProps["sx"] }) {
    return <Box sx={{
        borderRadius: "50%",
        width: 20,
        height: 20,
        backgroundColor: color,
        ...sx
    }}/>
}