const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../app"); // Adjust the path according to your app structure
const { JobPost } = require("../src/models/JobPost");

// Mock individual scrapers
jest.mock("../src/scrapers/duuniTori", () => jest.fn());
jest.mock("../src/scrapers/indeed", () => jest.fn());
jest.mock("../src/scrapers/jobly", () => jest.fn());
jest.mock("../src/scrapers/oikotie", () => jest.fn());
jest.mock("../src/scrapers/tePalvelut", () => jest.fn());

const duuniTori = require("../src/scrapers/duuniTori");
const indeed = require("../src/scrapers/indeed");
const jobly = require("../src/scrapers/jobly");
const oikotie = require("../src/scrapers/oikotie");
const tePalvelut = require("../src/scrapers/tePalvelut");

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

  describe("Authentication scenarios", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app)
        .post("/api/jobs/duunitori/scrape-jobs")
        .query({ page: 1, city: "Helsinki", searchTerm: "Engineer" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("No token provided");
    });

    it("should return 401 if an invalid token is provided", async () => {
      const res = await request(app)
        .post("/api/jobs/duunitori/scrape-jobs")
        .set("Authorization", "Bearer invalidtoken")
        .query({ page: 1, city: "Helsinki", searchTerm: "Engineer" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid token");
    });
  });

  describe("POST /api/jobs/allsites/scrape-jobs", () => {
    // Test: Successful job scraping and saving
    it("should successfully scrape and save new jobs", async () => {
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          datePosted: new Date().toISOString(),
          url: "http://example.com",
        },
      ];

      // Mock the scrapers to return the jobs
      duuniTori.mockResolvedValue(mockJobs);
      indeed.mockResolvedValue(mockJobs);
      jobly.mockResolvedValue(mockJobs);
      oikotie.mockResolvedValue(mockJobs);
      tePalvelut.mockResolvedValue(mockJobs);

      const res = await request(app)
        .post("/api/jobs/allsites/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(201);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("5 jobsites scraped");
      expect(res.body.message).toContain("new job post/s saved");
    });

    // Test: Handling case when no new jobs are found (duplicates)
    it("should handle case when no new jobs are found (duplicates)", async () => {
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          datePosted: new Date().toISOString(),
          url: "http://example.com",
        },
      ];

      duuniTori.mockResolvedValue(mockJobs);
      indeed.mockResolvedValue(mockJobs);
      jobly.mockResolvedValue(mockJobs);
      oikotie.mockResolvedValue(mockJobs);
      tePalvelut.mockResolvedValue(mockJobs);

      // Insert the mock job into the database first
      await JobPost.insertMany(mockJobs);

      const res = await request(app)
        .post("/api/jobs/allsites/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("Database already has the newest.");
    });

    // Test: Scraper failure but others succeed
    it("should handle partial scraper failures but still save successful jobs", async () => {
      const mockJobs = [
        {
          title: "Developer",
          company: "Tech Inc",
          location: "Remote",
          datePosted: new Date().toISOString(),
          url: "http://example.com",
        },
      ];

      // Simulate an error in duuniTori scraper
      duuniTori.mockRejectedValue(new Error("duuniTori error"));

      // Other scrapers succeed
      indeed.mockResolvedValue(mockJobs);
      jobly.mockResolvedValue(mockJobs);
      oikotie.mockResolvedValue(mockJobs);
      tePalvelut.mockResolvedValue(mockJobs);

      const res = await request(app)
        .post("/api/jobs/allsites/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("jobsites scraped");
      expect(res.body.message).toContain("new job post/s saved");
      // expect(res.body.message).toContain("Some scrapers failed: duuniTori");
    });

    // Test: All scrapers fail
    it("should return 500 if all scrapers fail", async () => {
      // Simulate all scrapers failing
      duuniTori.mockRejectedValue(new Error("duuniTori error"));
      indeed.mockRejectedValue(new Error("indeed error"));
      jobly.mockRejectedValue(new Error("jobly error"));
      oikotie.mockRejectedValue(new Error("oikotie error"));
      tePalvelut.mockRejectedValue(new Error("tePalvelut error"));

      const res = await request(app)
        .post("/api/jobs/allsites/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(500);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("Job scraping failed");
    });
  });

  describe("POST /duunitori/scrape-jobs", () => {
    // Test: Successful job scraping and saving
    it("should successfully scrape and save new DuuniTori jobs", async () => {
      const mockJobs = [
        {
          title: "Engineer",
          company: "Duuni Corp",
          location: "Helsinki",
          datePosted: new Date().toISOString(),
          url: "http://duunitori.com/job1",
        },
      ];

      // Mock the DuuniTori scraper to return the jobs
      duuniTori.mockResolvedValue(mockJobs);

      const res = await request(app)
        .post("/api/jobs/duunitori/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ page: 1, city: "Helsinki", searchTerm: "Engineer" })
        .expect(201);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("1 page/s scraped");
      expect(res.body.message).toContain("new job post/s saved");
    });

    // Test: Handling case when no new DuuniTori jobs are found (duplicates)
    it("should handle case when no new DuuniTori jobs are found (duplicates)", async () => {
      const mockJobs = [
        {
          title: "Engineer",
          company: "Duuni Corp",
          location: "Helsinki",
          datePosted: new Date().toISOString(),
          url: "http://duunitori.com/job1",
        },
      ];

      // Mock the DuuniTori scraper to return the jobs
      duuniTori.mockResolvedValue(mockJobs);

      // Insert the mock job into the database first
      await JobPost.insertMany(mockJobs);

      const res = await request(app)
        .post("/api/jobs/duunitori/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ page: 1, city: "Helsinki", searchTerm: "Engineer" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("Database already has the newest.");
    });

    // Test: DuuniTori scraper failure
    it("should return 500 if DuuniTori scraper fails", async () => {
      // Simulate an error in the DuuniTori scraper
      duuniTori.mockRejectedValue(new Error("DuuniTori scraper error"));

      const res = await request(app)
        .post("/api/jobs/duunitori/scrape-jobs")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ page: 1, city: "Helsinki", searchTerm: "Engineer" })
        .expect(500);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("Error scraping jobs.");
    });
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
