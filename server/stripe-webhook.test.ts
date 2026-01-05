import { describe, expect, it, vi } from "vitest";
import { handleStripeWebhook } from "./stripe-webhook";

function createMockRes() {
  const status = vi.fn().mockReturnThis();
  const json = vi.fn().mockReturnThis();
  return { status, json } as any;
}

describe("handleStripeWebhook", () => {
  it("returns 400 when stripe signature is missing", async () => {
    const req = { headers: {}, body: Buffer.from("") } as any;
    const res = createMockRes();

    await handleStripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Missing Stripe signature" })
    );
  });
});
