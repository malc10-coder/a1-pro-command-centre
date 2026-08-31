'use client';

import { useState } from 'react';

export default function Page() {
  const [activePage, setActivePage] = useState('Dashboard');

  const jobs = [
    {
      id: 1,
      title: 'Office Refurbishment',
      customer: 'Broadwall Ltd',
      status: 'In Progress',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Electrical Survey',
      customer: 'Premier Estates',
      status: 'Scheduled',
      date: 'Tomorrow'
    },
    {
      id: 3,
      title: 'Maintenance Callout',
      customer: 'City Property',
      status: 'Pending',
      date: '2 September'
    }
  ];

  const engineers = [
    {
      name: 'Dave Wilson',
      phone: '07700 900001',
      status: 'Available'
    },
    {
      name: 'Mike Taylor',
      phone: '07700 900002',
      status: 'On Job'
    },
    {
      name: 'Steve Harris',
      phone: '07700 900003',
      status: 'Available'
    }
  ];

  const customers = [
    'Broadwall Ltd',
    'Premier Estates',
    'City Property'
  ];

  const navItems = [
    'Dashboard',
    'Jobs',
    'Calendar',
    'Customers',
    'Engineers',
    'Materials',
    'Settings'
  ];

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>A1</div>

        <h1 style={styles.brand}>A1 Pro</h1>

        <p style={styles.subtitle}>
          Command Centre
        </p>

        <div style={styles.menu}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              style={
                activePage === item
                  ? styles.activeButton
                  : styles.menuButton
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div style={styles.user}>
          <strong>Malc</strong>
          <br />
          Administrator
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.smallTitle}>
              A1 PRO COMMAND CENTRE
            </p>

            <h2 style={styles.pageTitle}>
              {activePage}
            </h2>
          </div>
        </div>

        {activePage === 'Dashboard' && (
          <Dashboard jobs={jobs} />
        )}

        {activePage === 'Jobs' && (
          <Jobs jobs={jobs} />
        )}

        {activePage === 'Calendar' && (
          <Calendar jobs={jobs} />
        )}

        {activePage === 'Customers' && (
          <Customers customers={customers} />
        )}

        {activePage === 'Engineers' && (
          <Engineers engineers={engineers} />
        )}

        {activePage === 'Materials' && (
          <Materials />
        )}

        {activePage === 'Settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
}

function Dashboard({ jobs }) {
  return (
    <div>
      <div style={styles.cards}>
        <div style={styles.card}>
          <p>Total Jobs</p>
          <h2>{jobs.length}</h2>
        </div>

        <div style={styles.card}>
          <p>In Progress</p>
          <h2>1</h2>
        </div>

        <div style={styles.card}>
          <p>Scheduled</p>
          <h2>1</h2>
        </div>

        <div style={styles.card}>
          <p>Engineers</p>
          <h2>3</h2>
        </div>
      </div>

      <div style={styles.panel}>
        <h2>Recent Jobs</h2>

        {jobs.map((job) => (
          <div key={job.id} style={styles.listRow}>
            <div>
              <strong>{job.title}</strong>
              <p>{job.customer}</p>
            </div>

            <div>
              <strong>{job.status}</strong>
            </div>

            <div>{job.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Jobs({ jobs }) {
  return (
    <div style={styles.panel}>
      <h2>All Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id} style={styles.listRow}>
          <div>
            <strong>{job.title}</strong>
            <p>{job.customer}</p>
          </div>

          <div>{job.status}</div>

          <div>{job.date}</div>
        </div>
      ))}
    </div>
  );
}

function Calendar({ jobs }) {
  return (
    <div style={styles.panel}>
      <h2>Calendar</h2>

      <p>Your upcoming jobs and appointments.</p>

      {jobs.map((job) => (
        <div key={job.id} style={styles.calendarItem}>
          <strong>{job.date}</strong>

          <span>
            {job.title} - {job.customer}
          </span>
        </div>
      ))}
    </div>
  );
}

function Customers({ customers }) {
  return (
    <div style={styles.panel}>
      <h2>Customers</h2>

      {customers.map((customer) => (
        <div key={customer} style={styles.listRow}>
          <strong>{customer}</strong>

          <button style={styles.button}>
            View Customer
          </button>
        </div>
      ))}
    </div>
  );
}

function Engineers({ engineers }) {
  return (
    <div style={styles.panel}>
      <h2>Engineers</h2>

      {engineers.map((engineer) => (
        <div key={engineer.phone} style={styles.listRow}>
          <div>
            <strong>{engineer.name}</strong>

            <p>{engineer.phone}</p>
          </div>

          <strong>{engineer.status}</strong>
        </div>
      ))}
    </div>
  );
}

function Materials() {
  const materials = [
    'Electrical Cable',
    'LED Panels',
    'Fixings',
    'Switches'
  ];

  return (
    <div style={styles.panel}>
      <h2>Materials</h2>

      {materials.map((material) => (
        <div key={material} style={styles.listRow}>
          <strong>{material}</strong>

          <span>In Stock</span>
        </div>
      ))}
    </div>
  );
}

function Settings() {
  return (
    <div style={styles.panel}>
      <h2>Settings</h2>

      <p>
        A1 Pro Command Centre settings will go here.
      </p>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0f1d29',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif'
  },

  sidebar: {
    width: '250px',
    minHeight: '100vh',
    background: '#162938',
    padding: '20px',
    boxSizing: 'border-box'
  },

  logo: {
    fontSize: '18px',
    fontWeight: 'bold'
  },

  brand: {
    fontSize: '28px',
    marginTop: '25px',
    marginBottom: '5px'
  },

  subtitle: {
    color: '#cbd5e1',
    fontWeight: 'bold'
  },

  menu: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  menuButton: {
    border: 'none',
    background: 'transparent',
    color: '#cbd5e1',
    padding: '14px',
    textAlign: 'left',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px'
  },

  activeButton: {
    border: 'none',
    background: '#2d4b5f',
    color: '#ffffff',
    padding: '14px',
    textAlign: 'left',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold'
  },

  user: {
    marginTop: '35px',
    color: '#cbd5e1'
  },

  main: {
    flex: 1,
    padding: '35px',
    boxSizing: 'border-box'
  },

  header: {
    marginBottom: '30px'
  },

  smallTitle: {
    color: '#7f9bb0',
    fontSize: '12px',
    letterSpacing: '1px'
  },

  pageTitle: {
    fontSize: '34px',
    margin: '8px 0'
  },

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },

  card: {
    background: '#172a3a',
    padding: '20px',
    borderRadius: '10px'
  },

  panel: {
    background: '#172a3a',
    padding: '25px',
    borderRadius: '10px'
  },

  listRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 0',
    borderBottom: '1px solid #294154'
  },

  calendarItem: {
    display: 'flex',
    gap: '30px',
    padding: '15px',
    marginTop: '10px',
    background: '#0f1d29',
    borderRadius: '8px'
  },

  button: {
    background: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
