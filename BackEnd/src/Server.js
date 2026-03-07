const app = require('./App')
const {app:appConfig} = require('./config/env.config');
const PORT = appConfig.port;




app.listen(PORT, (req, res)=>{
    console.log('server started on port 3000');
})


