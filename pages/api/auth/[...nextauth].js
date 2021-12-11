import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { prisma, createConnectionLogs } from '../../../utils';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
                password: { label: 'Mot de passe', type: 'password', placeholder: '********' }
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password)
                    return null;

                let user;
                try {
                    user = await prisma.user.findUnique({
                        where: { email }
                    });
                } catch (error) {
                    console.error(`Impossible de récupérer l'utilisateur avec les identifiants : ${credentials}`);
                    return null;
                }

                if (!user) {
                    createConnectionLogs(req, email, false, `Impossible de trouver l'utilisateur : ${email}`);
                    return null;
                }
                
                const passwordMatch = await bcrypt.compare(credentials?.password, user.password);
                if (!passwordMatch) {
                    createConnectionLogs(req, email, false, `Mot de passe incorrect`);
                    return null;
                }

                createConnectionLogs(req, email, true, `Utilisateur authentifié avec succès : ${email}`);
                return {
                    name: user.username,
                    email: user.email
                }
            }
        })
    ]
});