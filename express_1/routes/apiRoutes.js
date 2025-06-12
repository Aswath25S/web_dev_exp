import express from 'express'
import {getAllData} from '../controllers/getAllData.js'
import {getDataPathParams} from '../controllers/getAllDataPathParams.js'

export const apiRouter = express.Router();

apiRouter.get('/', getAllData)
apiRouter.get('/:field/:term', getDataPathParams)