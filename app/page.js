'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  HardHat,
  CheckSquare,
  FileText,
  Calculator,
  CalendarDays,
  Camera,
  Search,
  Package,
  MapPin,
  BarChart3,
  Users,
  Cloud,
  Settings,
  Plus,
  Trash2,
  Download,
  Send,
  Save,
  CheckCircle,
  Briefcase
} from 'lucide-react';

import './style.css';
import RoutePlanner from './route-planner';
const P = 'a1ultimate_';

const get = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(P + k)) || d;
  } catch {
    return d;
  }
};

export default function App() {
  const [tab, setTab] = useState('Home');
  const [jobs, setJobs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [chat, setChat] = useState([]);

  useEffect(() => {
    setJobs(get('jobs', []));
    setTasks(get('tasks', []));
    setNotes(get('notes', []));
    setChat(get('chat', []));
  }, []);

  const put = (k, v) => {
    localStorage.setItem(P + k, JSON.stringify(v));

    const setters = {
      jobs: setJobs,
      tasks: setTasks,
      notes: setNotes,
      chat: setChat
    };

    setters[k](v);
  };

  
  const nav = [
    ['Home', Brain],
    ['AI Hub', Brain],
    ['Jobs', HardHat],
    ['Calendar', CalendarDays],
    ['Tasks', CheckSquare],
    ['Notes', FileText],
    ['Quotes', Calculator],
    ['Vision', Camera],
    ['Research', Search],
    ['Parts', Package],
    ['Routes', MapPin],
    ['Reports', BarChart3],
    ['Team', Users],
    ['Cloud', Cloud],
    ['Settings', Settings]
];
  return (
    <main>
      <aside>
        <div className="logo">
          <Brain /> A1 <b>PRO</b>
        </div>

        <small>AI BUSINESS OPERATING SYSTEM</small>

        {nav.map(([n, I]) => (
          <button
            key={n}
            onClick={() => setTab(n)}
            className={tab === n ? 'active' : ''}
          >
            <I />
            {n}
          </button>
        ))}

        <div className="bottom">
          <Cloud /> PRIVATE WORKSPACE
          <br />
          <small>Local-first • Backup-ready</small>
        </div>
      </aside>

      <section>
        <header>
          <div>
            <small>A1 PRO • ULTIMATE COMMAND CENTRE</small>
            <h1>{tab}</h1>
          </div>

          <div className="ready">
            <CheckCircle /> SYSTEM READY
          </div>
        </header>

        {tab === 'Home' && (
          <Home
            jobs={jobs}
            tasks={tasks}
            notes={notes}
            go={setTab}
            add={() =>
              put('jobs', [
                {
                  id: Date.now(),
                  name: 'New Job',
                  status: 'Planned',
                  date: ''
                },
                ...jobs
              ])
            }
          />
        )}
{tab === 'AI Hub' && <Hub chat={chat} put={put} />}

{tab === 'Jobs' && <Jobs jobs={jobs} put={put} />}

{tab === 'Calendar' && (
  <Calendar jobs={jobs} put={put} />
)}

{tab === 'Tasks' && <Tasks tasks={tasks} put={put} />}

{tab === 'Notes' && <Notes notes={notes} put={put} />}

{tab === 'Quotes' && <Quotes />}        

        {[
          'Vision',
          'Research',
          'Parts',
          'Routes',
          'Reports',
          'Team',
          'Cloud'
       ].includes(tab) && (tab === 'Routes' ? <RoutePlanner jobs={jobs} /> : <Module name={tab} jobs={jobs} />)}
        {tab === 'Settings' && (
          <SettingsPage
            jobs={jobs}
            tasks={tasks}
            notes={notes}
            chat={chat}
          />
        )}
      </section>
    </main>
  );
}

function Home({ jobs, tasks, notes, go, add }) {
  return (
    <>
      <div className="hero">
        <div>
          <span>🚀 A1 INTELLIGENCE LAYER</span>

          <h2>Your entire business, ready for AI.</h2>

          <p>
            Plan work, track jobs, create quotes, save notes and prepare your
            business for genuine AI automation.
          </p>

          <div>
            <button onClick={() => go('AI Hub')}>
              <Brain /> Ask A1
            </button>

            <button className="secondary" onClick={add}>
              <Plus /> Quick Job
            </button>
          </div>
        </div>

        <Brain size={125} />
      </div>

      <div className="stats">
        <Stat n={jobs.length} l="Jobs" i={<HardHat />} />

        <Stat
          n={tasks.filter((x) => !x.done).length}
          l="Open tasks"
          i={<CheckSquare />}
        />

        <Stat n={notes.length} l="Notes" i={<FileText />} />

        <Stat
          n={jobs.filter((x) => x.status === 'Complete').length}
          l="Complete"
          i={<CheckCircle />}
        />
      </div>

      <div className="cards">
        {[
          ['Jobs', HardHat, 'Manage work and status'],
          ['Tasks', CheckSquare, 'Your live action list'],
          ['Notes', FileText, 'Business knowledge base'],
          ['Quotes', Calculator, 'Quick estimate calculator'],
          ['AI Hub', Brain, 'AI command workspace'],
          ['Reports', BarChart3, 'Business intelligence']
        ].map(([n, I, d]) => (
          <div className="card" key={n} onClick={() => go(n)}>
            <I />
            <h3>{n}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Stat({ n, l, i }) {
  return (
    <div className="stat">
      {i}
      <b>{n}</b>
      <span>{l}</span>
    </div>
  );
}

function Hub({ chat, put }) {
  const [q, setQ] = useState('');

  const send = () => {
    if (!q) return;

    const n = [
      {
        id: Date.now(),
        q,
        a:
          'A1 has captured this request in your workspace. Live model reasoning is ready to be connected through a secure server-side provider integration.',
        time: new Date().toLocaleTimeString()
      },
      ...chat
    ];

    put('chat', n);
    setQ('');
  };

  return (
    <div className="panel">
      <h2>
        <Brain /> A1 Command Assistant
      </h2>

      <p>
        Your command workspace. Add an instruction, decision, job idea or
        question.
      </p>

      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tell A1 what you need…"
      />

      <button onClick={send}>
        <Send /> Send to A1
      </button>

      {chat.map((x) => (
        <article key={x.id}>
          <small>{x.time}</small>

          <b>You</b>
          <p>{x.q}</p>

          <b>A1 Pro</b>
          <p>{x.a}</p>
        </article>
      ))}
    </div>
  );
}

function Jobs({ jobs, put }) {
  const [n, setN] = useState('');
const [customer, setCustomer] = useState('');
const [address, setAddress] = useState('');
const [postcode, setPostcode] = useState('');
const [d, setD] = useState('');
const [time, setTime] = useState('');
const [engineer, setEngineer] = useState('');

  const add = () => {
    if (n) {
      put('jobs', [
        {
        id: Date.now(),
name: n,
customer,
address,
postcode,
status: 'Planned',
date: d,
time,
engineer
        },
        ...jobs
      ]);

      setN('');
      setD('');
    }
  };

  return (
    <div className="panel">
      <h2>
        <HardHat /> Job Command
      </h2>

      <div className="add">
        <input
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="Job name"
        />

        <input
          type="date"
          value={d}
          onChange={(e) => setD(e.target.value)}
        />

        <button onClick={add}>
          <Plus /> Add
        </button>
      </div>

      {jobs.map((j) => (
        <div className="row" key={j.id}>
          <Briefcase />

          <input
            value={j.name}
            onChange={(e) =>
              put(
                'jobs',
                jobs.map((x) =>
                  x.id === j.id ? { ...x, name: e.target.value } : x
                )
              )
            }
          />

          <select
            value={j.status}
            onChange={(e) =>
              put(
                'jobs',
                jobs.map((x) =>
                  x.id === j.id ? { ...x, status: e.target.value } : x
                )
              )
            }
          >
            <option>Planned</option>
            <option>In Progress</option>
            <option>Waiting</option>
            <option>Complete</option>
          </select>

          <button
            className="trash"
            onClick={() =>
              put(
                'jobs',
                jobs.filter((x) => x.id !== j.id)
              )
            }
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </div>
  );
}

function Tasks({ tasks, put }) {
  const [n, setN] = useState('');

  return (
    <div className="panel">
      <h2>
        <CheckSquare /> Task Manager
      </h2>

      <div className="add">
        <input
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="What needs doing?"
        />

        <button
          onClick={() => {
            if (n) {
              put('tasks', [
                {
id: Date.now(),
name: n,
      done: false
                },
                ...tasks
              ]);

              setN('');
            }
          }}
        >
          <Plus /> Add
        </button>
      </div>

      {tasks.map((x) => (
        <div className="row" key={x.id}>
          <input
            type="checkbox"
            checked={x.done}
            onChange={() =>
              put(
                'tasks',
                tasks.map((y) =>
                  y.id === x.id ? { ...y, done: !y.done } : y
                )
              )
            }
          />

          <b className={x.done ? 'done' : ''}>{x.name}</b>

          <button
            className="trash"
            onClick={() =>
              put(
                'tasks',
                tasks.filter((y) => y.id !== x.id)
              )
            }
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </div>
  );
}

function Notes({ notes, put }) {
  const [t, setT] = useState('');
  const [b, setB] = useState('');

  return (
    <div className="panel">
      <h2>
        <FileText /> A1 Knowledge Notes
      </h2>

      <input
        value={t}
        onChange={(e) => setT(e.target.value)}
        placeholder="Note title"
      />

      <textarea
        value={b}
        onChange={(e) => setB(e.target.value)}
        placeholder="Save site information, procedures, ideas or important details…"
      />

      <button
        onClick={() => {
          if (t || b) {
            put('notes', [
              {
                id: Date.now(),
                title: t || 'Untitled',
                body: b,
                date: new Date().toLocaleString()
              },
              ...notes
            ]);

            setT('');
            setB('');
          }
        }}
      >
        <Save /> Save Note
      </button>

      {notes.map((n) => (
        <article key={n.id}>
          <div className="notehead">
            <b>{n.title}</b>

            <button
              className="trash"
              onClick={() =>
                put(
                  'notes',
                  notes.filter((x) => x.id !== n.id)
                )
              }
            >
              <Trash2 />
            </button>
          </div>

          <small>{n.date}</small>
          <p>{n.body}</p>
        </article>
      ))}
    </div>
  );
}

function Quotes() {
  const [lab, setLab] = useState('Job estimate');
  const [labour, setLabour] = useState(0);
  const [materials, setMaterials] = useState(0);
  const [margin, setMargin] = useState(20);

  const base = Number(labour || 0) + Number(materials || 0);
  const profit = (base * Number(margin || 0)) / 100;
  const total = base + profit;

  return (
    <div className="panel">
      <h2>
        <Calculator /> A1 Quick Quote
      </h2>

      <input
        value={lab}
        onChange={(e) => setLab(e.target.value)}
        placeholder="Quote name"
      />

      <div className="quotegrid">
        <label>
          Labour £
          <input
            type="number"
            value={labour}
            onChange={(e) => setLabour(e.target.value)}
          />
        </label>

        <label>
          Materials £
          <input
            type="number"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
          />
        </label>

        <label>
          Margin %
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
          />
        </label>
      </div>

      <div className="total">
        <span>{lab}</span>
        <b>£{total.toFixed(2)}</b>

        <small>
          Base £{base.toFixed(2)} + margin £{profit.toFixed(2)}
        </small>
      </div>
    </div>
  );
}

function Module({ name, jobs }) {
  const map = {
    Vision: Camera,
    Research: Search,
    Parts: Package,
    Routes: MapPin,
    Reports: BarChart3,
    Team: Users,
    Cloud: Cloud
  };

  const I = map[name];

  return (
    <div className="panel">
      <h2>
        <I /> {name}
      </h2>

      {name === 'Reports' ? (
        <>
          <p>Current workspace summary:</p>

          <div className="stats">
            <Stat n={jobs.length} l="Jobs" i={<HardHat />} />

            <Stat
              n={jobs.filter((x) => x.status === 'Complete').length}
              l="Complete"
              i={<CheckCircle />}
            />
          </div>
        </>
      ) : (
        <>
          <p>This module is prepared as part of the A1 Pro architecture.</p>

          <div className="feature">
            <I />

            <div>
              <b>{name} engine ready</b>

              <span>
                Next stage connects the appropriate live service securely.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SettingsPage({ jobs, tasks, notes, chat }) {
  const backup = () => {
    const a = document.createElement('a');

    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              jobs,
              tasks,
              notes,
              chat
            },
            null,
            2
          )
        ],
        {
          type: 'application/json'
        }
      )
    );

    a.download = 'a1-pro-backup.json';
    a.click();
  };

  return (
    <div className="panel">
      <h2>
        <Settings /> Workspace Settings
      </h2>

      <p>Your current A1 Pro data is stored locally in this browser.</p>

      <button onClick={backup}>
        <Download /> Download Full Backup
      </button>

      <div className="feature">
        <Cloud />

        <div>
          <b>Cloud sync next</b>

          <span>
            A database and authentication layer can make the workspace
            available across all your devices.
          </span>
        </div>
      </div>
    </div>
  );
}
function Calendar({ jobs, put }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedJob, setDraggedJob] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startDay = (firstDay.getDay() + 6) % 7;

  const monthName = currentDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const moveJob = (newDate) => {
    if (!draggedJob) return;

    const updatedJobs = jobs.map((job) =>
      job.id === draggedJob.id
        ? {
            ...job,
            date: newDate
          }
        : job
    );

    put('jobs', updatedJobs);
    setDraggedJob(null);
  };

  const jobsForDate = (date) => {
    return jobs.filter(
      (job) => job.date === date
    );
  };

  const cells = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(
      new Date(year, month, day)
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <div className="panel">

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >

        <button
          onClick={previousMonth}
          className="secondary"
          type="button"
        >
          ←
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>
            📅 Calendar
          </h2>

          <p style={{ margin: '5px 0 0' }}>
            {monthName}
          </p>
        </div>

        <button
          onClick={nextMonth}
          className="secondary"
          type="button"
        >
          →
        </button>

      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(7, minmax(0, 1fr))',
          gap: '8px'
        }}
      >

        {[
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun'
        ].map((day) => (
          <div
            key={day}
            style={{
              padding: '10px',
              fontWeight: 700,
              textAlign: 'center',
              color: '#8fa7b8'
            }}
          >
            {day}
          </div>
        ))}

        {cells.map((date, index) => {

          const dateString = date
            ? formatDate(date)
            : '';

          const dayJobs = date
            ? jobsForDate(dateString)
            : [];

          return (
            <div
              key={index}
              onDragOver={(event) => {
                if (date) {
                  event.preventDefault();
                }
              }}
              onDrop={() => {
                if (date) {
                  moveJob(dateString);
                }
              }}
              style={{
                minHeight: '120px',
                padding: '8px',
                border:
                  '1px solid rgba(120,170,200,0.25)',
                borderRadius: '8px',
                background: date
                  ? 'rgba(255,255,255,0.03)'
                  : 'transparent',
                opacity: date ? 1 : 0.25
              }}
            >

              {date && (
                <>
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}
                  >
                    {date.getDate()}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >

                    {dayJobs.map((job) => (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={() =>
                          setDraggedJob(job)
                        }
                        style={{
                          padding: '7px',
                          borderRadius: '6px',
                          background:
                            'rgba(91,190,235,0.18)',
                          border:
                            '1px solid rgba(91,190,235,0.35)',
                          cursor: 'grab',
                          fontSize: '12px'
                        }}
                      >

                        <strong>
                          {job.name || 'Job'}
                        </strong>

                        <div
                          style={{
                            marginTop: '3px',
                            opacity: 0.75
                          }}
                        >
                          {job.status}
                        </div>

                      </div>
                    ))}

                  </div>
                </>
              )}

            </div>
          );
        })}

      </div>

      <div
        style={{
          marginTop: '18px',
          padding: '12px',
          borderRadius: '8px',
          background:
            'rgba(255,255,255,0.04)'
        }}
      >
        <strong>Drag & drop scheduling</strong>

        <div
          style={{
            marginTop: '4px',
            opacity: 0.75
          }}
        >
          Drag a job onto another day to
          reschedule it.
        </div>
      </div>

    </div>
  );
}
