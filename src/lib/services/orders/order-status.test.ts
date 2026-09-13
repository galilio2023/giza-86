import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateStatusTransition,
} from "@/lib/domain/orders";
import { InvalidStatusTransitionError } from "@/lib/domain/errors";

describe("Order Status Transition Validation", () => {
  it("should allow transitioning from new to confirmed, processing, or cancelled", () => {
    assert.doesNotThrow(() => validateStatusTransition("new", "confirmed"));
    assert.doesNotThrow(() => validateStatusTransition("new", "processing"));
    assert.doesNotThrow(() => validateStatusTransition("new", "cancelled"));
  });

  it("should allow transitioning from confirmed to processing, shipped, or cancelled", () => {
    assert.doesNotThrow(() => validateStatusTransition("confirmed", "processing"));
    assert.doesNotThrow(() => validateStatusTransition("confirmed", "shipped"));
    assert.doesNotThrow(() => validateStatusTransition("confirmed", "cancelled"));
  });

  it("should allow transitioning from shipped to delivered or returned", () => {
    assert.doesNotThrow(() => validateStatusTransition("shipped", "delivered"));
    assert.doesNotThrow(() => validateStatusTransition("shipped", "returned"));
  });

  it("should allow no-op transition when status does not change", () => {
    assert.doesNotThrow(() => validateStatusTransition("shipped", "shipped"));
    assert.doesNotThrow(() => validateStatusTransition("delivered", "delivered"));
  });

  it("should throw InvalidStatusTransitionError on illegal transitions", () => {
    // Cannot jump from new directly to delivered
    assert.throws(
      () => validateStatusTransition("new", "delivered"),
      (err: unknown) => err instanceof InvalidStatusTransitionError
    );

    // Cannot jump from returned to new
    assert.throws(
      () => validateStatusTransition("returned", "new"),
      (err: unknown) => err instanceof InvalidStatusTransitionError
    );

    // Cannot jump from delivered to confirmed
    assert.throws(
      () => validateStatusTransition("delivered", "confirmed"),
      (err: unknown) => err instanceof InvalidStatusTransitionError
    );
  });
});
