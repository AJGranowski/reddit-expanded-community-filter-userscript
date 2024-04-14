import { mergeDeep } from "../../src/utilities/MergeDeep";

describe("mergeDeep", () => {
    test("should merge empty objects", () => {
        expect(mergeDeep({}, {})).toEqual({});
    });

    test("should merge first level properties", () => {
        expect(mergeDeep({a: 1}, {b: 2})).toEqual({a: 1, b: 2});
    });

    test("should merge second level properties", () => {
        const target = {
            a: {
                foo: "foo"
            }
        };

        const source = {
            b: {
                bar: "foo"
            }
        };

        const expected = {
            a: {
                foo: "foo"
            },
            b: {
                bar: "foo"
            }
        };

        expect(mergeDeep(target, source)).toEqual(expected);
    });

    test("should modify target object", () => {
        const target = {};
        mergeDeep(target, {foo: "bar"});
        expect(target).toEqual({foo: "bar"});
    });

    test("should not modify source object", () => {
        const source = {};
        mergeDeep({bar: "foo"}, source);
        expect(source).toEqual({});
    });

    test("should overwrite target properties that also appear in the source", () => {
        expect(mergeDeep({a: 1}, {a: 2})).toEqual({a: 2});
    });

    test("should merge third level properties", () => {
        const target = {
            a: {
                b: {
                    foo: "foo"
                }
            }
        };

        const source = {
            a: {
                b: {
                    bar: "bar"
                }
            }
        };

        const expected = {
            a: {
                b: {
                    foo: "foo",
                    bar: "bar"
                }
            }
        };

        expect(mergeDeep(source, target)).toEqual(expected);
    });
});