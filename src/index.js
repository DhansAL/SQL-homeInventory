import app from "./app.js";


const port = process.env.PORT;
app.listen(port, () => {
    console.log('server active to take requests on port:', port);
})