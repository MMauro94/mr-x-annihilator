import {SvgIconComponent} from "@mui/icons-material";
import {ReactNode} from "react";
import {Box, Card, CardActionArea, CircularProgress, Typography} from "@mui/material";

export function BigCardButton({icon: Icon, disabled, loading, title, onClick}: {
    icon: SvgIconComponent
    disabled?: boolean
    loading?: boolean
    title: ReactNode
    onClick: () => void
}) {
    return <Card
        onClick={onClick}
        sx={{
            width: "100%",
            height: "100%",
        }}
    >
        <CardActionArea disabled={disabled} sx={{height: "100%", display: "flex", flexDirection: "column", p: 2}}>
            {!loading && <Icon
                color={disabled ? "disabled" : undefined}
                sx={{fontSize: 100}}
            />}

            {loading && <Box sx={{
                display: "flex",
                alignItems: "center",
                height: 100
            }}>
                <CircularProgress />
            </Box>}
            <Typography
                color={disabled ? "text.disabled" : undefined}
                sx={{mt: 2}}
                variant="button"
                component="span"
                children={title}
            />
        </CardActionArea>
    </Card>
}