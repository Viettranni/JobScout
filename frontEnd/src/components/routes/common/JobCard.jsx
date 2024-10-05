import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  BookmarkIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import indeedLogo from "../../../assets/indeed.png";
import duunitoriLogo from "../../../assets/duunitori.png";
import joblyLogo from "../../../assets/jobly.jpg";
import oikotieLogo from "../../../assets/oikotie.png";
import tePalvelutLogo from "../../../assets/tePalvelut.png";
import defaultLogo from "../../../assets/default.png";

// Fallback and dynamic logos
const logos = {
  indeed: indeedLogo,
  duunitori: duunitoriLogo,
  jobly: joblyLogo,
  oikotie: oikotieLogo,
  tePalvelut: tePalvelutLogo,
  default: defaultLogo,
};

export function JobCard({
  job,
  isSaved,
  toggleSave,
  isExpanded,
  toggleExpand,
}) {
  // Determine which logo to show based on job.logo or fallback to default
  const logoPath = logos[job.logo] || logos.default;

  // Check if user is authenticated
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

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
                    className={`w-5 h-5 ${isSaved ? "fill-primary" : ""}`}
                  />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between mt-2">
              <div className="flex flex-wrap items-center">
                <p className="text-sm text-muted-foreground flex items-center mr-4">
                  <MapPinIcon className="w-4 h-4 mr-1" /> {job.location}
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                {/* View Listing Button */}
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

                {/* Generate Cover Letter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-indigo-400 hover:bg-hover hover:text-white"
                  onClick={() => console.log("Generate Cover Letter clicked")}
                >
                  Generate Cover Letter
                </Button>

                {/* Apply Now Button */}
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
