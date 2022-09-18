import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import Express from "express"
import * as dotenv from 'dotenv'
import { errorHandler, notFound } from "./middlewares/index.js";

// initialization

const app = Express()

// middlewares
dotenv.config()
app.use(morgan("tiny"))
app.use(compression())
app.use(helmet())
app.use(Express.json())


app.get("/", (req, res) => {
    return res.status(200).json({
        message: "inventory home "
    })
})
app.get("/test", (req, res) => {
    return res.status(200).json({
        message: "inventory home test👋🏽"
    })
})

// more middlewares
app.use(notFound)
app.use(errorHandler)


export default app