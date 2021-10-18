import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
                password: { label: 'Mot de passe', type: 'password', placeholder: '********' }
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                
                const passwordMatch = await bcrypt.compare(credentials?.password, user.password);
                if (!passwordMatch)
                    return null;

                return {
                    name: user.username,
                    email: user.email
                }
            }
        })
    ]
})