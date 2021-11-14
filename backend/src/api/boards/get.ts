import {BOARDS} from "../../datastruct/boards";
import {APP} from "../../utils/app";

export default APP.page(r => {
    r.get("/", (req, res) => {
        res.send(Object.entries(BOARDS).map(([id, board]) => {
            return {
                id: id,
                name: board.name
            }
        }))
    })
})
