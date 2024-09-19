import { useLocation } from 'react-router-dom';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, MapPinIcon, ChevronDownIcon, ChevronUpIcon, ChevronRightIcon  } from 'lucide-react'
import { Link } from "react-router-dom";
import defaultJob from "../../../assets/defaultJob.png" 

export default function JobSearch() {
  const [jobCategory, setJobCategory] = useState('Job Category')
  const [jobType, setJobType] = useState('Job Type')
  const [workingSchedule, setWorkingSchedule] = useState('Working Schedule')
  const [expandedJob, setExpandedJob] = useState(null)
  const [savedJobs, setSavedJobs] = useState({})

  const jobListings = [
    { id: 1, title: 'Full Stack Developer', company: 'Twitter', location: 'Finland, Espoo', types: ['Fulltime', 'Distant', 'Project work'], logo: '/placeholder.svg?height=40&width=40' },
    { id: 2, title: 'Full Stack Developer', company: 'Spotify', location: 'Finland, Espoo', types: ['Distant', 'Project work'], logo: '/placeholder.svg?height=40&width=40' },
    { id: 3, title: 'Full Stack Developer', company: 'Duunitori', location: 'Finland, Espoo', types: ['Fulltime', 'Distant'], logo: '/placeholder.svg?height=40&width=40' },
    { id: 4, title: 'Full Stack Developer', company: 'CodeHeart', location: 'Finland, Espoo', types: ['Fulltime', 'Distant', 'Project work'], logo: '/placeholder.svg?height=40&width=40' },
  ]

  const toggleJobExpansion = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }))
  }

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Assuming we have 3 pages


  // req from home
  const query = new URLSearchParams(location.search).get('q') || '';

  return (
    <div className="container mx-auto px-4 py-8 lg:w-4/5">
      <div className="flex flex-col sm:flex-row mb-6">
        <Input className="mb-2 sm:mb-0 sm:mr-2" placeholder="Search job title or keyword" />
        <Input className="mb-2 sm:mb-0 sm:mr-2" placeholder="City or municipality" />
        <Button className="bg-primary text-primary-foreground hover:bg-hover">Find Jobs</Button>
      </div>

      <div className="flex flex-wrap mb-6 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{jobCategory}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setJobCategory('IT')}>IT</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setJobCategory('Design')}>Design</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setJobCategory('Marketing')}>Marketing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{jobType}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setJobType('Full-time')}>Full-time</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setJobType('Part-time')}>Part-time</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setJobType('Contract')}>Contract</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{workingSchedule}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setWorkingSchedule('Day')}>Day</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setWorkingSchedule('Night')}>Night</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setWorkingSchedule('Flexible')}>Flexible</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">More</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Salary Range</DropdownMenuItem>
            <DropdownMenuItem>Experience Level</DropdownMenuItem>
            <DropdownMenuItem>Company Size</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">378 Jobs results</h2>
        <p className="text-l font-semibold">for: "{query}"</p>
        {/* <div className="flex justify-between items-center">
          <span>Sort by:</span>
          <Button variant="link">Last Updated</Button>
        </div> */}
      </div>

      <div className="space-y-4">
        {jobListings.map((job) => (
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
                      <Button asChild className="bg-primary hover:bg-hover" size="sm">
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
      {/* <div className="mt-6 flex justify-between items-center">
        <Button variant="outline">Next Page →</Button>
        <div className="space-x-2">
          <Button variant="outline">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">→</Button>
        </div>
      </div> */}
    </div>
  )
}