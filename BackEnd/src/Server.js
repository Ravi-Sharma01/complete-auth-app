const app = require('./App')
const {app:appConfig} = require('./config/env.config');
const PORT = appConfig.port;
const connectDB = require('./config/db.config')



connectDB();
app.listen(PORT, (req, res)=>{
    console.log('server started on port 3000');
})


