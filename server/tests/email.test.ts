import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/config/env.js", () => ({
  env: {
    NODE_ENV: "test",
    CLIENT_URL: "http://localhost:3000",
    EMAIL_API_KEY: "re_test",
    EMAIL_FROM: "Portfolio <onboarding@resend.dev>",
    INQUIRY_NOTIFY_EMAIL: "owner@example.com"
  }
}));

import { sendInquiryNotification } from "../src/services/email.js";

const fetchMock = vi.fn();
const okResponse = { ok: true, status: 200, text: async () => "" } as Response;

const base = { id: "inquiry-1", name: "Jane", email: "jane@example.com", message: "Hello A" };
const recipient = "owner@example.com";

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendInquiryNotification", () => {
  it("posts to Resend and resolves on success", async () => {
    fetchMock.mockResolvedValue(okResponse);
    await sendInquiryNotification({ ...base, message: "Hello A", recipient });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(init?.body as string);
    expect(body.from).toBe("Portfolio <onboarding@resend.dev>");
    expect(body.to).toEqual([recipient]);
    expect(body.reply_to).toBe("jane@example.com");
    expect(body.subject).toContain("Jane");
    expect(body.html).toContain("New portfolio inquiry");
    expect(body.html).toContain("http://localhost:3000/admin/inquiries");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
  });

  it("skips an identical notification within the dedupe window", async () => {
    fetchMock.mockResolvedValue(okResponse);
    const input = { ...base, message: "Hello B", recipient };
    await sendInquiryNotification(input);
    await sendInquiryNotification(input);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("swallows provider failures", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    await expect(
      sendInquiryNotification({ ...base, message: "Hello C", recipient })
    ).resolves.toBeUndefined();
  });
});
