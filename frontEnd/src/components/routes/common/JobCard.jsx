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
import defaultJob from "../../../assets/defaultJob.png";

export function JobCard({
  job,
  isSaved,
  toggleSave,
  isExpanded,
  toggleExpand,
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start">
          <img
            src={defaultJob /*job.logo*/}
            alt={`${job.company} logo`}
            className="w-12 h-12 mr-4 mt-1"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
              <Button
                variant="ghost"
                className="p-2"
                onClick={toggleSave} // Make sure the toggleSave prop is passed correctly
                aria-label={isSaved ? "Unsave job" : "Save job"}
              >
                <BookmarkIcon
                  className={`w-5 h-5 ${isSaved ? "fill-primary" : ""}`} // Style changes based on save state
                />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between mt-2">
              <div className="flex flex-wrap items-center">
                <p className="text-sm text-muted-foreground flex items-center mr-4">
                  <MapPinIcon className="w-4 h-4 mr-1" /> {job.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(job.types) && job.types.length > 0 ? (
                    job.types.map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <p>No Types</p> // Fallback if types array is undefined or empty
                  )}
                </div>
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
