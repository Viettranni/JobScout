const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../app"); // Adjust the path according to your app structure
const { JobPost } = require("../src/models/JobPost"); // Adjust the path according to your model

let mongoServer;
let authToken; // Variable to hold the JWT token for authentication

// Mock user data for generating JWT
const mockUser = {
  id: "userId123", // Example user ID
  username: "testuser", // Example username
  // Add any other required user fields here if necessary
};

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  // Start the in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Generate a JWT token for the mock user
  authToken = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Create an initial job post for testing
  const initialJob = {
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Remote",
    datePosted: new Date().toISOString(),
    url: "http://example.com/software-engineer",
    description: "Developing software solutions.",
    responsibilities: ["Coding", "Debugging"],
    logo: "http://example.com/logo.png",
  };

  // Save the initial job to the database
  const jobPost = new JobPost(initialJob);
  await jobPost.save();
});

afterAll(async () => {
  // Close the connection and stop the MongoDB server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Job API", () => {
  let jobId; // Variable to hold the job ID for subsequent tests

  // Scenario: Create a new job
  describe("POST /api/jobs/scrape-jobs", () => {
    it("should create a new job and return the job object", async () => {
      const newJob = {
        title: "Backend Developer",
        company: "Dev Studio",
        location: "On-site",
        datePosted: new Date().toISOString(),
        url: "http://example.com/backend-developer",
        description: "Building backend services.",
        responsibilities: ["API development", "Database management"],
        logo: "http://example.com/backend-logo.png",
      };

      const res = await request(app)
        .post("/api/jobs/allsites/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`) // Include the JWT token in the header
        .send(newJob)
        .expect(201); // Expect Created status

      expect(res.body).toHaveProperty("job");
      expect(res.body.job).toMatchObject(newJob);
      jobId = res.body.job._id; // Store job ID for later tests
    });
  });

  // Scenario: Retrieve all jobs
  describe("GET /api/jobs", () => {
    it("should return all jobs", async () => {
      const res = await request(app).get("/").expect(200); // Expect OK status

      expect(res.body).toHaveProperty("jobs");
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeGreaterThan(0); // Ensure there's at least one job
    });
  });

  // Scenario: Retrieve a job by ID
  describe("GET /jobs/:id", () => {
    it("should return a job by ID", async () => {
      const res = await request(app).get(`/${jobId}`).expect(200); // Expect OK status

      expect(res.body).toHaveProperty("job");
      expect(res.body.job._id).toBe(jobId.toString()); // Verify the job ID matches
    });

    it("should return 404 for a non-existent job ID", async () => {
      const res = await request(app)
        .get("/jobs/999999999999999999999999")
        .expect(404); // Expect Not Found status
      expect(res.body).toHaveProperty("message", "Job not found"); // Assuming your error message
    });
  });

  // Scenario: Delete a job
  describe("DELETE /jobs/:id", () => {
    it("should delete a job by ID and return 204 status", async () => {
      const res = await request(app)
        .delete(`/${jobId}`)
        .set("Authorization", `Bearer ${authToken}`) // Include the JWT token in the header
        .expect(204); // Expect No Content status

      expect(res.body).toEqual({}); // Expect an empty response body
    });

    it("should return 404 for deleting a non-existent job ID", async () => {
      const res = await request(app)
        .delete("/jobs/999999999999999999999999")
        .set("Authorization", `Bearer ${authToken}`) // Include the JWT token in the header
        .expect(404); // Expect Not Found status
      expect(res.body).toHaveProperty("message", "Job not found"); // Assuming your error message
    });
  });
});
