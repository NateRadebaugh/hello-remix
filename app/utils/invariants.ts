import invariant from "tiny-invariant";

export function stringInvariant(value: unknown): asserts value is string {
  invariant(typeof value === "string", `value must be a string, got ${value}`);
}

export function numberInvariant(value: unknown): asserts value is number {
  invariant(typeof value === "number", `value must be a number, got ${value}`);
  invariant(!isNaN(value), `value is not a number`);
}

export function checkboxInvariant(
  value: unknown
): asserts value is "on" | undefined | null {
  invariant(
    value === "on" || value === undefined || value === null,
    "value must be 'on' or not set, got " + value
  );
}
