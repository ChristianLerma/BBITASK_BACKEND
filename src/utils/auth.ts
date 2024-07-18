import bcrypt from 'bcrypt'

export const hassPassword = async (password : string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (enteregPassword: string, storeHash: string) => {
    return await bcrypt.compare(enteregPassword, storeHash)
}