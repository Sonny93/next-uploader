import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '../../../utils';

export default NextAuth({
    providers: [
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
            if (account.provider === "google" && profile.email !== '') {
                console.log(account, profile, profile.email_verified && profile.email.endsWith("@gmail.com"));
                if (profile.email_verified && profile.email.endsWith("@gmail.com")) {
                    return true;
                } else {
                    return "/signin?error=" + encodeURI('Une erreur s\'est produite lors de l\'authentification');
                }
            }
            return false;
        }
    },
    pages: { signIn: '/signin' }
});