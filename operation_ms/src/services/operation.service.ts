import { Injectable } from '@nestjs/common';
import { In, MoreThanOrEqual, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { MathParserService } from './math_parser.service';
import { Operation } from './../entities/operation.entity';
import { User } from './../entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OperationService {
    constructor(
        @InjectRepository(Operation)
        private readonly operationRepository: Repository<Operation>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mathParserService: MathParserService,
        private readonly httpService: HttpService,
    ) {

    }

    async generateRandomString({ userId }) {
        const checkCostResult = await this.tryDeductCredit({ userId, operationTarget: 'random_string' });
        if (!checkCostResult.status) {
            return checkCostResult;
        }
        const requestOptions = {
            "jsonrpc": "2.0",
            "method": "generateStrings",
            "params": {
                "apiKey": "424be846-0010-44be-b5c9-4f5993e1db21",
                "n": 1,
                "length": 10,
                "characters": "abcdefghijklmnopqrstuvwxyz0123456789",
            },
            "id": 1
        };
        const { data } = await firstValueFrom(this.httpService.post("https://api.random.org/json-rpc/4/invoke", requestOptions).pipe(catchError((error) => {
            throw error;
        })));
        const result = data?.result?.random?.data?.[0];
        return {
            status: !!result,
            error: result == undefined ? 'Internal Server Error' : undefined,
            value: result ? result : undefined,
            userBalance: result ? String(checkCostResult.userBalance) : undefined
        };
    }

    async setCredit({ userId, credit }) {
        this.userRepository.save({ id: userId, balance: credit });
    }

    async executeComplexOperation(userId, mathExpression: string) {
        const checkCostResult = await this.tryDeductCredit({ userId, operationTarget: mathExpression });
        if (!checkCostResult.status) {
            return checkCostResult;
        }

        const complexParseResult = this.mathParserService.complexParse(mathExpression);
        const parseResult = {
            status: complexParseResult.status,
            error: complexParseResult.status == false ? `error at column: ${complexParseResult.index.column} expected: ${complexParseResult.expected.join(',')}` : undefined,
            value: complexParseResult.status == true ? complexParseResult.value : undefined,
            userBalance: checkCostResult.userBalance,
        };
        return parseResult;
    }

    async executeSimpleOperation(userId, operator: string, operands: number[]) {
        const checkCostResult = await this.tryDeductCredit({ userId, operationTarget: operator });
        if (!checkCostResult.status) {
            return checkCostResult;
        }
        const parseResult = {
            ...this.mathParserService.simpleParse(operator, operands),
            userBalance: checkCostResult.userBalance,
        };
        return parseResult;
    }

    private async tryDeductCredit({ userId, operationTarget }) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return {
                status: false,
                error: 'unable to find the user'
            };
        }
        const cost = await this.getOperationCost(operationTarget);
        const updateResult = await this.userRepository.update({ id: userId, balance: MoreThanOrEqual(cost) }, { balance: () => `balance - ${cost}` });
        const { balance: userBalance } = await this.userRepository.findOne({ select: { balance: true }, where: { id: userId } });
        if (updateResult.affected >= 1) {
            return {
                status: true,
                userBalance
            };
        } else {
            return {
                status: false,
                error: 'unable to deduct credit',
                userBalance
            };
        }

    }

    private async getOperationCost(mathExpression: string) {
        const operationMap = new Map();
        let cost = 0;
        if (mathExpression == 'random_string') {
            operationMap.set('random_string', 1);
        } else {
            for (const char of mathExpression) {
                if (!['+', '-', '/', '*', '√'].includes(char)) continue;
                let operationCount = operationMap.get(char);
                operationCount = (operationCount === undefined) ? 1 : operationCount++;
                operationMap.set(char, operationCount);
            }
        }
        const operationCosts = await this.operationRepository.find({ where: { type: In([...operationMap.keys()]) } })

        for (const [operation, count] of operationMap) {
            const operationCost = operationCosts.find((op) => op.type == operation);
            cost += Number(operationCost.cost) * count;
        }

        return cost;

    }

}


