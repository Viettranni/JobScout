import React, { useState } from 'react';
import { Link } from "react-router-dom";
import profileImage from "../../../assets/profile.png"
import defaultJob from "../../../assets/defaultJob.png" 
// import img from 'next/img';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, MapPinIcon, ChevronDownIcon, ChevronUpIcon, ChevronRightIcon  } from 'lucide-react'

export default function SavedJobs() {
  const [expandedJob, setExpandedJob] = useState(null)
  const [savedJobs, setSavedJobs] = useState([
    { id: 1, title: 'Full Stack Developer', company: 'Twitter', location: 'Finland, Espoo', types: ['Fulltime', 'Distant', 'Project work'], logo: '/twitter-logo.png', saved: true },
    { id: 2, title: 'Full Stack Developer', company: 'Spotify', location: 'Finland, Espoo', types: ['Distant', 'Project work'], logo: '/spotify-logo.png', saved: true },
    { id: 3, title: 'Full Stack Developer', company: 'Duunitori', location: 'Finland, Espoo', types: ['Fulltime', 'Distant'], logo: '/duunitori-logo.png', saved: true },
    { id: 4, title: 'Full Stack Developer', company: 'CodeHeart', location: 'Finland, Espoo', types: ['Fulltime', 'Distant', 'Project work'], logo: '/codeheart-logo.png', saved: true },
  ]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs(jobs => jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  // const toggleSaveJob = (jobId) => {
  //   setSavedJobs(prev => ({
  //     ...prev,
  //     [jobId]: !prev[jobId]
  //   }))
  // }

  const toggleJobExpansion = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Assuming we have 3 pages

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
        <div className="flex items-center">
          <img src={profileImage} alt="Abdul Jabaar" width={80} height={80} className="rounded-full mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Abdul Jabaar</h1>
            <p>Email: Abdulka@givemeurmoney.com</p>
            <p>Phone: +358524379993</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Saved pages</h2>

      
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              <div className="flex items-start">
                <img src={defaultJob /*job.logo*/} alt={`${job.company} logo`} className="w-12 h-12 mr-4 mt-1" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="p-2"
                      onClick={() => toggleSaveJob(job.id)}
                      aria-label={savedJobs[job.id] ? "Unsave job" : "Save job"}
                    >
                      <BookmarkIcon className={`w-5 h-5 ${savedJobs[job.id] ? 'fill-primary' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between mt-2">
                    <div className="flex flex-wrap items-center">
                      <p className="text-sm text-muted-foreground flex items-center mr-4">
                        <MapPinIcon className="w-4 h-4 mr-1" /> {job.location}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.types.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <Button onClick={() => toggleJobExpansion(job.id)} variant="outline" size="sm">
                        {expandedJob === job.id ? (
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
                      <Button asChild className="bg-primary hover:bg-indigo-800" size="sm">
                        <Link href={`/apply/${job.id}`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {expandedJob === job.id && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
{/* 
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={job.logo} alt={`${job.company} logo`} width={40} height={40} className="mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => toggleSaveJob(job.id)}
                  className="p-2"
                  aria-label={job.saved ? "Unsave job" : "Save job"}
                >
                  <BookmarkIcon className={`w-5 h-5 ${job.saved ? 'fill-blue-500' : ''}`} />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.types.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Button variant="outline" onClick={() => alert(`View listing for ${job.title}`)}>
                  View Listing
                </Button>
                <Button onClick={() => alert(`Apply now for ${job.title}`)}>
                  Apply now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <div className="mt-8 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next Page <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
        <div className="space-x-2">
          {[1, 2, 3].map(page => (
            <Button 
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}