import bcrypt from 'bcryptjs'

interface SeedUser {
    name:       string;
    email:      string;
    password:   string;
    role:       'admin'|'client'
}

interface SeedData {
    users: SeedUser[],
}

export const initialDataUsers: SeedData = {
    users: [
        { name: 'Admin', email: 'admin@localhost', password: bcrypt.hashSync('admin'), role: 'admin' },
        { name: 'Client', email: 'client@localhost', password: bcrypt.hashSync('client'), role: 'client' },
    ]
}
