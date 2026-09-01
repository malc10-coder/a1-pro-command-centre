'use client';
export default function RoutePlanner({ jobs = [] }) {
return (
<div className="panel">
<h2>Route Planner</h2>
<p>{jobs.length} jobs found.</p>
);
}
