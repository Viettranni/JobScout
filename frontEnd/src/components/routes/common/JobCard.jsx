import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BookmarkIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import indeedLogo from "../../../assets/indeed.png";
import duunitoriLogo from "../../../assets/duunitori.png";
import joblyLogo from "../../../assets/jobly.jpg";
import oikotieLogo from "../../../assets/oikotie.png";
import tePalvelutLogo from "../../../assets/tePalvelut.png";
import defaultLogo from "../../../assets/default.png";
import { useGenerateCoverLetter } from "@/components/hooks/useGenerateCoverLetter";
import { formatDistanceToNow } from "date-fns";
import { parse } from "date-fns"; // Import parse for custom dates

// Fallback and dynamic logos
const logos = {
  indeed: indeedLogo,
  duunitori: duunitoriLogo,
  jobly: joblyLogo,
  oikotie: oikotieLogo,
  tePalvelut: tePalvelutLogo,
  default: defaultLogo,
};

// Utility function to parse special date formats
const parseDatePosted = (datePosted, source) => {
  // Handle Duunitori and Oikotie cases
  if (source === "duunitori" || source === "oikotie") {
    const regex = /Julkaistu (\d{1,2}\.\d{1,2}\.)/; // Extract dates like "7.10." or "3.10."
    const match = datePosted.match(regex);
    if (match) {
      const dateString = match[1] + new Date().getFullYear(); // Add current year
      return parse(dateString, "d.M.yyyy", new Date());
    }
  }

  // Handle TePalvelut closing date case
  if (source === "tePalvelut") {
    const teRegex = /(\d{2}\.\d{2}\.\d{4}) klo (\d{2}:\d{2})/; // Extract date and time like "24.11.2024 klo 02:00"
    const match = datePosted.match(teRegex);
    if (match) {
      const dateString = `${match[1]} ${match[2]}`; // Combine date and time
      return parse(dateString, "dd.MM.yyyy HH:mm", new Date());
    }
  }

  // Handle Jobly closing date case
  if (source === "jobly") {
    const teRegex = /(\d{2}\.\d{2}\.\d{4})/; // Extract date like "11.10.2024"

    const match = datePosted.match(teRegex);
    if (match) {
      const dateString = match[1]; // Combine date and time
      return parse(dateString, "dd.MM.yyyy", new Date());
    }
  }

  // For any other source or unrecognized format, return null
  return null;
};

export function JobCard({
  job,
  isSaved,
  toggleSave,
  isExpanded,
  toggleExpand,
}) {
  const { isGenerating, generateCoverLetter } = useGenerateCoverLetter();
  const logoPath = logos[job.logo] || logos.default;
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const text = job.description;

  // Validate the datePosted field and handle different formats
  const isValidDate = (date) => !isNaN(Date.parse(date));

  let timeAgo = "Date not available"; // Default fallback for invalid/missing dates

  // Special logic for TePalvelut (closing date)
  if (job.logo === "tePalvelut") {
    let closingDate = parseDatePosted(job.datePosted, "tePalvelut");

    if (closingDate && closingDate > new Date()) {
      timeAgo = `Closes in ${formatDistanceToNow(closingDate, {
        addSuffix: true,
      })}`;
    } else {
      timeAgo = "Closing date unavailable";
    }
  } else {
    // Check for custom date parsing for other sources
    let parsedDate = parseDatePosted(job.datePosted, job.logo);

    // If parsedDate is still null, try the default date parsing
    if (!parsedDate && job.datePosted && isValidDate(job.datePosted)) {
      parsedDate = new Date(job.datePosted); // Default date handling
    }

    // Format the date if valid
    if (parsedDate) {
      const now = new Date();
      const maxPastDate = new Date(now.getFullYear() - 10, now.getMonth()); // 10 years in the past

      if (parsedDate < maxPastDate || parsedDate > now) {
        timeAgo = "Invalid date"; // Date is outside of acceptable range
      } else {
        timeAgo = `Posted ${formatDistanceToNow(parsedDate, {
          addSuffix: true,
        })}`;
      }
    }
  }

  console.log(job.datePosted);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start">
          <img
            src={logoPath}
            alt={`${job.company} logo`}
            className="w-12 h-12 mr-4 mt-1 rounded-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = logos.default; // Fallback to default logo
            }}
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="p-2"
                  onClick={toggleSave}
                  aria-label={isSaved ? "Unsave job" : "Save job"}
                >
                  <BookmarkIcon
                    className={`w-5 h-5 ${
                      isSaved ? "fill-primary text-primary" : ""
                    }`}
                  />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between mt-2">
              <div className="flex flex-wrap items-center">
                <p className="text-sm text-muted-foreground flex items-center mr-4">
                  <MapPinIcon className="w-4 h-4 mr-1" /> {job.location}
                </p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" /> {timeAgo}
                </p>{" "}
                {/* Displaying the posted or closing date */}
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button onClick={toggleExpand} variant="outline" size="sm">
                  {isExpanded ? (
                    <>
                      Hide Details
                      <ChevronUpIcon className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View Listing
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-indigo-400 hover:bg-hover hover:text-white hidden sm:block"
                    onClick={() => generateCoverLetter(text)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Cover Letter"}
                  </Button>
                )}

                <Button asChild className="bg-primary hover:bg-hover" size="sm">
                  <Link to={`${job.url}`} target="_blank">
                    Apply Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">Job Description</h4>
            <p>{job.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
