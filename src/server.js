const app = require('./app.js')

app.listen(process.env.PORT || 3333, () =>
  console.log(`server runing on port ${process.env.PORT || 3333}`))
