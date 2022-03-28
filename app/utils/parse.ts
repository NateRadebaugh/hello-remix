import {
  checkboxInvariant,
  numberInvariant,
  stringInvariant,
} from "./invariants";

export function parseInt(value: unknown) {
  stringInvariant(value);
  const asInt = Number.parseInt(value, 10);
  numberInvariant(asInt);
  return asInt;
}

export function parseCheckbox(value: unknown) {
  checkboxInvariant(value);
  const checked = value === "on";
  return checked;
}
