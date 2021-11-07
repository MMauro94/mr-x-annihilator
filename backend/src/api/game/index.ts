import post from "./post";
import {APP} from "../../utils/app";
import join from "./join";

export default APP.router(r => {
    post(r)
    join(r)
})
