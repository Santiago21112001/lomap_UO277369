import { Box } from "@mui/material";

function AlertMessage(props: { msg: string }): JSX.Element {
    return (<Box sx={{
        color: 'red'
    }} component="h4">{props.msg}</Box>)
}

export default AlertMessage;