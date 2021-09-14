import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@mail.com" },
                password: { label: "Mot de passe", type: "password", placeholder: "********" }
            },
            async authorize(credentials, req) {
                const connection = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_DB
                });

                const [rows] = await connection.execute('SELECT * FROM `users` WHERE `email` = ?', [credentials?.['email']]);

                if (!rows || rows.length < 1)
                    return null;

                const userDB = rows[0];
                const match = await bcrypt.compare(credentials?.['password'], userDB.password);
                if (!match)
                    return null;

                return {
                    name: userDB.username,
                    email: userDB.email
                }
            }
        })
    ]
})