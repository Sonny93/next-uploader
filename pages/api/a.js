import bcrypt from 'bcrypt';

const mdp = '';
export default async function handler() {
    const hash = await bcrypt.hash(mdp, 12);
    console.log(hash);
}