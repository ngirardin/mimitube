import parseArguments from "./parseArguments";

it("should fail when missing both arguments", () =>
  expect(parseArguments(["bin"])).toEqual({ error: "Missing action" }));

it("should fail when missing the path", () =>
  expect(parseArguments(["bin", "generate"])).toEqual({ error: "Missing path" }));

it("should fail when the action is unknown", () =>
  expect(parseArguments(["bin", "xxx", "./xxx"])).toEqual({
    error: `Invalid action, must be either "generate" or "encode"`,
  }));

it("should accept the generate action ", () =>
  expect(parseArguments(["bin", "generate", "./xxx"])).toEqual({ action: "generate", path: "./xxx" }));

it("should accept the encode action ", () =>
  expect(parseArguments(["bin", "encode", "./xxx"])).toEqual({ action: "encode", path: "./xxx" }));
