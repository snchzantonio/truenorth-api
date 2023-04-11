import { Injectable } from '@nestjs/common';
import { parser } from './../utils/math_parser';

@Injectable()
export class MathParserService {
    complexParse(string: string) {
        return parser.parse(string);
    }

    simpleParse(operator, operands: number[]) {
        let result = 0;

        if (operator == '√' && operands.length > 1) {
            return {
                status: false,
                error: 'expected just one operand',
            };
        } else {
            result = operands.shift();
        }

        for (const operand of operands) {
            switch (operator) {
                case '+':
                    result += Number(operand);
                    break;
                case '-':
                    result -= Number(operand);
                    break;
                case '/':
                    result /= Number(operand);
                    break;
                case '*':
                    result *= Number(operand);
                    break;
                case '√':
                    result = Math.sqrt(Number(operand));
                    break;
            }
        }
        return {
            status: true,
            value: result,
        };
    }
}
