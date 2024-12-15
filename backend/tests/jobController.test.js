const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../app"); // Adjust the path according to your app structure
const { JobPost } = require("../src/models/JobPost");


let mongoServer;
let authToken;

const mockUser = {
  _id: new mongoose.Types.ObjectId(), // Simulating a MongoDB ObjectId
  username: "testuser",
  role: "user",
};

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  // Set up an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  authToken = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Job API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  describe("GET /api/jobs", () => {
    beforeEach(async () => {
      await JobPost.deleteMany({}); // Ensure the collection is empty
    });

    // Test: Get all jobs
    it("should return all jobs", async () => {
      const now = new Date().toISOString();
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          logo: "TechLogo",
          datePosted: now,
          url: "http://example.com",
          responsibilities: [], // Simulated fields
        },
        {
          title: "Designer",
          company: "Design Co",
          location: "Onsite",
          logo: "DesignLogo",
          datePosted: now,
          url: "http://example2.com",
          responsibilities: [], // Simulated fields
        },
      ];

      // Insert the jobs into the database
      await JobPost.insertMany(mockJobs);

      // Make the GET request to retrieve all jobs
      const res = await request(app)
        .get("/api/jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verify the response structure, including all fields
      expect(res.body.jobs.length).toBe(mockJobs.length); // Ensure the number of jobs matches

      // Check if the response body contains the expected job properties
      expect(res.body.jobs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Developer",
            company: "Tech Inc",
            location: "Remote",
          }),
          expect.objectContaining({
            title: "Designer",
            company: "Design Co",
            location: "Onsite",
          }),
        ])
      );
    });

    // Test: Filter jobs by searchTerm (title)
    it("should filter jobs by searchTerm (case-insensitive)", async () => {
      const now = new Date().toISOString();
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          logo: "TechLogo",
          datePosted: now,
          url: "http://example.com",
          responsibilities: [],
        },
        {
          title: "Designer",
          company: "Design Co",
          location: "Onsite",
          logo: "DesignLogo",
          datePosted: now,
          url: "http://example2.com",
          responsibilities: [],
        },
      ];

      await JobPost.insertMany(mockJobs);

      // Make the GET request to filter jobs by searchTerm 'developer'
      const res = await request(app)
        .get("/api/jobs?searchTerm=developer")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Should return only the Developer job
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].title).toBe("Developer");
    });

    // Test: Filter jobs by city (location)
    it("should filter jobs by city (case-insensitive)", async () => {
      const now = new Date().toISOString();
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          logo: "TechLogo",
          datePosted: now,
          url: "http://example.com",
          responsibilities: [],
        },
        {
          title: "Designer",
          company: "Design Co",
          location: "Onsite",
          logo: "DesignLogo",
          datePosted: now,
          url: "http://example2.com",
          responsibilities: [],
        },
      ];

      await JobPost.insertMany(mockJobs);

      // Make the GET request to filter jobs by city 'remote'
      const res = await request(app)
        .get("/api/jobs?city=remote")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Should return only the Remote job
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].location).toBe("Remote");
    });

    // Test: Filter jobs by logo
    it("should filter jobs by logo (case-insensitive)", async () => {
      const now = new Date().toISOString();
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          logo: "TechLogo",
          datePosted: now,
          url: "http://example.com",
          responsibilities: [],
        },
        {
          title: "Designer",
          company: "Design Co",
          location: "Onsite",
          logo: "DesignLogo",
          datePosted: now,
          url: "http://example2.com",
          responsibilities: [],
        },
      ];

      await JobPost.insertMany(mockJobs);

      // Make the GET request to filter jobs by logo 'TechLogo'
      const res = await request(app)
        .get("/api/jobs?logo=techlogo")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Should return only the job with TechLogo
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].logo).toBe("TechLogo");
    });

    // Test: Combined filtering by searchTerm, city, and logo
    it("should filter jobs by searchTerm, city, and logo combined", async () => {
      const now = new Date().toISOString();
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          logo: "TechLogo",
          datePosted: now,
          url: "http://example.com",
          responsibilities: [],
        },
        {
          title: "Designer",
          company: "Design Co",
          location: "Onsite",
          logo: "DesignLogo",
          datePosted: now,
          url: "http://example2.com",
          responsibilities: [],
        },
      ];

      await JobPost.insertMany(mockJobs);

      // Make the GET request to filter jobs by searchTerm, city, and logo
      const res = await request(app)
        .get("/api/jobs?searchTerm=developer&city=remote&logo=techlogo")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Should return only the Developer job with matching searchTerm, city, and logo
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].title).toBe("Developer");
      expect(res.body.jobs[0].location).toBe("Remote");
      expect(res.body.jobs[0].logo).toBe("TechLogo");
    });
  });

  describe("GET /api/jobs/:id", () => {
    // Test: Get job by ID
    it("should return a job by ID", async () => {
      const now = new Date().toISOString();
      const mockJob = {
        title: "Developer",
        company: "Tech Inc",
        location: "Remote",
        datePosted: now,
        url: "http://example.com",
        _id: "66f926d3df518f925e9eb44d", // Simulated ID
        __v: 0, // Simulated version key
        createdAt: now, // Simulated creation date
        updatedAt: now, // Simulated update date
        responsibilities: [],
      };
      const job = await JobPost.create(mockJob);

      const res = await request(app)
        .get(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verify the response structure, including all fields
      expect(res.body).toEqual(expect.objectContaining(mockJob)); // Use objectContaining for partial matching
    });

    // Test: Return 404 if job not found
    it("should return 404 if job not found", async () => {
      const res = await request(app)
        .get("/api/jobs/60e8c68b1d0e5b4a2c4e2e90") // Assuming this ID does not exist
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("Job posting not found");
    });
  });

  describe("DELETE /api/jobs/:id", () => {
    // Test: Delete job by ID
    it("should delete a job by ID", async () => {
      const mockJob = {
        title: "Developer",
        company: "Tech Inc",
        location: "Remote",
        datePosted: new Date().toISOString(),
        url: "http://example.com",
      };
      const job = await JobPost.create(mockJob);

      const res = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // No response body expected for 204
      expect(res.body).toEqual({});
    });

    // Test: Return 404 if job not found during delete
    it("should return 404 if job not found on delete", async () => {
      const res = await request(app)
        .delete("/api/jobs/60e8c68b1d0e5b4a2c4e2e90") // Assuming this ID does not exist
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(res.body).toEqual({ message: "Job posting not found" });
    });
  });
});
