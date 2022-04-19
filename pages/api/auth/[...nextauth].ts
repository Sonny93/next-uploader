import NextAuth from 'next-auth';
// @ts-ignore
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';

import { prisma } from '../../../utils';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
                password: { label: 'Mot de passe', type: 'password', placeholder: '********' }
            },
            async authorize(credentials, req) { // rework
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                if (!email || !password) {
                    return Promise.reject('/signin?error=Email et mot de passe requis');
                }

                let user;
                try {
                    user = await prisma.user.findUnique({
                        where: { email }
                    });
                } catch (error) {
                    console.error(`Impossible de récupérer l'utilisateur avec les identifiants : ${credentials}`);
                    return Promise.reject('/signin?error=Une erreur est survenue lors de l\'authentification, veuillez réessayer');
                }

                if (!user) {
                    return Promise.reject('/signin?error=Compte introuvable');
                }

                const passwordMatch = await bcrypt.compare(credentials?.password, user.password);
                if (!passwordMatch) {
                    return Promise.reject('/signin?error=Veuillez vérifier votre email ou votre mot de passe');
                }

                return {
                    user_id: user.user_id,
                    name: user.username,
                    email: user.email
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            console.log(account, profile, profile.email_verified && profile.email.endsWith("@gmail.com"));
            if (account.provider === "google") {
                return profile.email_verified && profile.email.endsWith("@gmail.com")
            }
            return true // Do different verification for other providers that don't have `email_verified`
        }
    },
    // pages: {
    //     signIn: '/signin',
    //     error: '/signin'
    // }
});