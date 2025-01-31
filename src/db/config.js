import dotenv from 'dotenv'
dotenv.config()
  
export default {
	development: {
		username: process.env.DB_USER_DEV,
		password: process.env.DB_PASSWORD_DEV,
		database: process.env.DB_NAME_DEV,
		host: process.env.DB_HOST_DEV,
		port: process.env.DB_PORT_DEV,
		dialect: process.env.DB_DIALECT_DEV,
		dialectOptions: {
			decimalNumbers: true, // Força o Sequelize a retornar números
		  },
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT,
		dialectOptions: {
			decimalNumbers: true, // Força o Sequelize a retornar números
		  },
	}
}