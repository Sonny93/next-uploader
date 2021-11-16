import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import requestip from 'request-ip';

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
                const ip = requestip.getClientIp(req);
                let user;
                try {
                    user = await prisma.user.findUnique({
                        where: {
                            email: credentials?.email
                        }
                    });
                } catch (error) {
                    console.error('Unable to get user with credentials:', credentials);
                    return null;
                }

                if (!user) {
                    try {
                        const logs = await prisma.log_connection.create({
                            data: {
                                email_used: credentials?.email,
                                ip,
                                success: false,
                                message: 'Unable to find user with email: ' + credentials?.email
                            }
                        });
                    } catch (error) {
                        console.error('Unable to create log_connection', error);
                    }
                    return null;
                } 
                
                const passwordMatch = await bcrypt.compare(credentials?.password, user.password);
                if (!passwordMatch) {
                    try {
                        const logs = await prisma.log_connection.create({
                            data: {
                                email_used: credentials?.email,
                                ip,
                                success: false,
                                message: 'Password does not match'
                            }
                        });
                    } catch (error) {
                        console.error('Unable to create log_connection', error);
                    }
                    return null;
                }

                try {
                    const logs = await prisma.log_connection.create({
                        data: {
                            email_used: credentials?.email,
                            ip,
                            success: true,
                            message: `Successfully connected as "${user.username}" with email "${user.email}"`
                        }
                    });
                } catch (error) {
                    console.error('Unable to create log_connection', error);
                }

                return {
                    name: user.username,
                    email: user.email
                }
            }
        })
    ]
});