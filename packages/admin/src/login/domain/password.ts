import { ValueObject } from "../../common/domain/ValueObject";
import { Either } from "../../common/domain/Either";

export interface PasswordProps {
  value: string;
}

export type PaswordError = "InvalidEmptyPassword"


export class Password extends ValueObject<PasswordProps> {

  public static minLength: number = 6;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public static create(value: string): Either<PaswordError, Password> {
    if (!value) {
      return Either.left("InvalidEmptyPassword");
    } else {
      return Either.right(new Password({
        value: value
      }));
    }
  }
}
