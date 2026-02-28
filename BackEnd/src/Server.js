const app = require('./App')
const {app:appConfig} = require('./config/env.config');




app.listen(appConfig.port, (req, res)=>{
    console.log('server started on port 3000');
})


