import { Maybe } from "../Maybe";

describe("Maybe", () => {
    it("should return none for undefined value", () => {
        const maybe = Maybe.fromValue<number>(undefined);

        expect(maybe.isDefined()).toBeFalsy();
        expect(maybe.isEmpty()).toBeTruthy();
    });
    it("should get throw error for undefined value", () => {
        const maybe = Maybe.fromValue<number>(undefined);

        expect(maybe.get).toThrow();
    });
    it("should getOrElse return default value for undefined value", () => {
        const maybe = Maybe.fromValue<number>(undefined);

        expect(maybe.getOrElse(5)).toEqual(5);
    });
    it("should get throw error after map a undefined value", () => {
        const maybe = Maybe.fromValue<number>(undefined);
        const mappedMayBe = maybe.map(number => number * 2);

        expect(mappedMayBe.get).toThrow();
    });
    it("should return none for null value", () => {
        const maybe = Maybe.fromValue<number>(null);

        expect(maybe.isDefined()).toBeFalsy();
        expect(maybe.isEmpty()).toBeTruthy();
    });
    it("should get throw error for null value", () => {
        const maybe = Maybe.fromValue<number>(null);

        expect(maybe.get).toThrow();
    });
    it("should getOrElse return default value for null value", () => {
        const maybe = Maybe.fromValue<number>(null);

        expect(maybe.getOrElse(5)).toEqual(5);
    });
    it("should get throw error after map a null value", () => {
        const maybe = Maybe.fromValue<number>(null);
        const mappedMayBe = maybe.map(number => number * 2);

        expect(mappedMayBe.get).toThrow();
    });
    it("should return some for a valid value", () => {
        const maybe = Maybe.fromValue<number>(5);

        expect(maybe.isDefined()).toBeTruthy();
        expect(maybe.isEmpty()).toBeFalsy();
    });
    it("should get return value for a valid value", () => {
        const maybe = Maybe.fromValue<number>(5);

        expect(maybe.get()).toEqual(5);
    });
    it("should getOrElse return value for valid value", () => {
        const maybe = Maybe.fromValue<number>(5);

        expect(maybe.getOrElse(0)).toEqual(5);
    });
    it("should get throw error after map a valid value", () => {
        const maybe = Maybe.fromValue<number>(5);
        const mappedMayBe = maybe.map(number => number * 2);

        expect(mappedMayBe.get()).toEqual(10);
    });
});
