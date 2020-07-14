import { Maybe } from "../Maybe";

describe("Maybe", () => {
    describe("isDefined and isEmpty", () => {
        it("should return isEmpty equal to true for an undefined value", () => {
            const maybe = Maybe.fromValue(undefined);

            expect(maybe.isDefined()).toBeFalsy();
            expect(maybe.isEmpty()).toBeTruthy();
        });
        it("should return isEmpty equal to true for a null value", () => {
            const maybe = Maybe.fromValue(null);

            expect(maybe.isDefined()).toBeFalsy();
            expect(maybe.isEmpty()).toBeTruthy();
        });
        it("should return isDefined equal to true for a valid value", () => {
            const maybe = Maybe.fromValue(5);

            expect(maybe.isDefined()).toBeTruthy();
            expect(maybe.isEmpty()).toBeFalsy();
        });
    });
    describe("fold", () => {
        it("should return none for an undefined value", () => {
            const maybe = Maybe.fromValue(undefined);

            maybe.fold(
                () => expect(maybe.isEmpty()).toBeTruthy(),
                () => fail("Should return none for a undefined value")
            );
        });
        it("should return none for a null value", () => {
            const maybe = Maybe.fromValue(null);

            maybe.fold(
                () => expect(maybe.isEmpty()).toBeTruthy(),
                () => fail("Should return none for a null value")
            );
        });
        it("should return some for a valid value", () => {
            const maybe = Maybe.fromValue(5);

            maybe.fold(
                () => fail("Should return expected mapped value after flatmap"),
                value => expect(value).toEqual(5)
            );
        });
    });
    describe("get", () => {
        it("should get throw an error for an undefined value", () => {
            const maybe = Maybe.fromValue(undefined);

            expect(maybe.get).toThrow();
        });
        it("should get throw an error for null value", () => {
            const maybe = Maybe.fromValue(null);

            expect(maybe.get).toThrow();
        });
        it("should get return the valid value", () => {
            const maybe = Maybe.fromValue(5);

            expect(maybe.get()).toEqual(5);
        });
    });
    describe("getOrElse", () => {
        it("should getOrElse return default value for an undefined value", () => {
            const maybe = Maybe.fromValue(undefined);

            expect(maybe.getOrElse(0)).toEqual(0);
        });
        it("should getOrElse return default value for null value", () => {
            const maybe = Maybe.fromValue(null);

            expect(maybe.getOrElse(0)).toEqual(0);
        });
        it("should getOrElse return a value for valid value", () => {
            const maybe = Maybe.fromValue(5);

            expect(maybe.getOrElse(0)).toEqual(5);
        });
    });
    describe("map", () => {
        it("should return none after map an undefined value", () => {
            const maybe = Maybe.fromValue(undefined);
            const mappedMaybe = maybe.map(number => number * 2);

            mappedMaybe.fold(
                () => expect(mappedMaybe.isEmpty()).toBeTruthy(),
                () => fail("Should return none after map a undefined value")
            );
        });
        it("should return none after map a null value", () => {
            const maybe = Maybe.fromValue(null);
            const mappedMaybe = maybe.map(number => number * 2);

            mappedMaybe.fold(
                () => expect(mappedMaybe.isEmpty()).toBeTruthy(),
                () => fail("Should return none after map a null value")
            );
        });
        it("should return some after map a valid value", () => {
            const maybe = Maybe.fromValue(5);
            const mappedMaybe = maybe.map(number => number * 2);

            mappedMaybe.fold(
                () => fail("Should return expected mapped value after flatmap"),
                value => expect(value).toEqual(10)
            );
        });
    });
    describe("flatmap", () => {
        it("should return none after flatmap an undefined initial value", () => {
            const maybe = Maybe.fromValue(undefined);
            const mappedMaybe = maybe.flatMap(value => Maybe.fromValue(value * 2));

            mappedMaybe.fold(
                () => expect(mappedMaybe.isEmpty()).toBeTruthy(),
                () => fail("Should return none after map a null value")
            );
        });
        it("should return initial none after flatmap for a null initial value", () => {
            const maybe = Maybe.fromValue(null);
            const mappedMaybe = maybe.flatMap(value => Maybe.fromValue(value * 2));

            mappedMaybe.fold(
                () => expect(mappedMaybe.isEmpty()).toBeTruthy(),
                () => fail("Should return none after map a null value")
            );
        });
        it("should return expected mapped value after flatmap for a initial valid value", () => {
            const maybe = Maybe.fromValue(5);
            const mappedMaybe = maybe.flatMap(value => Maybe.fromValue(value * 2));

            mappedMaybe.fold(
                () => fail("Should return expected mapped value after flatmap"),
                value => expect(value).toEqual(10)
            );
        });
    });
});
