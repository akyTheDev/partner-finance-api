import app from './app'
import { config } from './common/config'

app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}`)
})
