'use client';

import { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  UserRound,
  Package,
  Settings,
  Plus,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  Navigation,
  ClipboardList,
  Wrench,
  Trash2,
} from 'lucide-react';

const engineers = [
  {
    id: 1,
    name: 'Dave Wilson',
    phone: '07700 900001',
    status: 'Available',
  },
  {
    id: 2,
    name: 'Mike Taylor',
    phone: '07700 900002',
    status: 'On Job',
  },
  {
    id: 3,
    name: 'Steve Harris',
    phone: '07700 900003',
    status: 'Available',
  },
];

const startingJobs = [
  {
    id: 1,
    title: 'Boiler Service',
    customer: 'John Smith',
    phone: '07700 111111',
    address: '12 High Street, London',
    postcode: 'SW1A 1AA',
    engineer: 'Dave Wilson',
    date: '2026-09-01',
    time: '09:00',
    status: 'Scheduled',
    notes: 'Annual boiler service.',
  },
  {
    id: 2,
    title: 'Electrical Inspection',
    customer: 'Sarah Jones',
    phone: '07700 222222',
    address: '44 Station Road, Kent',
    postcode: 'ME1 1AA',
    engineer: 'Mike Taylor',
    date: '2026-09-02',
    time: '10:30',
    status: 'In Progress',
    notes: 'Full electrical inspection.',
  },
  {
    id: 3,
    title: 'Emergency Repair',
    customer: 'Paul Brown',
    phone: '07700 333333',
    address: '8 Church Lane, Essex',
    postcode: 'CM1 1AA',
    engineer: 'Steve Harris',
    date: '2026-09-03',
    time: '14:00',
    status: 'Pending',
    notes: 'Customer reported an urgent issue.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [jobs, setJobs] = useState(startingJobs);
  const [search, setSearch] = useState('');
  const [showNewJob, setShowNewJob] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [draggedJob, setDraggedJob] = useState(null);

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return jobs;

    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(term) ||
        job.customer.toLowerCase().includes(term) ||
        job.address.toLowerCase().includes(term) ||
        job.engineer.toLowerCase().includes(term)
      );
    });
  }, [jobs, search]);

  const todayJobs = jobs.filter((job) => job.status === 'Scheduled').length;

  const inProgress = jobs.filter(
    (job) => job.status === 'In Progress'
  ).length;

  const completed = jobs.filter(
    (job) => job.status === 'Completed'
  ).length;

  function addJob(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const newJob = {
      id: Date.now(),
      title: form.get('title') || 'New Job',
      customer: form.get('customer') || 'New Customer',
      phone: form.get('phone') || '',
      postcode: form.get('postcode') || '',
      address: form.get('address') || '',
      engineer: form.get('engineer') || 'Unassigned',
      date: form.get('date') || new Date().toISOString().split('T')[0],
      time: form.get('time') || '09:00',
      status: 'Scheduled',
      notes: form.get('notes') || '',
    };

    setJobs((currentJobs) => [newJob, ...currentJobs]);

    setShowNewJob(false);
  }

  function deleteJob(id) {
    const confirmed = window.confirm('Delete this job?');

    if (!confirmed) return;

    setJobs((currentJobs) =>
      currentJobs.filter((job) => job.id !== id)
    );

    setSelectedJob(null);
  }

  function updateJobStatus(id, status) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id ? { ...job, status } : job
      )
    );
  }

  function handleDrop(date) {
    if (!draggedJob) return;

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === draggedJob.id
          ? { ...job, date }
          : job
      )
    );

    setDraggedJob(null);
  }

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Jobs', icon: Briefcase },
    { name: 'Calendar', icon: CalendarDays },
{ name: 'Routes', icon: MapPin },
{ name: 'Customers', icon: Users },   
    { name: 'Engineers', icon: UserRound },
    { name: 'Materials', icon: Package },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className="app-shell">

        {/* SIDEBAR */}

        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">A1</div>

            <div>
              <h2>A1 Pro</h2>
              <p>Command Centre</p>
            </div>
          </div>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={
                    activeTab === item.name
                      ? 'nav-item active'
                      : 'nav-item'
                  }
                  onClick={() => setActiveTab(item.name)}
                >
                  <Icon size={19} />

                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-avatar">M</div>

            <div>
              <strong>Malc</strong>
              <span>Administrator</span>
            </div>
          </div>
        </aside>

        {/* MAIN */}

        <main className="main-content">

          <header className="topbar">
            <div>
              <h1>{activeTab}</h1>

              <p>
                A1 Pro Command Centre
              </p>
            </div>

            <div className="topbar-actions">
              <button
                className="phone-app-button"
                onClick={() => setShowMobile(true)}
              >
                <Menu size={18} />

                Engineer App
              </button>

              <button
                className="primary-button"
                onClick={() => setShowNewJob(true)}
              >
                <Plus size={19} />

                New Job
              </button>
            </div>
          </header>

          {/* DASHBOARD */}

          {activeTab === 'Dashboard' && (
            <div className="page-content">

              <div className="stats-grid">

                <StatCard
                  icon={<Briefcase />}
                  title="Total Jobs"
                  value={jobs.length}
                />

                <StatCard
                  icon={<Clock />}
                  title="Scheduled"
                  value={todayJobs}
                />

                <StatCard
                  icon={<AlertCircle />}
                  title="In Progress"
                  value={inProgress}
                />

                <StatCard
                  icon={<CheckCircle2 />}
                  title="Completed"
                  value={completed}
                />

              </div>

              <section className="panel">

                <div className="panel-header">
                  <div>
                    <h2>Recent Jobs</h2>

                    <p>
                      Latest jobs across your business
                    </p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActiveTab('Jobs')}
                  >
                    View all jobs
                  </button>
                </div>

                <JobTable
                  jobs={jobs.slice(0, 6)}
                  onSelect={setSelectedJob}
                />

              </section>

              <div className="dashboard-grid">

                <section className="panel">

                  <div className="panel-header">
                    <div>
                      <h2>Engineers</h2>

                      <p>
                        Current engineer status
                      </p>
                    </div>
                  </div>

                  <div className="engineer-list">

                    {engineers.map((engineer) => {
                      const assignedJobs = jobs.filter(
                        (job) =>
                          job.engineer === engineer.name
                      ).length;

                      return (
                        <div
                          className="engineer-row"
                          key={engineer.id}
                        >
                          <div className="engineer-avatar">
                            {engineer.name.charAt(0)}
                          </div>

                          <div className="engineer-info">
                            <strong>{engineer.name}</strong>

                            <span>
                              {assignedJobs} jobs assigned
                            </span>
                          </div>

                          <span
                            className={
                              engineer.status === 'Available'
                                ? 'status available'
                                : 'status progress'
                            }
                          >
                            {engineer.status}
                          </span>
                        </div>
                      );
                    })}

                  </div>

                </section>

                <section className="panel quick-actions">

                  <h2>Quick Actions</h2>

                  <button
                    onClick={() => setShowNewJob(true)}
                  >
                    <Plus size={19} />

                    Create New Job
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab('Calendar')
                    }
                  >
                    <CalendarDays size={19} />

                    Open Calendar
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab('Engineers')
                    }
                  >
                    <Users size={19} />

                    Manage Engineers
                  </button>

                </section>

              </div>

            </div>
          )}

          {/* JOBS */}

          {activeTab === 'Jobs' && (
            <div className="page-content">

              <section className="panel">

                <div className="toolbar">

                  <div className="search-box">
                    <Search size={19} />

                    <input
                      type="text"
                      placeholder="Search jobs, customers, addresses..."
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                    />
                  </div>

                  <span className="job-count">
                    {filteredJobs.length} jobs
                  </span>

                </div>

                <JobTable
                  jobs={filteredJobs}
                  onSelect={setSelectedJob}
                />

              </section>

            </div>
          )}

          {/* CALENDAR */}

          {activeTab === 'Calendar' && (
            <div className="page-content">

              <section className="panel">

                <div className="calendar-header">

                  <button
                    className="icon-button"
                    onClick={() =>
                      setCalendarDate(
                        new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() - 1,
                          1
                        )
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>

                  <div>
                    <h2>
                      {calendarDate.toLocaleString(
                        'default',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </h2>

                    <p>
                      Drag jobs between days
                    </p>
                  </div>

                  <button
                    className="icon-button"
                    onClick={() =>
                      setCalendarDate(
                        new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() + 1,
                          1
                        )
                      )
                    }
                  >
                    <ChevronRight />
                  </button>

                </div>

                <div className="calendar-grid">

                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (day) => (
                      <div
                        className="calendar-day-name"
                        key={day}
                      >
                        {day}
                      </div>
                    )
                  )}

                  {Array.from({ length: 35 }).map(
                    (_, index) => {
                      const date = new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth(),
                        index - 4
                      );

                      const dateString = date
                        .toISOString()
                        .split('T')[0];

                      const dayJobs = jobs.filter(
                        (job) => job.date === dateString
                      );

                      return (
                        <div
                          key={index}
                          className="calendar-day"
                          onDragOver={(event) =>
                            event.preventDefault()
                          }
                          onDrop={() =>
                            handleDrop(dateString)
                          }
                        >
                          <strong>
                            {date.getDate()}
                          </strong>

                          <div className="calendar-jobs">

                            {dayJobs.map((job) => (
                              <div
                                key={job.id}
                                draggable
                                onDragStart={() =>
                                  setDraggedJob(job)
                                }
                                className="calendar-job"
                                onClick={() =>
                                  setSelectedJob(job)
                                }
                              >
                                <span>
                                  {job.time}
                                </span>

                                <strong>
                                  {job.title}
                                </strong>

                                <small>
                                  {job.engineer}
                                </small>
                              </div>
                            ))}

                          </div>
                        </div>
                      );
                    }
                  )}

                </div>

              </section>

            </div>
          )}

          {/* CUSTOMERS */}

          {activeTab === 'Customers' && (
            <div className="page-content">

              <section className="panel">

                <div className="empty-state">

                  <Users size={50} />

                  <h2>Customer Management</h2>

                  <p>
                    Customers will automatically build up
                    from the jobs you create.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => setShowNewJob(true)}
                  >
                    <Plus size={18} />

                    Add Customer Through New Job
                  </button>

                </div>

              </section>

            </div>
          )}

          {/* ENGINEERS */}

          {activeTab === 'Engineers' && (
            <div className="page-content">

              <div className="engineer-cards">

                {engineers.map((engineer) => {
                  const engineerJobs = jobs.filter(
                    (job) =>
                      job.engineer === engineer.name
                  );

                  return (
                    <section
                      className="engineer-card"
                      key={engineer.id}
                    >
                      <div className="large-avatar">
                        {engineer.name.charAt(0)}
                      </div>

                      <h2>{engineer.name}</h2>

                      <p>{engineer.phone}</p>

                      <span
                        className={
                          engineer.status === 'Available'
                            ? 'status available'
                            : 'status progress'
                        }
                      >
                        {engineer.status}
                      </span>

                      <div className="engineer-job-number">
                        {engineerJobs.length}
                        <small>Jobs Assigned</small>
                      </div>

                      <button
                        className="secondary-button"
                        onClick={() => setShowMobile(true)}
                      >
                        Open Engineer App
                      </button>

                    </section>
                  );
                })}

              </div>

            </div>
          )}

          {/* MATERIALS */}

          {activeTab === 'Materials' && (
            <div className="page-content">

              <section className="panel">

                <div className="empty-state">

                  <Package size={50} />

                  <h2>Materials</h2>

                  <p>
                    Material requests and stock management
                    will appear here.
                  </p>

                </div>

              </section>

            </div>
          )}

          {/* SETTINGS */}

          {activeTab === 'Settings' && (
            <div className="page-content">

              <section className="panel">

                <div className="empty-state">

                  <Settings size={50} />

                  <h2>System Settings</h2>

                  <p>
                    Company settings and integrations.
                  </p>

                </div>

              </section>

            </div>
          )}

        </main>

      </div>

      {/* NEW JOB MODAL */}

      {showNewJob && (
        <div className="modal-overlay">

          <form
            className="modal"
            onSubmit={addJob}
          >

            <div className="modal-header">

              <div>
                <h2>Create New Job</h2>

                <p>
                  Add a job and assign an engineer
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowNewJob(false)}
              >
                <X />
              </button>

            </div>

            <div className="form-grid">

              <label>
                Job Title

                <input
                  name="title"
                  required
                  placeholder="e.g. Boiler Service"
                />
              </label>

              <label>
                Customer Name

                <input
                  name="customer"
                  required
                  placeholder="Customer name"
                />
              </label>

              <label>
                Phone Number

                <input
                  name="phone"
                  placeholder="Customer telephone number"
                />
              </label>

              <label>
                Postcode

                <div className="postcode-input">

                  <input
                    name="postcode"
                    placeholder="Enter postcode"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'Postcode lookup will be connected to the address API next.'
                      )
                    }
                  >
                    Lookup
                  </button>

                </div>

              </label>

              <label className="full-width">
                Full Address

                <div className="input-with-icon">
                  <MapPin size={18} />

                  <input
                    name="address"
                    required
                    placeholder="Full property address"
                  />
                </div>

              </label>

              <label>
                Date

                <input
                  name="date"
                  type="date"
                  required
                />
              </label>

              <label>
                Time

                <input
                  name="time"
                  type="time"
                  required
                />
              </label>

              <label>
                Assign Engineer

                <select name="engineer">
                  {engineers.map((engineer) => (
                    <option
                      key={engineer.id}
                      value={engineer.name}
                    >
                      {engineer.name}
                    </option>
                  ))}

                  <option value="Unassigned">
                    Unassigned
                  </option>

                </select>

              </label>

              <label className="full-width">
                Job Notes

                <textarea
                  name="notes"
                  placeholder="Job details and notes..."
                />

              </label>

            </div>

            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowNewJob(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Create Job
              </button>

            </div>

          </form>

        </div>
      )}

      {/* JOB DETAILS */}

      {selectedJob && (
        <div className="modal-overlay">

          <div className="modal job-details">

            <div className="modal-header">

              <div>
                <h2>{selectedJob.title}</h2>

                <p>
                  Job #{selectedJob.id}
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => setSelectedJob(null)}
              >
                <X />
              </button>

            </div>

            <div className="details-grid">

              <Detail
                icon={<Users />}
                title="Customer"
                value={selectedJob.customer}
              />

              <Detail
                icon={<Phone />}
                title="Phone"
                value={selectedJob.phone || 'Not supplied'}
              />

              <Detail
                icon={<MapPin />}
                title="Address"
                value={selectedJob.address}
              />

              <Detail
                icon={<UserRound />}
                title="Engineer"
                value={selectedJob.engineer}
              />

              <Detail
                icon={<CalendarDays />}
                title="Date"
                value={selectedJob.date}
              />

              <Detail
                icon={<Clock />}
                title="Time"
                value={selectedJob.time}
              />

            </div>

            <div className="notes-box">

              <h3>Job Notes</h3>

              <p>
                {selectedJob.notes || 'No notes added.'}
              </p>

            </div>

            <div className="status-actions">

              <button
                onClick={() => {
                  updateJobStatus(
                    selectedJob.id,
                    'Scheduled'
                  );

                  setSelectedJob({
                    ...selectedJob,
                    status: 'Scheduled',
                  });
                }}
              >
                Scheduled
              </button>

              <button
                onClick={() => {
                  updateJobStatus(
                    selectedJob.id,
                    'In Progress'
                  );

                  setSelectedJob({
                    ...selectedJob,
                    status: 'In Progress',
                  });
                }}
              >
                Start Job
              </button>

              <button
                onClick={() => {
                  updateJobStatus(
                    selectedJob.id,
                    'Completed'
                  );

                  setSelectedJob({
                    ...selectedJob,
                    status: 'Completed',
                  });
                }}
              >
                Complete
              </button>

            </div>

            <button
              className="delete-button"
              onClick={() => deleteJob(selectedJob.id)}
            >
              <Trash2 size={18} />

              Delete Job
            </button>

          </div>

        </div>
      )}

      {/* ENGINEER PHONE APP */}

      {showMobile && (
        <div className="mobile-overlay">

          <div className="phone">

            <div className="phone-top">

              <div>
                <small>A1 PRO</small>

                <h2>Engineer App</h2>
              </div>

              <button
                onClick={() => setShowMobile(false)}
              >
                <X />
              </button>

            </div>

            <div className="phone-user">

              <div className="large-avatar">
                D
              </div>

              <div>
                <strong>Dave Wilson</strong>

                <span>Today's Jobs</span>
              </div>

            </div>

            <div className="phone-jobs">

              {jobs
                .filter(
                  (job) =>
                    job.engineer === 'Dave Wilson'
                )
                .map((job) => (
                  <div
                    className="phone-job"
                    key={job.id}
                  >
                    <span className="phone-time">
                      {job.time}
                    </span>

                    <h3>{job.title}</h3>

                    <p>{job.customer}</p>

                    <small>
                      {job.address}
                    </small>

                    <div className="phone-job-actions">

                      <button>
                        <Navigation size={17} />
                        Navigate
                      </button>

                      <button
                        onClick={() =>
                          setSelectedJob(job)
                        }
                      >
                        <ClipboardList size={17} />
                        Details
                      </button>

                    </div>

                  </div>
                ))}

            </div>

          </div>

        </div>
      )}

    </>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <article className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>

    </article>
  );
}

function JobTable({ jobs, onSelect }) {
  return (
    <div className="job-table">

      <div className="job-table-header">

        <span>Job</span>
        <span>Customer</span>
        <span>Engineer</span>
        <span>Date & Time</span>
        <span>Status</span>

      </div>

      {jobs.map((job) => (
        <button
          className="job-row"
          key={job.id}
          onClick={() => onSelect(job)}
        >

          <span>
            <strong>{job.title}</strong>

            <small>{job.address}</small>
          </span>

          <span>
            {job.customer}
          </span>

          <span>
            {job.engineer}
          </span>

          <span>
            <strong>{job.date}</strong>

            <small>{job.time}</small>
          </span>

          <span>
            <StatusBadge status={job.status} />
          </span>

        </button>
      ))}

      {!jobs.length && (
        <div className="no-results">

          No jobs found.

        </div>
      )}

    </div>
  );
}

function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .replaceAll(' ', '-');

  return (
    <span className={`status ${className}`}>
      {status}
    </span>
  );
}

function Detail({ icon, title, value }) {
  return (
    <div className="detail-item">

      <div className="detail-icon">
        {icon}
      </div>

      <div>
        <small>{title}</small>

        <strong>{value}</strong>
      </div>

    </div>
  );
}
