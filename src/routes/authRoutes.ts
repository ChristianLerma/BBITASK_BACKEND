import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputError } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Los Passwords no son iguales')
            }
            return true
        }),
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputError,
    AuthController.createAcount
)

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputError,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email')
        .isEmail().withMessage('Email no valido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputError,
    AuthController.login
)

router.post('/request-code', 
    body('email')
        .isEmail().withMessage('Email no valido'),        
    handleInputError,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password', 
    body('email')
        .isEmail().withMessage('Email no valido'),        
    handleInputError,
    AuthController.forgotPassword
)

router.post('/validate-token', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputError,
    AuthController.validateToken
)

router.post('/update-password/:token', 
    param('token')
        .isNumeric().withMessage('TOKEN no válido'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Los Passwords no son iguales')
            }
            return true
        }),
    handleInputError,
    AuthController.updatePasswordWithToken
)

router.get('/user', 
    authenticate,
    AuthController.user
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('El password no pude ir vacio'),    
    handleInputError,
    AuthController.checkPassword
)

export default router
