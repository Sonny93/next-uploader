import { getSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';

import Link from 'next/link';

import { calculSize, fileSafeProps, userSafeProps } from '../../utils';
import Meta from '../../components/Meta/Meta';

BigInt.prototype.toJSON = function () { return this.toString() }
const prisma = new PrismaClient();

export default function Admin({ files, users }) {
    return (
        <div className='App'>
            <Meta />
            <header>
                <Link href='/'>
                    <a className='home-link'>Revenir à la page d'accueil</a>
                </Link>
            </header>
            <div>
                <ul>
                    <li>
                        Nombre de fichier(s) : {files?.length || 0}
                    </li>
                    <li>
                        Taille totale : 
                        {calculSize(
                            files?.map(file => parseInt(file.fileBrutSize, 10) || 0).reduce((prev, next) => prev + next)
                        )}
                    </li>
                </ul>
            </div>
            <div>
                <h3>Fichiers</h3>
                <ul>
                    {files?.map((file, key) => <li key={key}>
                        {Object.entries(file).map((values, key2) => <p key={key2}>{values.join(' : ')}</p>)}
                    </li>)}
                </ul>
            </div>
            <div>
                <h3>Users</h3>
                <ul>
                    {users?.map((user, key) => <li key={key}>
                        {Object.entries(user).map((values, key2) => <p key={key2}>{values.join(' : ')}</p>)}    
                    </li>)}
                </ul>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const files = await prisma.file.findMany() || [];
    files.map(file => fileSafeProps(file));

    const users = await prisma.user.findMany() || [];
    users.map((user) => userSafeProps(user));

    return {
        props: { 
            session,
            files: JSON.parse(JSON.stringify(files)),
            users: JSON.parse(JSON.stringify(users))
        }
    }
}