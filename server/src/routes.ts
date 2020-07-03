import express from 'express'
import {celebrate,Joi} from 'celebrate'

import ItemsController from './controllers/ItemsController'
import PointsController from './controllers/PointsController'

import multer from 'multer'
import multerConfig from './config/multer'

const router = express.Router()
const upload = multer(multerConfig)

router.get('/items',ItemsController.index)


router.post('/points', 
upload.single('image'),
    celebrate({
        body:Joi.object().keys({
            name:Joi.string().required(),
            email:Joi.string().required().email().error(new Error('Email is a required field!')),
            whatsapp:Joi.number().required(),
            latitude:Joi.string().required(),
            longitude:Joi.string().required(),
            city:Joi.string().required(),
            uf:Joi.string().required().max(2),
            items:Joi.string().required()
        })
    },{
        abortEarly:false
    })
,PointsController.create)
router.get('/points',PointsController.index)
router.get('/points/:id',PointsController.show)




export default router

