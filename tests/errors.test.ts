import { describe, expect, it } from "vitest";

import { TitlecastError } from "../src/errors.js";

describe("TitlecastError", () => {
  it("keeps its name, message, and cause", () => {
    const cause = new TypeError("bad value");
    const error = new TitlecastError("Run failed.", { cause });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("TitlecastError");
    expect(error.message).toBe("Run failed.");
    expect(error.cause).toBe(cause);
  });
});
