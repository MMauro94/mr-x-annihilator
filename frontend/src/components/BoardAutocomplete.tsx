import {Autocomplete, TextField} from "@mui/material";
import {Board} from "../types/apis";
import {useFetch} from "react-async";

export default function BoardAutocomplete({board, setBoard}: {
    board: Board | null
    setBoard: (board: Board | null) => void
}) {
    const boards = useFetch<Board[]>("/api/boards", {}, {json: true})

    return <Autocomplete
        fullWidth
        loading={boards.isLoading}
        options={boards.data ?? []}
        getOptionLabel={b => b.name}
        value={board}
        onChange={(e, value) => setBoard(value)}
        renderInput={(params) => {
            return <TextField
                {...params}
                label="Board"
                error={boards.isRejected}
                helperText={boards.isRejected ? boards.error.message : undefined}
            />
        }}
    />
}