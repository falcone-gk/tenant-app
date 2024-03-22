import { randomBytes, scrypt } from "crypto"

async function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    const salt = randomBytes(16).toString("hex")
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString('hex'))
    });
  })
}

async function checkPassword(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":")
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'))
    });
  })
}

export { hashPassword, checkPassword }  