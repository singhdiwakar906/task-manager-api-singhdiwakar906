const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

let token = "";
let registeredEmail = "testuser@example.com";
let password = "Test@123";

tap.test("GET /server/health", async (t) => {
    const res = await server.get("/server/health");
    t.equal(res.status, 200);
    t.match(res.text, /Server happy and running/);
    t.end();
});

tap.test("POST /users/register", async (t) => {
    try {
        const res = await server.post("/users/register").send({
            payload: {
                email: registeredEmail,
                password: password,
                fullName: "Test User",
                phone: "9876543210"
            }
        });

        t.ok([201, 409].includes(res.status));
        if (res.status === 201) {
            t.equal(res.body.success, true);
        } else {
            t.equal(res.body.success, false);
        }

        t.end();
    } catch (error) {
        t.threw(error);
        t.end();
    }
});

tap.test("POST /users/login", async (t) => {
    try {
        const res = await server.post("/users/login").send({
            payload: {
                email: registeredEmail,
                password: password
            }
        });

        t.equal(res.status, 200);
        t.ok(res.body.token);
        token = res.body.token;
        t.end();
    } catch (error) {
        t.threw(error);
        t.end();
    }
});

tap.test("POST /users/preferences", async (t) => {
    const payload = {
        payload: {
            categories: ["technology", "health"],
            languages: ["en"],
            region: "us",
            sources: ["cnn", "bbc"]
        }
    };

    try {
        const res = await server
            .post("/users/preferences")
            .set("Authorization", `Bearer ${token}`)
            .send(payload);

        t.ok([200, 409].includes(res.status), "Should return 200 or 409");

        if (res.status === 200) {
            t.equal(res.body.success, true, "Preference created successfully");
        } else if (res.status === 409) {
            t.equal(res.body.success, false, "Conflict due to existing preference");
        }
    } catch (error) {
        t.fail(`Unexpected error: ${error.message}`);
    }

    t.end();
});


tap.test("GET /users/preferences", async (t) => {
    try {
        const res = await server
            .get("/users/preferences")
            .set("Authorization", `Bearer ${token}`);

        t.equal(res.status, 200);
        t.equal(res.body.success, true);
        t.ok(typeof res.body.data === "object" && res.body.data !== null);
        t.end();
    } catch (error) {
        t.threw(error);
        t.end();
    }
});

tap.test("PUT /users/preferences", async (t) => {
    try {
        const res = await server
            .put("/users/preferences")
            .set("Authorization", `Bearer ${token}`)
            .send({
                payload: {
                    categories: ["health"],
                    languages: ["en", "hi"],
                    region: "in",
                    sources: ["bbc-news"]
                }
            });

        t.equal(res.status, 200);
        t.equal(res.body.success, true);
        t.end();
    } catch (error) {
        t.threw(error);
        t.end();
    }
});

tap.test("GET /users/news", async (t) => {
    try {
        const res = await server
            .get("/users/news")
            .set("Authorization", `Bearer ${token}`);

        t.equal(res.status, 200, "Status code should be 200");
        t.equal(res.body.success, true, "Response should indicate success");

        t.ok(Array.isArray(res.body.data), "Data should be an array of news articles");

        if (res.body.data.length > 0) {
            t.ok(res.body.data[0].title, "Each article should have a title");
            t.ok(res.body.data[0].url, "Each article should have a url");
        }

        t.end();
    } catch (error) {
        t.fail(`Unexpected error: ${error.message}`);
        t.end();
    }
});

