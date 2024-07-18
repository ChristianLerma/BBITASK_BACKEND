import { Request, Response } from 'express'
import User from '../models/User'
import { checkPassword, hassPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmails'
import { generateJWT } from '../utils/jwt'

export class AuthController {

    static createAcount = async (req : Request, res : Response) => {
        try {
            const { password, email } = req.body

            //Prevenir emails duplicados
            const userExits = await User.findOne({email})
            if(userExits) {
                const error = new Error('El usuario ya se encuentra registrado en la base de datos')
                return res.status(409).json({error: error.message})    
            }

            //Crea un usuario
            const user = new User(req.body)
            
            // Hash Password
            user.password = await  hassPassword(password)
            
            //Generar token para verificación de la cuenta
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([
                user.save(), 
                token.save()
            ])

            res.send('Cuenta creada, revisa tu email para conformarla')
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static confirmAccount = async (req : Request, res : Response) => {
        try {
            const { token } = req.body
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('Token no válido')
                return res.status(404).json({error: error.message})
            }
            
            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([
                user.save(),
                tokenExist.deleteOne()
            ])

            res.send('Cuenta Confirmada Correctamente')
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static login = async (req : Request, res : Response) => {
        try {
            const { email, password } = req.body
            
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('Usuario no encontrado en la base de datos')
                return res.status(401).json({error: error.message})
            }

            if(!user.confirmed){
                 //Generar token para verificación de la cuenta
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                //Enviar Email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuenta no ha sido confirmada, se ha enviado un email de confirmación')
                return res.status(404).json({error: error.message})
            }
            
            //Verificar Password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Password incorrecto')
                return res.status(401).json({error: error.message})
            }

            const token = generateJWT({id: user.id})

            res.send(token)
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static requestConfirmationCode = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            //Buscar si el usuario existe
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('El usuario no está registrado')
                return res.status(404).json({error: error.message})    
            }

            if(user.confirmed){
                const error = new Error('El usuario ya está confirmado')
                return res.status(403).json({error: error.message})    
            }

            //Generar token para verificación de la cuenta
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([
                user.save(), 
                token.save()
            ])

            res.send('Se ha enviado un nuevo TOKEN a su correo electrónico')
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static forgotPassword = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            //Buscar si el usuario existe
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('El usuario no está registrado')
                return res.status(404).json({error: error.message})    
            }

            //Generar token para verificación de la cuenta
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar Email
            AuthEmail.sendPasswordResetTokenEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Verifica tu correo electrónico y sigue las instrucciones')
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static validateToken = async (req : Request, res : Response) => {
        try {
            const { token } = req.body
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('Token no válido')
                return res.status(404).json({error: error.message})
            }
            
            res.send('TOKEN válido, define tu nuevo password')
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static updatePasswordWithToken = async (req : Request, res : Response) => {
        try {
            const { token } = req.params
            const { password } = req.body
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('TOKEN no válido')
                return res.status(404).json({error: error.message})
            }
            
            const user = await User.findById(tokenExist.user)
            user.password = await hassPassword(password)

            await Promise.allSettled([
                user.save(),
                tokenExist.deleteOne()
            ])

            res.send('El password se modificó correctamente')
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static user = async (req : Request, res : Response) => {
        return res.json(req.user)
    }

    static checkPassword = async (req : Request, res : Response) => { 
        const { password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('El password es incorrecto')
            return res.status(401).json({error: error.message})
        }

        res.send('Pasword Correcto')
    }
}