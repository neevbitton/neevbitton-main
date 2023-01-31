import express, { Application } from 'express'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import Controller from '@/utils/interfaces/controller.interface'
import ErrorMiddleware from '@/middleware/error.middleware'
import helmet from 'helmet'
import logger from '@/utils/logger'

class App {
    public express: Application
    public port: number

    constructor(controllers: Controller[], port: number) {
        this.express = express()
        this.port = port
        this.initializeMiddleware()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
    }

    private initializeMiddleware(): void {
        this.express.use(helmet())
        this.express.use(cors())
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router)
        })
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            logger.info(`App Runing On Port ${this.port}`)
        })
    }

}


export default App
