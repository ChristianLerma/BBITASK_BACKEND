"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'BBITask <admin@bbitask.com>',
            to: user.email,
            subject: 'BBITask - Confirma tu Cuenta',
            text: 'BBITask - Confirma tu Cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en BBITask, ya casi está todo listo, pero antes debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este TOKEN expira en <b>10 Minutos</b></p>
            `
        });
        console.log('Mensaje Enviado', info.messageId);
    };
    static sendPasswordResetTokenEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'BBITask <admin@bbitask.com>',
            to: user.email,
            subject: 'BBITask - Restablece tu Password',
            text: 'BBITask - Restablece tu Password',
            html: `<p>Hola: ${user.name}, has solicitado restablecer tu password..</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este TOKEN expira en <b>10 Minutos</b></p>
            `
        });
        console.log('Mensaje Enviado', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmails.js.map