

export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3000,
    default_limit: +process.env.DEFAULT_LIMIT || 3,
    JWT_SECRET: process.env.JWT_SECRET || 'Est3EsM1T0k3nSecret123'
})