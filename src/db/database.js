import { Sequelize } from 'sequelize'

import config from './config.js'

const sequelize = new Sequelize(config.development)

try {
    await sequelize.authenticate()
    console.log('Conexão estabelecida com sucesso.')
} catch(error) {
    console.log('Não foi possível conectar ao banco de dados: ', error.message)
}

export default sequelize