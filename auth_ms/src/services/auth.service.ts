import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser({ username, password }) {
        let hash: string;
        let result;

        try {
            hash = await this.generateHash(password);
            const saveResult = await this.usersRepository.save({
                username,
                active: true,
                password: hash
            });

            result = {
                id: saveResult.id,
                username,
                active: true,
                password
            };
        } catch (error) {
            console.log(error);
        }
        return result;
    }

    async login({ username, password }) {
        const user = await this.usersRepository.findOneBy({ username, active: true });
        if (!user) return false;
        const isCorrectPassword = await this.comparePaswordAndHash({ password, passwordHash: user.password })
        if (!isCorrectPassword) return false;
        return {
            token: this.jwtService.sign({
                sub: user.id,
                id: user.id,
                username: user.username,
            })
        };

    }

    decodeJWT(jwtToken) {
        return this.jwtService.decode(jwtToken);
    }

    generateHash(string: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(string, saltRounds);
    }

    comparePaswordAndHash({ password, passwordHash }): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }

}
