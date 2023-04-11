import * as P from 'parsimmon';

const operator = P.oneOf('+-*/');

const number = P.regexp(/-?[0-9]+/).map(Number);

const root = P.string('√')
    .then(P.lazy(() => mulExpr))
    .map((number) => {
        return Math.sqrt(number);
    });

const addExpr = P.lazy(() =>
    P.seqMap(mulExpr, P.seq(operator, mulExpr).many(), (first, rest) =>
        rest.reduce((acc: number, [op, val]) =>
            op === '+' ? acc + val : acc - val,
            first
        )
    )
);

const mulExpr = P.lazy(() =>
    P.seqMap(atomExpr, P.seq(P.oneOf('*/'), atomExpr).many(),
        (first: any, rest: any[]) => rest.reduce((acc, [op, val]) => {
            return op === '*' ? acc * val : acc / val;
        },
            first)
    )
);

const atomExpr = P.alt(
    number,
    root,
    P.string('(').then(addExpr).skip(P.string(')'))
);

export const parser = addExpr.skip(P.end);

