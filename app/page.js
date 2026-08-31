'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  Package,
  ClipboardList,
  Settings,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Camera,
  Save,
  Trash2,
  Send,
  Download,
  RefreshCw,
  User,
  Building2,
  Navigation,
  FileText,
  ClipboardCheck,
  CircleDollarSign,
} from 'lucide-react';

import { supabase } from '../supabase';

const STORAGE_KEY = 'a1pro-command-centre';

const getStored = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveStored = (key, value) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.log('Unable to save locally');
  }
};

const uid = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const statusColours = {
  New: '#3b82f6',
  Scheduled: '#f59e0b',
  'In Progress': '#8b5cf6',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

const defaultJobs = [
  {
    id: 'demo-1',
    title: 'Boiler Service',
    customer: 'John Smith',
    address: '10 High Street, London',
    postcode: 'SW1A 1AA',
    phone: '07700 900001',
    email: 'john@example.com',
    engineer: 'Unassigned',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'Scheduled',
    description: 'Annual boiler service',
    notes: '',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Electrical Inspection',
    customer: 'Sarah Jones',
    address: '22 Station Road, Croydon',
    postcode: 'CR0 1AA',
    phone: '07700 900002',
    email: 'sarah@example.com',
    engineer: 'Unassigned',
    date: new Date().toISOString().split('T')[0],
    time: '13:00',
    status: 'New',
    description: 'Electrical safety inspection',
    notes: '',
    created_at: new Date().toISOString(),
  },
];

export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [toast, setToast] = useState('');

  const [jobForm, setJobForm] = useState({
    title: '',
    customer: '',
    address: '',
    postcode: '',
    phone: '',
    email: '',
    engineer: 'Unassigned',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'New',
    description: '',
    notes: '',
  });

  const [materialForm, setMaterialForm] = useState({
    item: '',
    quantity: '',
    job: '',
    status: 'Requested',
  });

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Jobs', icon: Briefcase },
    { name: 'Calendar', icon: CalendarDays },
    { name: 'Engineers', icon: Users },
    { name: 'Materials', icon: Package },
    { name: 'Reports', icon: ClipboardList },
    { name: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      saveStored(`${STORAGE_KEY}-jobs`, jobs);
    }
  }, [jobs]);

  useEffect(() => {
    saveStored(`${STORAGE_KEY}-materials`, materials);
  }, [materials]);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast('');
    }, 3000);
  };

  async function loadData() {
    setLoading(true);

    try {
      const localJobs = getStored(`${STORAGE_KEY}-jobs`, []);
      const localMaterials = getStored(`${STORAGE_KEY}-materials`, []);

      if (localJobs.length > 0) {
        setJobs(localJobs);
      } else {
        setJobs(defaultJobs);
      }

      setMaterials(localMaterials);

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error) {
            setSupabaseConnected(true);

            if (data && data.length > 0) {
              setJobs(data);
            }
          }
        } catch {
          setSupabaseConnected(false);
        }
      }
    } catch {
      setJobs(defaultJobs);
    }

    setLoading(false);
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const term = search.toLowerCase();

      return (
        job.title?.toLowerCase().includes(term) ||
        job.customer?.toLowerCase().includes(term) ||
        job.address?.toLowerCase().includes(term) ||
        job.postcode?.toLowerCase().includes(term) ||
        job.status?.toLowerCase().includes(term)
      );
    });
  }, [jobs, search]);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      new: jobs.filter((j) => j.status === 'New').length,
      scheduled: jobs.filter((j) => j.status === 'Scheduled').length,
      progress: jobs.filter((j) => j.status === 'In Progress').length,
      completed: jobs.filter((j) => j.status === 'Completed').length,
    };
  }, [jobs]);

  const today = new Date().toISOString().split('T')[0];

  const todaysJobs = jobs.filter((job) => job.date === today);

  const resetJobForm = () => {
    setJobForm({
      title: '',
      customer: '',
      address: '',
      postcode: '',
      phone: '',
      email: '',
      engineer: 'Unassigned',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      status: 'New',
      description: '',
      notes: '',
    });

    setSelectedJob(null);
  };

  const openNewJob = () => {
    resetJobForm();
    setShowJobModal(true);
  };

  const openEditJob = (job) => {
    setSelectedJob(job);

    setJobForm({
      title: job.title || '',
      customer: job.customer || '',
      address: job.address || '',
      postcode: job.postcode || '',
      phone: job.phone || '',
      email: job.email || '',
      engineer: job.engineer || 'Unassigned',
      date: job.date || '',
      time: job.time || '',
      status: job.status || 'New',
      description: job.description || '',
      notes: job.notes || '',
    });

    setShowJobModal(true);
  };

  const saveJob = async () => {
    if (!jobForm.title || !jobForm.customer) {
      showToast('Please enter a job title and customer');
      return;
    }

    let updatedJob;

    if (selectedJob) {
      updatedJob = {
        ...selectedJob,
        ...jobForm,
      };

      setJobs((current) =>
        current.map((job) =>
          job.id === selectedJob.id ? updatedJob : job
        )
      );

      if (supabaseConnected) {
        try {
          await supabase
            .from('jobs')
            .update(jobForm)
            .eq('id', selectedJob.id);
        } catch {}
      }

      showToast('Job updated successfully');
    } else {
      updatedJob = {
        id: uid(),
        ...jobForm,
        created_at: new Date().toISOString(),
      };

      setJobs((current) => [updatedJob, ...current]);

      if (supabaseConnected) {
        try {
          const { data, error } = await supabase
            .from('jobs')
            .insert([jobForm])
            .select();

          if (!error && data?.[0]) {
            setJobs((current) =>
              current.map((job) =>
                job.id === updatedJob.id ? data[0] : job
              )
            );
          }
        } catch {}
      }

      showToast('New job created');
    }

    setShowJobModal(false);
    resetJobForm();
  };

  const deleteJob = async (job) => {
    if (!confirm(`Delete ${job.title}?`)) return;

    setJobs((current) =>
      current.filter((item) => item.id !== job.id)
    );

    if (supabaseConnected) {
      try {
        await supabase.from('jobs').delete().eq('id', job.id);
      } catch {}
    }

    showToast('Job deleted');
  };

  const changeStatus = (job, status) => {
    const updated = { ...job, status };

    setJobs((current) =>
      current.map((item) =>
        item.id === job.id ? updated : item
      )
    );

    if (supabaseConnected) {
      supabase
        .from('jobs')
        .update({ status })
        .eq('id', job.id);
    }

    showToast(`Job marked as ${status}`);
  };

  const lookupPostcode = async () => {
    if (!jobForm.postcode) {
      showToast('Enter a postcode first');
      return;
    }

    showToast('Postcode lookup ready');

    /*
      This can be connected to:
      postcodes.io
      Google Maps API
      Ideal Postcodes

      once you add your API service.
    */
  };

  const saveMaterial = () => {
    if (!materialForm.item) {
      showToast('Enter a material name');
      return;
    }

    const material = {
      id: uid(),
      ...materialForm,
      created_at: new Date().toISOString(),
    };

    setMaterials((current) => [material, ...current]);

    setMaterialForm({
      item: '',
      quantity: '',
      job: '',
      status: 'Requested',
    });

    setShowMaterialModal(false);

    showToast('Material request created');
  };

  const deleteMaterial = (id) => {
    setMaterials((current) =>
      current.filter((material) => material.id !== id)
    );

    showToast('Material removed');
  };

  const changeMonth = (direction) => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + direction,
        1
      )
    );
  };

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [calendarDate]);

  const monthName = calendarDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const renderDashboard = () => (
    <div className="page-content">

      <div className="page-header">
        <div>
          <h1>Good morning 👋</h1>
          <p>
            Here is what's happening in your business today.
          </p>
        </div>

        <button className="primary-button" onClick={openNewJob}>
          <Plus size={20} />
          New Job
        </button>
      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Jobs"
          value={stats.total}
          icon={Briefcase}
        />

        <StatCard
          title="New Jobs"
          value={stats.new}
          icon={AlertCircle}
        />

        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={CalendarDays}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
        />

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h2>Today's Jobs</h2>
              <p>{todaysJobs.length} jobs scheduled today</p>
            </div>

            <button
              className="text-button"
              onClick={() => setTab('Jobs')}
            >
              View All
            </button>
          </div>

          {todaysJobs.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No jobs today"
              text="Your schedule is clear."
            />
          ) : (
            <div className="job-list">
              {todaysJobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  onClick={() => openEditJob(job)}
                />
              ))}
            </div>
          )}

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <h2>Business Status</h2>
              <p>Live system information</p>
            </div>
          </div>

          <div className="status-list">

            <StatusRow
              label="Supabase"
              value={
                supabaseConnected
                  ? 'Connected'
                  : 'Local Mode'
              }
              good={supabaseConnected}
            />

            <StatusRow
              label="Jobs"
              value={`${jobs.length} total`}
              good
            />

            <StatusRow
              label="Materials"
              value={`${materials.length} requests`}
              good
            />

            <StatusRow
              label="System"
              value="Online"
              good
            />

          </div>

        </div>

      </div>

    </div>
  );

  const renderJobs = () => (
    <div className="page-content">

      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p>Manage all your jobs and customer appointments.</p>
        </div>

        <button className="primary-button" onClick={openNewJob}>
          <Plus size={20} />
          New Job
        </button>
      </div>

      <div className="panel">

        <div className="toolbar">

          <div className="search-box">
            <Search size={19} />
            <input
              placeholder="Search jobs, customers or postcodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="job-count">
            {filteredJobs.length} Jobs
          </div>

        </div>

        <div className="jobs-table">

          <div className="table-head">
            <span>Job</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredJobs.map((job) => (
            <div className="table-row" key={job.id}>

              <div>
                <strong>{job.title}</strong>
                <small>{job.address || job.postcode}</small>
              </div>

              <div>
                <strong>{job.customer}</strong>
                <small>{job.phone}</small>
              </div>

              <div>
                <strong>{job.date}</strong>
                <small>{job.time}</small>
              </div>

              <div>
                <StatusBadge status={job.status} />
              </div>

              <div className="table-actions">

                <button
                  className="icon-button"
                  onClick={() => openEditJob(job)}
                  title="Edit job"
                >
                  <FileText size={18} />
                </button>

                <button
                  className="icon-button danger"
                  onClick={() => deleteJob(job)}
                  title="Delete job"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>

        {filteredJobs.length === 0 && (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            text="Create your first job to get started."
          />
        )}

      </div>

    </div>
  );

  const renderCalendar = () => (
    <div className="page-content">

      <div className="page-header">

        <div>
          <h1>Calendar</h1>
          <p>Drag and drop scheduling can be added next.</p>
        </div>

        <button className="primary-button" onClick={openNewJob}>
          <Plus size={20} />
          Schedule Job
        </button>

      </div>

      <div className="panel calendar-panel">

        <div className="calendar-header">

          <button
            className="icon-button"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft />
          </button>

          <h2>{monthName}</h2>

          <button
            className="icon-button"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight />
          </button>

        </div>

        <div className="calendar-weekdays">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="calendar-grid">

          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  className="calendar-day empty-day"
                  key={`empty-${index}`}
                />
              );
            }

            const dateString =
              date.toISOString().split('T')[0];

            const dayJobs = jobs.filter(
              (job) => job.date === dateString
            );

            const isToday =
              dateString ===
              new Date().toISOString().split('T')[0];

            return (
              <div
                className={`calendar-day ${
                  isToday ? 'today' : ''
                }`}
                key={dateString}
              >

                <div className="day-number">
                  {date.getDate()}
                </div>

                <div className="calendar-jobs">

                  {dayJobs.slice(0, 3).map((job) => (
                    <button
                      className="calendar-job"
                      key={job.id}
                      onClick={() => openEditJob(job)}
                    >
                      <span
                        style={{
                          background:
                            statusColours[job.status] ||
                            '#64748b',
                        }}
                      />

                      {job.time} {job.title}

                    </button>
                  ))}

                  {dayJobs.length > 3 && (
                    <small>
                      +{dayJobs.length - 3} more
                    </small>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );

  const renderEngineers = () => (
    <div className="page-content">

      <div className="page-header">
        <div>
          <h1>Engineer Portal</h1>
          <p>
            Jobs assigned to engineers can be viewed here.
          </p>
        </div>
      </div>

      <div className="stats-grid">

        <StatCard
          title="Unassigned"
          value={
            jobs.filter(
              (j) => j.engineer === 'Unassigned'
            ).length
          }
          icon={Users}
        />

        <StatCard
          title="In Progress"
          value={stats.progress}
          icon={Wrench}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
        />

      </div>

      <div className="panel">

        <div className="panel-header">
          <div>
            <h2>Engineer Jobs</h2>
            <p>Mobile-friendly job management</p>
          </div>
        </div>

        <div className="job-list">

          {jobs.map((job) => (
            <div className="engineer-card" key={job.id}>

              <div className="engineer-card-top">

                <div>
                  <StatusBadge status={job.status} />
                  <h3>{job.title}</h3>
                  <p>{job.customer}</p>
                </div>

                <button
                  className="icon-button"
                  onClick={() => openEditJob(job)}
                >
                  <FileText />
                </button>

              </div>

              <div className="engineer-details">

                <span>
                  <MapPin size={16} />
                  {job.address}
                </span>

                <span>
                  <Clock size={16} />
                  {job.date} at {job.time}
                </span>

              </div>

              <div className="engineer-actions">

                <button
                  onClick={() =>
                    changeStatus(job, 'In Progress')
                  }
                >
                  Start Job
                </button>

                <button
                  onClick={() =>
                    changeStatus(job, 'Completed')
                  }
                >
                  Complete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );

  const renderMaterials = () => (
    <div className="page-content">

      <div className="page-header">

        <div>
          <h1>Materials</h1>
          <p>Track material requests and orders.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowMaterialModal(true)}
        >
          <Plus size={20} />
          Request Material
        </button>

      </div>

      <div className="panel">

        {materials.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No material requests"
            text="Create a request for materials needed on a job."
          />
        ) : (
          <div className="materials-list">

            {materials.map((material) => (
              <div
                className="material-row"
                key={material.id}
              >

                <div className="material-icon">
                  <Package />
                </div>

                <div className="material-info">
                  <strong>{material.item}</strong>
                  <span>
                    Quantity: {material.quantity || 'Not specified'}
                  </span>
                  <small>
                    Job: {material.job || 'Not assigned'}
                  </small>
                </div>

                <div>
                  <StatusBadge status={material.status} />
                </div>

                <button
                  className="icon-button danger"
                  onClick={() => deleteMaterial(material.id)}
                >
                  <Trash2 size={18} />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );

  const renderReports = () => (
    <div className="page-content">

      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Business performance overview.</p>
        </div>
      </div>

      <div className="stats-grid">

        <StatCard
          title="Total Jobs"
          value={stats.total}
          icon={Briefcase}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
        />

        <StatCard
          title="Completion Rate"
          value={
            stats.total
              ? `${Math.round(
                  (stats.completed / stats.total) * 100
                )}%`
              : '0%'
          }
          icon={ClipboardCheck}
        />

      </div>

    </div>
  );

  const renderSettings = () => (
    <div className="page-content">

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Configure your A1 Pro Command Centre.</p>
        </div>
      </div>

      <div className="panel settings-panel">

        <div className="setting-section">

          <div className="setting-icon">
            <Building2 />
          </div>

          <div>
            <h3>Business Settings</h3>
            <p>
              Add your company name and business details.
            </p>
          </div>

        </div>

        <div className="setting-section">

          <div className="setting-icon">
            <CircleDollarSign />
          </div>

          <div>
            <h3>Invoices</h3>
            <p>
              Invoice and CIS features can be connected here.
            </p>
          </div>

        </div>

        <div className="setting-section">

          <div className="setting-icon">
            <RefreshCw />
          </div>

          <div>
            <h3>Database</h3>
            <p>
              {supabaseConnected
                ? 'Supabase connected successfully.'
                : 'Currently operating with local storage fallback.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );

  const renderPage = () => {
    switch (tab) {
      case 'Dashboard':
        return renderDashboard();

      case 'Jobs':
        return renderJobs();

      case 'Calendar':
        return renderCalendar();

      case 'Engineers':
        return renderEngineers();

      case 'Materials':
        return renderMaterials();

      case 'Reports':
        return renderReports();

      case 'Settings':
        return renderSettings();

      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <RefreshCw className="spin" size={34} />
        <p>Loading A1 Pro Command Centre...</p>
      </div>
    );
  }

  return (
    <main className="app-shell">

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? 'open' : 'closed'
        }`}
      >

        <div className="logo">

          <div className="logo-mark">A1</div>

          {sidebarOpen && (
            <div>
              <strong>A1 Pro</strong>
              <span>Command Centre</span>
            </div>
          )}

        </div>

        <nav>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  tab === item.name ? 'active' : ''
                }`}
                onClick={() => setTab(item.name)}
              >

                <Icon size={21} />

                {sidebarOpen && (
                  <span>{item.name}</span>
                )}

              </button>
            );
          })}

        </nav>

        {sidebarOpen && (
          <div className="sidebar-bottom">

            <div
              className={`connection ${
                supabaseConnected
                  ? 'connected'
                  : 'local'
              }`}
            >
              <span />
              {supabaseConnected
                ? 'Database Connected'
                : 'Local Mode'}
            </div>

          </div>
        )}

      </aside>

      <section className="main-area">

        <header className="topbar">

          <button
            className="icon-button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            <Menu />
          </button>

          <div className="topbar-title">
            <strong>{tab}</strong>
          </div>

          <div className="topbar-right">

            <div className="global-search">
              <Search size={18} />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="profile-button"
              title="User Profile"
            >
              <User size={20} />
            </button>

          </div>

        </header>

        {renderPage()}

      </section>

      {showJobModal && (
        <div className="modal-overlay">

          <div className="modal job-modal">

            <div className="modal-header">

              <div>
                <h2>
                  {selectedJob
                    ? 'Edit Job'
                    : 'Create New Job'}
                </h2>

                <p>
                  Enter the job and customer details below.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setShowJobModal(false)
                }
              >
                <X />
              </button>

            </div>

            <div className="form-grid">

              <FormField
                label="Job Title"
                value={jobForm.title}
                onChange={(value) =>
                  setJobForm({
                    ...jobForm,
                    title: value,
                  })
                }
              />

              <FormField
                label="Customer Name"
                value={jobForm.customer}
                onChange={(value) =>
                  setJobForm({
                    ...jobForm,
                    customer: value,
                  })
                }
              />

              <FormField
                label="Postcode"
                value={jobForm.postcode}
                onChange={(value) =>
                  setJobForm({
                    ...jobForm,
                    postcode: value.toUpperCase(),
                  })
                }
              />

              <div className="form-field postcode-field">

                <label>Postcode Lookup</label>

                <button
                  className="secondary-button"
                  onClick={lookupPostcode}
                >
                  <MapPin size={18} />
                  Find Address
                </button>

              </div>

              <div className="form-field full-width">

                <label>Full Address</label>

                <input
                  value={jobForm.address}
                  placeholder="Full property address"
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      address: e.target.value,
                    })
                  }
                />

              </div>

              <FormField
                label="Phone"
                value={jobForm.phone}
                onChange={(value) =>
                  setJobForm({
                    ...jobForm,
                    phone: value,
                  })
                }
              />

              <FormField
                label="Email"
                value={jobForm.email}
                onChange={(value) =>
                  setJobForm({
                    ...jobForm,
                    email: value,
                  })
                }
              />

              <div className="form-field">

                <label>Job Date</label>

                <input
                  type="date"
                  value={jobForm.date}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      date: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label>Time</label>

                <input
                  type="time"
                  value={jobForm.time}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      time: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label>Engineer</label>

                <input
                  value={jobForm.engineer}
                  placeholder="Engineer name"
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      engineer: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label>Status</label>

                <select
                  value={jobForm.status}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option>New</option>
                  <option>Scheduled</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>

              </div>

              <div className="form-field full-width">

                <label>Job Description</label>

                <textarea
                  rows="4"
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      description: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-field full-width">

                <label>Notes</label>

                <textarea
                  rows="3"
                  value={jobForm.notes}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      notes: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="modal-footer">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowJobModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveJob}
              >
                <Save size={19} />
                Save Job
              </button>

            </div>

          </div>

        </div>
      )}

      {showMaterialModal && (
        <div className="modal-overlay">

          <div className="modal material-modal">

            <div className="modal-header">

              <div>
                <h2>Request Material</h2>
                <p>Add a material request.</p>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setShowMaterialModal(false)
                }
              >
                <X />
              </button>

            </div>

            <div className="form-grid">

              <FormField
                label="Material"
                value={materialForm.item}
                onChange={(value) =>
                  setMaterialForm({
                    ...materialForm,
                    item: value,
                  })
                }
              />

              <FormField
                label="Quantity"
                value={materialForm.quantity}
                onChange={(value) =>
                  setMaterialForm({
                    ...materialForm,
                    quantity: value,
                  })
                }
              />

              <FormField
                label="Related Job"
                value={materialForm.job}
                onChange={(value) =>
                  setMaterialForm({
                    ...materialForm,
                    job: value,
                  })
                }
              />

            </div>

            <div className="modal-footer">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowMaterialModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveMaterial}
              >
                <Save size={18} />
                Save Request
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        <Icon size={23} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className="status-badge"
      style={{
        background: `${statusColours[status] || '#64748b'}20`,
        color: statusColours[status] || '#64748b',
        borderColor: `${statusColours[status] || '#64748b'}40`,
      }}
    >
      {status}
    </span>
  );
}

function JobRow({ job, onClick }) {
  return (
    <button className="job-row" onClick={onClick}>

      <div
        className="job-status-dot"
        style={{
          background:
            statusColours[job.status] || '#64748b',
        }}
      />

      <div className="job-row-info">

        <strong>{job.title}</strong>

        <span>
          <User size={14} />
          {job.customer}
        </span>

      </div>

      <div className="job-row-time">
        <Clock size={16} />
        {job.time}
      </div>

      <StatusBadge status={job.status} />

    </button>
  );
}

function StatusRow({ label, value, good }) {
  return (
    <div className="status-row">

      <div>
        <span
          className={`status-indicator ${
            good ? 'good' : ''
          }`}
        />

        {label}
      </div>

      <strong>{value}</strong>

    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        <Icon size={32} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

    </div>
  );
}

function FormField({ label, value, onChange }) {
  return (
    <div className="form-field">

      <label>{label}</label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}
