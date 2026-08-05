import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/createApp.js";
import { ContactSettingsModel } from "../src/models/contactSettings.model.js";
import { ProfileModel } from "../src/models/profile.model.js";
import { ProjectModel } from "../src/models/project.model.js";
import { SkillModel } from "../src/models/skill.model.js";
import { connectTestDb, disconnectTestDb, testAdmin } from "./helpers.js";

const app = createApp();

let token = "";
let skillId = "";

const authed = () => ({ Authorization: `Bearer ${token}` });

async function loginAsAdmin(): Promise<string> {
  const res = await request(app).post("/api/v1/auth/login").send(testAdmin).expect(200);
  return res.body.token as string;
}

beforeAll(async () => {
  await connectTestDb();
  await ProfileModel.create({
    name: "Test Person",
    title: "Software Developer",
    contactEmail: "test@example.com"
  });
  await SkillModel.create([
    { name: "React", category: "Frontend", level: 4, order: 0, published: true },
    { name: "Node.js", category: "Backend", level: 3, order: 1, published: true },
    { name: "Hidden Skill", category: "General", order: 2, published: false }
  ]);
  await ProjectModel.create([
    { title: "Public Project", description: "d", order: 0, published: true, featured: true },
    { title: "Hidden Project", description: "d", order: 1, published: false }
  ]);
  await ContactSettingsModel.create({ email: "test@example.com", formEnabled: true });
  token = await loginAsAdmin();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/v1/health").expect(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("public content", () => {
  it("lists only published skills in order", async () => {
    const res = await request(app).get("/api/v1/skills").expect(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("React");
    expect(res.body[1].name).toBe("Node.js");
  });

  it("lists only published projects", async () => {
    const res = await request(app).get("/api/v1/projects").expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Public Project");
  });

  it("returns the profile single", async () => {
    const res = await request(app).get("/api/v1/profile").expect(200);
    expect(res.body.name).toBe("Test Person");
  });

  it("returns 404 for a missing single", async () => {
    const res = await request(app).get("/api/v1/resume").expect(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("POST /inquiries", () => {
  it("creates an inquiry", async () => {
    const res = await request(app)
      .post("/api/v1/inquiries")
      .send({ name: "Jane", email: "jane@example.com", message: "Hello" })
      .expect(201);
    expect(res.body.name).toBe("Jane");
    expect(res.body.email).toBe("jane@example.com");
  });

  it("rejects invalid payloads", async () => {
    const res = await request(app)
      .post("/api/v1/inquiries")
      .send({ name: "Jane", email: "not-an-email", message: "" })
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects when the form is disabled", async () => {
    await ContactSettingsModel.findOneAndUpdate({}, { formEnabled: false });
    try {
      const res = await request(app)
        .post("/api/v1/inquiries")
        .send({ name: "Jane", email: "jane@example.com", message: "Hello" })
        .expect(403);
      expect(res.body.error.code).toBe("FORM_DISABLED");
    } finally {
      await ContactSettingsModel.findOneAndUpdate({}, { formEnabled: true });
    }
  });
});

describe("auth", () => {
  it("logs in with valid credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send(testAdmin).expect(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe(testAdmin.email);
  });

  it("rejects invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testAdmin.email, password: "wrong-password" })
      .expect(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("rejects a malformed login body", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testAdmin.email })
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns the current user with a token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.user.email).toBe(testAdmin.email);
  });

  it("rejects /me without a token", async () => {
    const res = await request(app).get("/api/v1/auth/me").expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("admin write endpoints", () => {
  it("rejects writes without a token", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .send({ name: "Docker", category: "Tools", level: 3 })
      .expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("creates a skill", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .set(authed())
      .send({ name: "Docker", category: "Tools", level: 3, published: true })
      .expect(201);
    expect(res.body.name).toBe("Docker");
    skillId = res.body.id;
  });

  it("rejects invalid skill payloads", async () => {
    const res = await request(app)
      .post("/api/v1/admin/skills")
      .set(authed())
      .send({ name: "X", level: 9 })
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("updates a skill", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/skills/${skillId}`)
      .set(authed())
      .send({ published: false })
      .expect(200);
    expect(res.body.published).toBe(false);
  });

  it("deletes a skill", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/skills/${skillId}`)
      .set(authed())
      .expect(200);
    expect(res.body.deleted).toBe(true);
  });

  it("upserts the profile singleton", async () => {
    const res = await request(app)
      .put("/api/v1/admin/profile")
      .set(authed())
      .send({ name: "Updated Name" })
      .expect(200);
    expect(res.body.name).toBe("Updated Name");
  });
});

describe("admin read endpoints", () => {
  it("requires a token", async () => {
    const res = await request(app).get("/api/v1/admin/skills").expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("lists all skills including unpublished", async () => {
    const res = await request(app).get("/api/v1/admin/skills").set(authed()).expect(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
    const hidden = res.body.find((s: { name: string }) => s.name === "Hidden Skill");
    expect(hidden).toBeDefined();
  });

  it("lists all projects including unpublished", async () => {
    const res = await request(app).get("/api/v1/admin/projects").set(authed()).expect(200);
    expect(res.body.some((p: { title: string }) => p.title === "Hidden Project")).toBe(true);
  });

  it("returns the profile singleton", async () => {
    const res = await request(app).get("/api/v1/admin/profile").set(authed()).expect(200);
    expect(res.body.name).toBe("Updated Name");
  });

  it("returns 404 for a missing singleton", async () => {
    const res = await request(app).get("/api/v1/admin/site-settings").set(authed()).expect(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("admin inquiry management", () => {
  let inquiryId = "";

  it("lists inquiries newest first", async () => {
    await request(app)
      .post("/api/v1/inquiries")
      .send({ name: "Older", email: "older@example.com", message: "First" })
      .expect(201);
    const res = await request(app)
      .post("/api/v1/inquiries")
      .send({ name: "Newer", email: "newer@example.com", message: "Second" })
      .expect(201);
    inquiryId = res.body.id;

    const list = await request(app).get("/api/v1/admin/inquiries").set(authed()).expect(200);
    expect(list.body[0].name).toBe("Newer");
  });

  it("requires a token to list inquiries", async () => {
    const res = await request(app).get("/api/v1/admin/inquiries").expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("marks an inquiry as read", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/inquiries/${inquiryId}`)
      .set(authed())
      .send({ read: true })
      .expect(200);
    expect(res.body.read).toBe(true);
  });

  it("rejects an invalid inquiry payload", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/inquiries/${inquiryId}`)
      .set(authed())
      .send({ read: "yes" })
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("deletes an inquiry", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/inquiries/${inquiryId}`)
      .set(authed())
      .expect(200);
    expect(res.body.deleted).toBe(true);
  });
});

describe("media upload", () => {
  it("rejects without a token", async () => {
    const res = await request(app).post("/api/v1/media").expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects missing files", async () => {
    const res = await request(app)
      .post("/api/v1/media")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(res.body.error.code).toBe("NO_FILE");
  });

  it("rejects non-image files", async () => {
    const res = await request(app)
      .post("/api/v1/media")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("hello"), "test.txt")
      .expect(400);
    expect(res.body.error.code).toBe("UPLOAD_ERROR");
  });

  it("fails gracefully when Cloudinary is not configured", async () => {
    const res = await request(app)
      .post("/api/v1/media")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), "test.png")
      .expect(500);
    expect(res.body.error.code).toBe("MEDIA_NOT_CONFIGURED");
  });
});
