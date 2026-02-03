import test from "node:test";
import assert from "node:assert/strict";
import { calculateSellingPrice } from "../src/services/pricingService.js";

test("calculateSellingPrice returns MRP when no discount", () => {
  assert.equal(calculateSellingPrice(1000, 0), 1000);
  assert.equal(calculateSellingPrice(1000, null), 1000);
});

test("calculateSellingPrice applies percentage discount with rounding", () => {
  assert.equal(calculateSellingPrice(999, 10), 899.1);
  assert.equal(calculateSellingPrice(100, 15), 85);
});

