'use client';
export default function RoutePlanner({ jobs = [] }) {
const items = Array.isArray(jobs) ? jobs : [];
return (
<div className="panel">
<h2>Route Planner</h2>
<p>{items.length} jobs found.</p>
</div>
);
}
