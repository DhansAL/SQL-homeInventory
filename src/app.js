import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import Express from "express"
import * as dotenv from 'dotenv'

// initialization

const app = Express()

// middlewares
dotenv.config()
app.use(morgan("tiny"))
app.use(compression())
app.use(helmet())


app.get("/", (req, res) => {
    res.status(200).json({
        message: "inventory home 👋🏽"
    })
})
export default app