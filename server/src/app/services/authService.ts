import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { ORM } from '../types/orm';
import { RegisterForm } from "../types/auth";

export class AuthService {
    private orm: ORM;
    private jwt: FastifyInstance['jwt'];


    constructor(fastify: FastifyInstance) {
        this.orm = fastify.orm;
        this.jwt = fastify.jwt;
    }

    /**
     * Register a new user.
     * @returns The created user without the password.
     * @param form
     */
    async register(form: RegisterForm) {
        const hashedPassword = await bcrypt.hash(form.password, 10);

        const existingUser = await this.orm.query(
            'SELECT * FROM users WHERE email = $1',
            [form.email]
        );

        if (existingUser.length > 0) {
            throw new Error('User already exists with this email');
        }

        const [newUser] = await this.orm.create('users', {
            username: form.username,
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            password: hashedPassword,
        });

        delete newUser.password;
        return newUser;
    }

    /**
     * Log in a user.
     * @param email - The email of the user.
     * @param password - The raw password of the user.
     * @returns A JWT token if authentication is successful.
     */
    async login(email: string, password: string) {
        const [user] = await this.orm.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = this.jwt.sign(
            { id: user.id, email: user.email },
            { expiresIn: '1h' }
        );

        return { token };
    }
}
