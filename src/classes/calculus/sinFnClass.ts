// import { Fraction } from 'math-edu'; TODO:
import {
  Fraction,
  Term,
  Angle,
  SquareRoot,
  Trig,
  Polynomial,
  Expression,
  // from 'math-edu';
} from '../../../../math-edu/src/index';
import CosFn from './cosFnClass';

export default class SinFn extends Term {
  /**
   * class representing the k sin(ax+b) function
   */
  variableAtom: string;
  a: Fraction;
  b: Fraction;

  ////
  // constructor
  ////
  /**
   * Creates a new sinFn instance
   *
   * @options defaults to `a: 1, b: 0, variableAtom: 'x', coeff: 1`
   *
   */
  constructor(options?: ExpOptions) {
    const defaultOptions = {
      a: 1,
      b: 0,
      variableAtom: 'x',
      coeff: 1,
    };
    const optionsObject = { ...defaultOptions, ...options };
    const a = convertNumberToFraction(optionsObject.a);
    const b = convertNumberToFraction(optionsObject.b);
    const coeff = convertNumberToFraction(optionsObject.coeff);
    if (a.isEqual(0)) {
      throw new Error('sinFn ERROR: a must be non-zero');
    }
    const axPLUSb = new Polynomial([a, b], { variableAtom: optionsObject.variableAtom });
    const axPLUSbString = `${axPLUSb}`.length === 1 || `${axPLUSb}` === '\\theta' ? `${axPLUSb}` : `( ${axPLUSb} )`;
    super(coeff, `\\sin ${axPLUSbString}`);
    this.variableAtom = optionsObject.variableAtom;
    this.a = a;
    this.b = b;
  }

  /**
   * subs in the value of x
   *
   * WARNING: only supported if if final angle is a special angle
   */
  valueAt(x: number | Angle): SquareRoot {
    if (x instanceof Angle) {
      x = x.degrees;
    }
    const angle = this.a.times(x).plus(this.b);
    return Trig.sin(angle.valueOf()).times(this.coeff);
  }

  /**
   * toNumberFunction
   *
   * @return a javascript function that takes in a number type and output a number type.
   * useful for numerical methods (eg Simpson's rule)
   */
  toNumberFunction(): (x: number) => number {
    return (x: number) => this.coeff.valueOf() * Math.sin(this.a.valueOf() * x + this.b.valueOf());
  }

  /**
   * derivative
   */
  derivative(): CosFn {
    return new CosFn({
      a: this.a,
      b: this.b,
      variableAtom: this.variableAtom,
      coeff: this.coeff.times(this.a),
    });
  }

  /**
   * integral
   */
  integral(): CosFn {
    return new CosFn({
      a: this.a,
      b: this.b,
      variableAtom: this.variableAtom,
      coeff: this.coeff.divide(this.a).times(-1),
    });
  }

  /**
   * definite integral
   */
  definiteIntegral(lower: number | Angle, upper: number | Angle): Expression {
    const upperExpression = new Expression(this.integral().valueAt(upper));
    return upperExpression.subtract(this.integral().valueAt(lower));
  }
}

interface ExpOptions {
  a?: number | Fraction;
  b?: number | Fraction;
  coeff?: number | Fraction;
  variableAtom?: string;
}

// type MathTypes = number | Fraction | Exp;

// convertNumberToFraction
function convertNumberToFraction(x: number | Fraction): Fraction {
  if (typeof x === 'number') {
    return new Fraction(x);
  } else {
    return new Fraction(x.num, x.den);
  }
}
