import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

const API = "http://localhost:8080/api";

function Dashboard() {
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "Patient";

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [billing, setBilling] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }

    return response.json();
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        getData(`${API}/patients`),
        getData(`${API}/doctors`),
        getData(`${API}/appointments`),
        getData(`${API}/beds`),
        getData(`${API}/billing`),
      ]);

      if (results[0].status === "fulfilled") {
        setPatients(results[0].value || []);
      }

      if (results[1].status === "fulfilled") {
        setDoctors(results[1].value || []);
      }

      if (results[2].status === "fulfilled") {
        setAppointments(results[2].value || []);
      }

      if (results[3].status === "fulfilled") {
        setBeds(results[3].value || []);
      }

      if (results[4].status === "fulfilled") {
        setBilling(results[4].value || []);
      }

      const failed = results.filter(
        (item) => item.status === "rejected"
      );

      if (failed.length === 5) {
        setError(
          "Unable to connect to hospital services. Please check the backend."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ADMIN STATUS UPDATES
  // =====================================================

  const updateDoctorAvailability = async (doctorId, availabilityStatus) => {
    try {
      const response = await fetch(
        `${API}/doctors/${doctorId}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(availabilityStatus),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update doctor availability");
      }

      const updatedDoctor = await response.json();

      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          Number(doctor.doctorId) === Number(doctorId)
            ? updatedDoctor
            : doctor
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update doctor availability.");
    }
  };

  const updateBedStatus = async (bedId, status) => {
    try {
      const response = await fetch(
        `${API}/beds/${bedId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bed status");
      }

      const updatedBed = await response.json();

      setBeds((currentBeds) =>
        currentBeds.map((bed) =>
          Number(bed.bedId) === Number(bedId)
            ? updatedBed
            : bed
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update bed status.");
    }
  };

  const updateBillingStatus = async (billId, paymentStatus) => {
    try {
      const response = await fetch(
        `${API}/billing/${billId}/payment-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentStatus),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      const updatedBill = await response.json();

      setBilling((currentBilling) =>
        currentBilling.map((bill) =>
          Number(bill.billId) === Number(billId)
            ? updatedBill
            : bill
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update payment status.");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("rememberMe");

    window.location.reload();
  };

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const today = new Date();

  const todayString = today.toISOString().split("T")[0];

  const isToday = (date) => {
    if (!date) return false;

    return String(date).substring(0, 10) === todayString;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const value = String(date).substring(0, 10);

    const parts = value.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // =====================================================
  // ADMIN STATISTICS
  // =====================================================

  const availableDoctors = doctors.filter(
    (doctor) =>
      doctor.availabilityStatus === "Available" ||
      doctor.status === "Available"
  ).length;

  const availableBeds = beds.filter(
    (bed) => bed.status === "Available"
  ).length;

  const occupiedBeds = beds.filter(
    (bed) => bed.status === "Occupied"
  ).length;

  const todayAppointments = appointments.filter((appointment) =>
    isToday(
      appointment.appointmentDate ||
        appointment.date
    )
  );

  const paidRevenue = billing
    .filter(
      (bill) =>
        bill.paymentStatus === "Paid" ||
        bill.status === "Paid"
    )
    .reduce(
      (total, bill) =>
        total + Number(bill.amount || 0),
      0
    );

  const pendingBills = billing.filter(
    (bill) =>
      bill.paymentStatus === "Pending" ||
      bill.status === "Pending"
  ).length;

  const appointmentStatus = {
    Scheduled: todayAppointments.filter(
      (a) => a.status === "Scheduled"
    ).length,

    Pending: todayAppointments.filter(
      (a) => a.status === "Pending"
    ).length,

    Completed: todayAppointments.filter(
      (a) => a.status === "Completed"
    ).length,

    Cancelled: todayAppointments.filter(
      (a) => a.status === "Cancelled"
    ).length,
  };

  // =====================================================
  // DOCTOR DATA
  // =====================================================

  const doctorProfile = useMemo(() => {
    return doctors.find((doctor) => {
      const doctorUserId =
        doctor.userId ??
        doctor.user?.userId ??
        doctor.user?.id;

      const storedUserId =
        localStorage.getItem("userId");

      return (
        doctor.username === username ||
        doctor.user?.username === username ||
        doctorUserId === Number(storedUserId)
      );
    });
  }, [doctors, username]);

  const doctorId = doctorProfile?.doctorId;

  const doctorAppointments = doctorId
    ? appointments.filter(
        (appointment) =>
          Number(
            appointment.doctorId ??
              appointment.doctor?.doctorId
          ) === Number(doctorId)
      )
    : [];

  const doctorTodayAppointments =
    doctorAppointments.filter((appointment) =>
      isToday(
        appointment.appointmentDate ||
          appointment.date
      )
    );

  // =====================================================
  // PATIENT DATA
  // =====================================================

  const patientProfile = useMemo(() => {
    return patients.find((patient) => {
      const patientUserId =
        patient.userId ??
        patient.user?.userId ??
        patient.user?.id;

      const storedUserId =
        localStorage.getItem("userId");

      return (
        patient.username === username ||
        patient.user?.username === username ||
        patientUserId === Number(storedUserId)
      );
    });
  }, [patients, username]);

  const patientId = patientProfile?.patientId;

  const patientAppointments = patientId
    ? appointments.filter(
        (appointment) =>
          Number(
            appointment.patientId ??
              appointment.patient?.patientId
          ) === Number(patientId)
      )
    : [];

  const upcomingAppointments =
    patientAppointments.filter(
      (appointment) =>
        appointment.status !== "Cancelled" &&
        appointment.status !== "Completed"
    );

  // =====================================================
  // PAGE NAVIGATION
  // =====================================================

  const openPage = (page) => {
    setCurrentPage(page);
  };

  // =====================================================
  // HEADER
  // =====================================================

  const Header = ({ title, subtitle }) => (
    <header className="dashboard-header">
      <div>
        <div className="page-label">
          HOSPITAL MANAGEMENT SYSTEM
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>

      <div className="header-actions">
        <button
          className="refresh-button"
          onClick={loadDashboardData}
          title="Refresh data"
        >
          ↻
        </button>

        <div className="profile">
          <div className="profile-avatar">
            {username
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">
            <strong>{username}</strong>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );

  // =====================================================
  // SIDEBAR
  // =====================================================

  const SidebarItem = ({
    id,
    icon,
    label,
  }) => (
    <button
      className={`menu-item ${
        currentPage === id ? "active" : ""
      }`}
      onClick={() => openPage(id)}
    >
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✚</div>

        <div>
          <h2>Hospital</h2>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span>MAIN MENU</span>
      </div>

      <nav className="menu">
        <SidebarItem
          id="dashboard"
          icon="⌂"
          label="Overview"
        />

        {role === "Admin" && (
          <>
            <SidebarItem
              id="patients"
              icon="♙"
              label="Patients"
            />

            <SidebarItem
              id="doctors"
              icon="⚕"
              label="Doctors"
            />

            <SidebarItem
              id="appointments"
              icon="▣"
              label="Appointments"
            />

            <SidebarItem
              id="beds"
              icon="▤"
              label="Bed Management"
            />

            <SidebarItem
              id="billing"
              icon="₹"
              label="Billing"
            />

            <SidebarItem
              id="revenue"
              icon="◉"
              label="Revenue"
            />
          </>
        )}

        {role === "Doctor" && (
          <>
            <SidebarItem
              id="doctorAppointments"
              icon="▣"
              label="My Appointments"
            />

            <SidebarItem
              id="doctorPatients"
              icon="♙"
              label="My Patients"
            />

            <SidebarItem
              id="doctorProfile"
              icon="⚕"
              label="My Profile"
            />
          </>
        )}

        {role === "Patient" && (
          <>
            <SidebarItem
              id="patientAppointments"
              icon="▣"
              label="My Appointments"
            />

            <SidebarItem
              id="bookAppointment"
              icon="+"
              label="Book Appointment"
            />

            <SidebarItem
              id="patientDoctors"
              icon="⚕"
              label="Doctors"
            />

            <SidebarItem
              id="patientProfile"
              icon="♙"
              label="My Profile"
            />
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="support-card">
          <div className="support-icon">?</div>

          <div>
            <strong>Need Help?</strong>
            <span>Contact hospital support</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );

  // =====================================================
  // ADMIN OVERVIEW
  // =====================================================

  const AdminOverview = () => (
    <>
      <Header
        title="Hospital Overview"
        subtitle={`Welcome back, ${username}. Here's today's hospital summary.`}
      />

      {error && (
        <div className="error-banner">
          ⚠ {error}
        </div>
      )}

      <section className="welcome-banner">
        <div>
          <span className="welcome-small">
            TODAY'S OVERVIEW
          </span>

          <h2>
            Good to see you, {username} 👋
          </h2>

          <p>
            Monitor hospital operations,
            appointments and resources from one
            place.
          </p>
        </div>

        <div className="welcome-date">
          <span>Today</span>
          <strong>
            {today.toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </strong>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          icon="♙"
          label="Total Patients"
          value={patients.length}
          description="Registered patients"
          className="blue"
        />

        <StatCard
          icon="⚕"
          label="Available Doctors"
          value={availableDoctors}
          description={`Out of ${doctors.length} doctors`}
          className="green"
        />

        <StatCard
          icon="▣"
          label="Today's Appointments"
          value={todayAppointments.length}
          description="Scheduled for today"
          className="purple"
        />

        <StatCard
          icon="▤"
          label="Available Beds"
          value={availableBeds}
          description={`${occupiedBeds} beds occupied`}
          className="orange"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                APPOINTMENTS
              </span>
              <h2>Today's Appointment Status</h2>
              <p>Current appointment distribution</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                openPage("appointments")
              }
            >
              View all →
            </button>
          </div>

          <div className="appointment-summary">
            <StatusCard
              label="Scheduled"
              value={appointmentStatus.Scheduled}
              className="scheduled"
            />

            <StatusCard
              label="Pending"
              value={appointmentStatus.Pending}
              className="pending"
            />

            <StatusCard
              label="Completed"
              value={appointmentStatus.Completed}
              className="completed"
            />

            <StatusCard
              label="Cancelled"
              value={appointmentStatus.Cancelled}
              className="cancelled"
            />
          </div>

          <div className="appointment-list">
            {todayAppointments
              .slice(0, 5)
              .map((appointment) => (
                <div
                  className="appointment-row"
                  key={appointment.appointmentId}
                >
                  <div className="appointment-avatar">
                    {String(
                      appointment.patientName ||
                        appointment.patient?.patientName ||
                        "P"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="appointment-info">
                    <strong>
                      {appointment.patientName ||
                        appointment.patient?.patientName ||
                        `Patient #${appointment.patientId}`}
                    </strong>

                    <span>
                      Doctor #{appointment.doctorId}
                    </span>
                  </div>

                  <span className="appointment-time">
                    {appointment.appointmentTime ||
                      appointment.time ||
                      "--:--"}
                  </span>

                  <StatusBadge
                    status={
                      appointment.status
                    }
                  />
                </div>
              ))}

            {todayAppointments.length === 0 && (
              <EmptyState text="No appointments scheduled for today." />
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                FINANCE
              </span>
              <h2>Revenue Summary</h2>
              <p>Hospital billing overview</p>
            </div>
          </div>

          <div className="revenue-card">
            <span>Total Paid Revenue</span>

            <strong>
              ₹{paidRevenue.toLocaleString("en-IN")}
            </strong>

            <div className="revenue-line">
              <span></span>
            </div>

            <small>
              Based on completed payments
            </small>
          </div>

          <div className="finance-row">
            <div>
              <span>Total Bills</span>
              <strong>{billing.length}</strong>
            </div>

            <div>
              <span>Pending Bills</span>
              <strong>{pendingBills}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                RESOURCES
              </span>
              <h2>Bed Availability</h2>
              <p>Current hospital bed status</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                openPage("beds")
              }
            >
              Manage →
            </button>
          </div>

          <div className="bed-overview">
            <div className="bed-circle">
              <strong>
                {beds.length
                  ? Math.round(
                      (availableBeds /
                        beds.length) *
                        100
                    )
                  : 0}
                %
              </strong>
              <span>Available</span>
            </div>

            <div className="bed-details">
              <div>
                <span>
                  <i className="dot available"></i>
                  Available
                </span>
                <strong>{availableBeds}</strong>
              </div>

              <div>
                <span>
                  <i className="dot occupied"></i>
                  Occupied
                </span>
                <strong>{occupiedBeds}</strong>
              </div>

              <div>
                <span>
                  <i className="dot maintenance"></i>
                  Maintenance
                </span>
                <strong>
                  {
                    beds.filter(
                      (bed) =>
                        bed.status ===
                        "Maintenance"
                    ).length
                  }
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                QUICK ACCESS
              </span>
              <h2>Hospital Modules</h2>
              <p>Manage hospital operations</p>
            </div>
          </div>

          <div className="quick-grid">
            <QuickAction
              icon="♙"
              label="Patients"
              onClick={() =>
                openPage("patients")
              }
            />

            <QuickAction
              icon="⚕"
              label="Doctors"
              onClick={() =>
                openPage("doctors")
              }
            />

            <QuickAction
              icon="▣"
              label="Appointments"
              onClick={() =>
                openPage("appointments")
              }
            />

            <QuickAction
              icon="₹"
              label="Billing"
              onClick={() =>
                openPage("billing")
              }
            />
          </div>
        </div>
      </section>
    </>
  );

  // =====================================================
  // DOCTOR OVERVIEW
  // =====================================================

  const DoctorOverview = () => (
    <>
      <Header
        title="Doctor Dashboard"
        subtitle={`Welcome back, ${username}. Here's your clinical schedule.`}
      />

      <section className="welcome-banner doctor-banner">
        <div>
          <span className="welcome-small">
            CLINICAL WORKSPACE
          </span>

          <h2>
            Welcome, Dr. {username} 👨‍⚕️
          </h2>

          <p>
            Review your appointments and patient
            schedule from one secure workspace.
          </p>
        </div>

        <div className="doctor-status">
          <span className="status-dot"></span>
          Available
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          icon="▣"
          label="Today's Appointments"
          value={doctorTodayAppointments.length}
          description="Appointments today"
          className="purple"
        />

        <StatCard
          icon="▣"
          label="Total Appointments"
          value={doctorAppointments.length}
          description="All assigned appointments"
          className="blue"
        />

        <StatCard
          icon="✓"
          label="Completed"
          value={
            doctorAppointments.filter(
              (a) => a.status === "Completed"
            ).length
          }
          description="Completed consultations"
          className="green"
        />

        <StatCard
          icon="!"
          label="Pending"
          value={
            doctorAppointments.filter(
              (a) =>
                a.status === "Pending" ||
                a.status === "Scheduled"
            ).length
          }
          description="Requires attention"
          className="orange"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                SCHEDULE
              </span>

              <h2>Today's Appointments</h2>

              <p>
                Your appointments scheduled for today
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                openPage("doctorAppointments")
              }
            >
              View all →
            </button>
          </div>

          <AppointmentTable
            appointments={doctorTodayAppointments}
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                PROFILE
              </span>

              <h2>Professional Profile</h2>

              <p>Your hospital information</p>
            </div>
          </div>

          <ProfileCard
            name={
              doctorProfile?.doctorName ||
              `Dr. ${username}`
            }
            role={
              doctorProfile?.specialization ||
              "Medical Professional"
            }
            phone={doctorProfile?.phone}
            email={doctorProfile?.email}
          />
        </div>
      </section>
    </>
  );

  // =====================================================
  // PATIENT OVERVIEW
  // =====================================================

  const PatientOverview = () => (
    <>
      <Header
        title="Patient Dashboard"
        subtitle={`Welcome back, ${username}. Manage your healthcare appointments.`}
      />

      <section className="welcome-banner patient-banner">
        <div>
          <span className="welcome-small">
            PERSONAL HEALTHCARE
          </span>

          <h2>
            Welcome back, {username} 👋
          </h2>

          <p>
            View your appointments, doctors and
            healthcare information.
          </p>
        </div>

        <button
          className="primary-action"
          onClick={() =>
            openPage("bookAppointment")
          }
        >
          + Book Appointment
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          icon="▣"
          label="Upcoming"
          value={upcomingAppointments.length}
          description="Upcoming appointments"
          className="purple"
        />

        <StatCard
          icon="✓"
          label="Completed"
          value={
            patientAppointments.filter(
              (a) => a.status === "Completed"
            ).length
          }
          description="Completed visits"
          className="green"
        />

        <StatCard
          icon="▤"
          label="Appointments"
          value={patientAppointments.length}
          description="Total appointments"
          className="blue"
        />

        <StatCard
          icon="⚕"
          label="Doctors"
          value={doctors.length}
          description="Hospital specialists"
          className="orange"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                MY HEALTHCARE
              </span>

              <h2>Upcoming Appointments</h2>

              <p>Your scheduled consultations</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                openPage("patientAppointments")
              }
            >
              View all →
            </button>
          </div>

          <AppointmentTable
            appointments={upcomingAppointments.slice(
              0,
              5
            )}
          />

          {upcomingAppointments.length === 0 && (
            <div className="empty-action">
              <p>No upcoming appointments.</p>

              <button
                className="primary-action"
                onClick={() =>
                  openPage("bookAppointment")
                }
              >
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">
                PATIENT PROFILE
              </span>

              <h2>My Information</h2>

              <p>Your registered details</p>
            </div>
          </div>

          <ProfileCard
            name={
              patientProfile?.patientName ||
              username
            }
            role="Patient"
            phone={patientProfile?.phone}
            email={patientProfile?.email}
            age={patientProfile?.age}
            bloodGroup={
              patientProfile?.bloodGroup
            }
          />
        </div>
      </section>
    </>
  );

  // =====================================================
  // STAT CARD
  // =====================================================

  function StatCard({
    icon,
    label,
    value,
    description,
    className,
  }) {
    return (
      <div className="stat-card">
        <div className={`stat-icon ${className}`}>
          {icon}
        </div>

        <div className="stat-content">
          <span>{label}</span>

          <strong>
            {loading ? "—" : value}
          </strong>

          <small>{description}</small>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATUS CARD
  // =====================================================

  function StatusCard({
    label,
    value,
    className,
  }) {
    return (
      <div className={`status-card ${className}`}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    );
  }

  // =====================================================
  // STATUS BADGE
  // =====================================================

  function StatusBadge({ status, onClick, title }) {
    const safeStatus = status || "Scheduled";

    if (onClick) {
      return (
        <button
          type="button"
          className={`status-badge ${safeStatus
            .toLowerCase()
            .replace(" ", "-")}`}
          onClick={onClick}
          title={title}
          style={{
            cursor: "pointer",
            border: "none",
            font: "inherit",
          }}
        >
          {safeStatus}
        </button>
      );
    }

    return (
      <span
        className={`status-badge ${safeStatus
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        {safeStatus}
      </span>
    );
  }

  // =====================================================
  // APPOINTMENT TABLE
  // =====================================================

  function AppointmentTable({
    appointments: data,
  }) {
    return (
      <div className="professional-table-wrapper">
        <table className="professional-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((appointment, index) => (
                <tr
                  key={
                    appointment.appointmentId ||
                    index
                  }
                >
                  <td>
                    <div className="table-person">
                      <div className="mini-avatar">
                        {String(
                          appointment.patientName ||
                            appointment.patient
                              ?.patientName ||
                            "P"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {appointment.patientName ||
                            appointment.patient
                              ?.patientName ||
                            `Patient #${
                              appointment.patientId ||
                              "-"
                            }`}
                        </strong>

                        <span>
                          Patient
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    {formatDate(
                      appointment.appointmentDate ||
                        appointment.date
                    )}
                  </td>

                  <td>
                    {appointment.appointmentTime ||
                      appointment.time ||
                      "--:--"}
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        appointment.status
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="empty-table"
                >
                  No appointment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // =====================================================
  // PROFILE CARD
  // =====================================================

  function ProfileCard({
    name,
    role,
    phone,
    email,
    age,
    bloodGroup,
  }) {
    return (
      <div className="profile-card">
        <div className="profile-large-avatar">
          {name
            .charAt(0)
            .toUpperCase()}
        </div>

        <h3>{name}</h3>

        <span className="profile-role">
          {role}
        </span>

        <div className="profile-details">
          {phone && (
            <div>
              <span>Phone</span>
              <strong>{phone}</strong>
            </div>
          )}

          {email && (
            <div>
              <span>Email</span>
              <strong>{email}</strong>
            </div>
          )}

          {age && (
            <div>
              <span>Age</span>
              <strong>{age}</strong>
            </div>
          )}

          {bloodGroup && (
            <div>
              <span>Blood Group</span>
              <strong>{bloodGroup}</strong>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // QUICK ACTION
  // =====================================================

  function QuickAction({
    icon,
    label,
    onClick,
  }) {
    return (
      <button
        className="quick-action"
        onClick={onClick}
      >
        <span>{icon}</span>
        <strong>{label}</strong>
        <small>Open →</small>
      </button>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  function EmptyState({ text }) {
    return (
      <div className="empty-state">
        <div>○</div>
        <p>{text}</p>
      </div>
    );
  }

  // =====================================================
  // ADMIN MODULE PAGE
  // =====================================================

  const AdminModule = ({
    type,
    title,
    subtitle,
    data,
    columns,
  }) => {
    const [search, setSearch] =
      useState("");

    const filteredData = data.filter(
      (item) =>
        JSON.stringify(item)
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    return (
      <>
        <Header
          title={title}
          subtitle={subtitle}
        />

        <section className="module-toolbar">
          <div>
            <span className="record-count">
              {filteredData.length} Records
            </span>
          </div>

          <div className="toolbar-actions">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder={`Search ${type}...`}
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="refresh-button large"
              onClick={loadDashboardData}
            >
              ↻ Refresh
            </button>
          </div>
        </section>

        <div className="panel table-panel">
          <div className="professional-table-wrapper">
            <table className="professional-table full-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(
                    (item, index) => (
                      <tr
                        key={
                          item[
                            columns[0].key
                          ] || index
                        }
                      >
                        {columns.map(
                          (column) => (
                            <td
                              key={
                                column.key
                              }
                            >
                              {column.render
                                ? column.render(
                                    item
                                  )
                                : item[
                                    column.key
                                  ] ??
                                  "-"}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        columns.length
                      }
                      className="empty-table"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  // =====================================================
  // BOOK APPOINTMENT PAGE
  // =====================================================

  const BookAppointment = () => {
    const [doctorIdValue, setDoctorIdValue] =
      useState("");
    const [dateValue, setDateValue] =
      useState("");
    const [timeValue, setTimeValue] =
      useState("");
    const [bookingMessage, setBookingMessage] =
      useState("");

    const bookAppointment = async (e) => {
      e.preventDefault();

      if (!patientId) {
        setBookingMessage(
          "Patient profile could not be found."
        );
        return;
      }

      if (
        !doctorIdValue ||
        !dateValue ||
        !timeValue
      ) {
        setBookingMessage(
          "Please fill all appointment details."
        );
        return;
      }

      try {
        const response = await fetch(
          `${API}/appointments`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              patientId: Number(patientId),
              doctorId: Number(doctorIdValue),
              appointmentDate: dateValue,
              appointmentTime: timeValue,
              status: "Pending",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Booking failed"
          );
        }

        setBookingMessage(
          "Appointment booked successfully."
        );

        setDoctorIdValue("");
        setDateValue("");
        setTimeValue("");

        loadDashboardData();
      } catch (err) {
        console.error(err);

        setBookingMessage(
          "Unable to book appointment. Please check the backend."
        );
      }
    };

    return (
      <>
        <Header
          title="Book an Appointment"
          subtitle="Schedule a consultation with one of our doctors."
        />

        <div className="booking-layout">
          <div className="panel booking-panel">
            <div className="panel-header">
              <div>
                <span className="section-kicker">
                  APPOINTMENT REQUEST
                </span>

                <h2>
                  Schedule Consultation
                </h2>

                <p>
                  Select your preferred doctor,
                  date and time.
                </p>
              </div>
            </div>

            <form
              className="booking-form"
              onSubmit={bookAppointment}
            >
              <label>
                Select Doctor

                <select
                  value={doctorIdValue}
                  onChange={(e) =>
                    setDoctorIdValue(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Choose a doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.doctorId}
                      value={
                        doctor.doctorId
                      }
                    >
                      {doctor.doctorName} —{" "}
                      {doctor.specialization}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-row">
                <label>
                  Appointment Date

                  <input
                    type="date"
                    value={dateValue}
                    min={todayString}
                    onChange={(e) =>
                      setDateValue(
                        e.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Appointment Time

                  <input
                    type="time"
                    value={timeValue}
                    onChange={(e) =>
                      setTimeValue(
                        e.target.value
                      )
                    }
                  />
                </label>
              </div>

              {bookingMessage && (
                <div className="booking-message">
                  {bookingMessage}
                </div>
              )}

              <button
                className="primary-action full-width"
                type="submit"
              >
                Confirm Appointment
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="section-kicker">
                  OUR SPECIALISTS
                </span>

                <h2>Available Doctors</h2>

                <p>
                  Choose from our hospital
                  specialists.
                </p>
              </div>
            </div>

            <div className="doctor-list">
              {doctors
                .filter(
                  (doctor) =>
                    doctor.availabilityStatus ===
                      "Available" ||
                    doctor.status ===
                      "Available"
                )
                .slice(0, 6)
                .map((doctor) => (
                  <div
                    className="doctor-list-item"
                    key={doctor.doctorId}
                  >
                    <div className="doctor-avatar">
                      {String(
                        doctor.doctorName ||
                          "D"
                      )
                        .replace(
                          "Dr. ",
                          ""
                        )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {doctor.doctorName}
                      </strong>

                      <span>
                        {doctor.specialization}
                      </span>
                    </div>

                    <span className="available-label">
                      Available
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  // =====================================================
  // PAGE CONTENT
  // =====================================================

  const renderPage = () => {
    // ---------------- ADMIN ----------------

    if (
      role === "Admin" &&
      currentPage === "dashboard"
    ) {
      return <AdminOverview />;
    }

    if (
      role === "Admin" &&
      currentPage === "patients"
    ) {
      return (
        <AdminModule
          type="patients"
          title="Patient Management"
          subtitle="Manage registered patients and their information."
          data={patients}
          columns={[
            {
              key: "patientId",
              label: "ID",
            },
            {
              key: "patientName",
              label: "Patient",
            },
            {
              key: "gender",
              label: "Gender",
            },
            {
              key: "age",
              label: "Age",
            },
            {
              key: "phone",
              label: "Phone",
            },
            {
              key: "bloodGroup",
              label: "Blood Group",
            },
            {
              key: "admissionDate",
              label: "Admission",
              render: (item) =>
                formatDate(
                  item.admissionDate
                ),
            },
          ]}
        />
      );
    }

    if (
      role === "Admin" &&
      currentPage === "doctors"
    ) {
      return (
        <AdminModule
          type="doctors"
          title="Doctor Management"
          subtitle="Manage doctors, specializations and availability."
          data={doctors}
          columns={[
            {
              key: "doctorId",
              label: "ID",
            },
            {
              key: "doctorName",
              label: "Doctor",
            },
            {
              key: "specialization",
              label: "Specialization",
            },
            {
              key: "phone",
              label: "Phone",
            },
            {
              key: "email",
              label: "Email",
            },
            {
              key: "availabilityStatus",
              label: "Availability",
              render: (item) => {
                const currentStatus =
                  item.availabilityStatus ||
                  item.status ||
                  "Available";

                const nextStatus =
                  currentStatus === "Available"
                    ? "Busy"
                    : currentStatus === "Busy"
                    ? "On Leave"
                    : "Available";

                return (
                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      updateDoctorAvailability(
                        item.doctorId,
                        e.target.value
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                );
              },
            },
          ]}
        />
      );
    }

    if (
      role === "Admin" &&
      currentPage === "appointments"
    ) {
      return (
        <AdminModule
          type="appointments"
          title="Appointment Management"
          subtitle="Monitor and manage all hospital appointments."
          data={appointments}
          columns={[
            {
              key: "appointmentId",
              label: "ID",
            },
            {
              key: "patientId",
              label: "Patient ID",
            },
            {
              key: "doctorId",
              label: "Doctor ID",
            },
            {
              key: "appointmentDate",
              label: "Date",
              render: (item) =>
                formatDate(
                  item.appointmentDate
                ),
            },
            {
              key: "appointmentTime",
              label: "Time",
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <StatusBadge
                  status={item.status}
                />
              ),
            },
          ]}
        />
      );
    }

    if (
      role === "Admin" &&
      currentPage === "beds"
    ) {
      return (
        <AdminModule
          type="beds"
          title="Bed Management"
          subtitle="Monitor hospital bed availability and occupancy."
          data={beds}
          columns={[
            {
              key: "bedId",
              label: "ID",
            },
            {
              key: "bedNumber",
              label: "Bed Number",
            },
            {
              key: "ward",
              label: "Ward",
            },
            {
              key: "status",
              label: "Status",
              render: (item) => {
                const currentStatus =
                  item.status || "Available";

                const nextStatus =
                  currentStatus === "Available"
                    ? "Occupied"
                    : "Available";

                return (
                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      updateBedStatus(
                        item.bedId,
                        e.target.value
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                );
              },
            },
          ]}
        />
      );
    }

    if (
      role === "Admin" &&
      currentPage === "billing"
    ) {
      return (
        <AdminModule
          type="billing"
          title="Billing & Revenue"
          subtitle="Manage hospital bills and payment records."
          data={billing}
          columns={[
            {
              key: "billId",
              label: "Bill ID",
            },
            {
              key: "patientId",
              label: "Patient ID",
            },
            {
              key: "amount",
              label: "Amount",
              render: (item) =>
                `₹${Number(
                  item.amount || 0
                ).toLocaleString(
                  "en-IN"
                )}`,
            },
            {
              key: "paymentStatus",
              label: "Payment",
              render: (item) => {
                const currentStatus =
                  item.paymentStatus ||
                  item.status ||
                  "Pending";

                const nextStatus =
                  currentStatus === "Paid"
                    ? "Pending"
                    : "Paid";

                return (
                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      updateBillingStatus(
                        item.billId,
                        e.target.value
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                );
              },
            },
            {
              key: "billDate",
              label: "Date",
              render: (item) =>
                formatDate(
                  item.billDate
                ),
            },
          ]}
        />
      );
    }

    if (
      role === "Admin" &&
      currentPage === "revenue"
    ) {
      const paidBills = billing.filter(
        (bill) =>
          (bill.paymentStatus || bill.status) === "Paid"
      );

      const pendingBills = billing.filter(
        (bill) =>
          (bill.paymentStatus || bill.status) === "Pending"
      );

      const paidAmount = paidBills.reduce(
        (total, bill) =>
          total + Number(bill.amount || 0),
        0
      );

      const pendingAmount = pendingBills.reduce(
        (total, bill) =>
          total + Number(bill.amount || 0),
        0
      );

      return (
        <>
          <Header
            title="Revenue Overview"
            subtitle="Monitor hospital revenue and payment collection."
          />

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">₹</div>
              <div>
                <span>Total Revenue</span>
                <strong>₹{(paidAmount + pendingAmount).toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div>
                <span>Paid Revenue</span>
                <strong>₹{paidAmount.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">◷</div>
              <div>
                <span>Pending Revenue</span>
                <strong>₹{pendingAmount.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">#</div>
              <div>
                <span>Total Bills</span>
                <strong>{billing.length}</strong>
              </div>
            </div>
          </div>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Revenue & Payment Records</h2>
                <p>Paid and pending billing records.</p>
              </div>
              <button
                className="refresh-button large"
                onClick={loadDashboardData}
              >
                ↻ Refresh
              </button>
            </div>

            <div className="professional-table-wrapper">
              <table className="professional-table full-table">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Patient ID</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.length > 0 ? (
                    billing.map((bill) => {
                      const currentStatus =
                        bill.paymentStatus ||
                        bill.status ||
                        "Pending";

                      const nextStatus =
                        currentStatus === "Paid"
                          ? "Pending"
                          : "Paid";

                      return (
                        <tr key={bill.billId}>
                          <td>{bill.billId}</td>
                          <td>{bill.patientId ?? bill.patient?.patientId ?? "-"}</td>
                          <td>₹{Number(bill.amount || 0).toLocaleString("en-IN")}</td>
                          <td>
                            <StatusBadge
                              status={currentStatus}
                              title={`Click to change to ${nextStatus}`}
                              onClick={() =>
                                updateBillingStatus(
                                  bill.billId,
                                  nextStatus
                                )
                              }
                            />
                          </td>
                          <td>{formatDate(bill.billDate)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-table">
                        No billing records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      );
    }

    // ---------------- DOCTOR ----------------

    if (
      role === "Doctor" &&
      currentPage === "dashboard"
    ) {
      return <DoctorOverview />;
    }

    if (
      role === "Doctor" &&
      currentPage === "doctorAppointments"
    ) {
      return (
        <AdminModule
          type="appointments"
          title="My Appointments"
          subtitle="View your assigned patient appointments."
          data={doctorAppointments}
          columns={[
            {
              key: "appointmentId",
              label: "ID",
            },
            {
              key: "patientId",
              label: "Patient",
            },
            {
              key: "appointmentDate",
              label: "Date",
              render: (item) =>
                formatDate(
                  item.appointmentDate
                ),
            },
            {
              key: "appointmentTime",
              label: "Time",
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <StatusBadge
                  status={item.status}
                />
              ),
            },
          ]}
        />
      );
    }

    if (
      role === "Doctor" &&
      currentPage === "doctorPatients"
    ) {
      const ids = [
        ...new Set(
          doctorAppointments.map(
            (a) =>
              Number(
                a.patientId ??
                  a.patient?.patientId
              )
          )
        ),
      ];

      const myPatients =
        patients.filter((patient) =>
          ids.includes(
            Number(patient.patientId)
          )
        );

      return (
        <AdminModule
          type="patients"
          title="My Patients"
          subtitle="Patients assigned to your appointments."
          data={myPatients}
          columns={[
            {
              key: "patientId",
              label: "ID",
            },
            {
              key: "patientName",
              label: "Patient",
            },
            {
              key: "gender",
              label: "Gender",
            },
            {
              key: "age",
              label: "Age",
            },
            {
              key: "phone",
              label: "Phone",
            },
            {
              key: "bloodGroup",
              label: "Blood Group",
            },
          ]}
        />
      );
    }

    if (
      role === "Doctor" &&
      currentPage === "doctorProfile"
    ) {
      return (
        <>
          <Header
            title="My Profile"
            subtitle="View your professional information."
          />

          <div className="single-profile-layout">
            <div className="panel">
              <ProfileCard
                name={
                  doctorProfile?.doctorName ||
                  `Dr. ${username}`
                }
                role={
                  doctorProfile?.specialization ||
                  "Medical Professional"
                }
                phone={
                  doctorProfile?.phone
                }
                email={
                  doctorProfile?.email
                }
              />
            </div>
          </div>
        </>
      );
    }

    // ---------------- PATIENT ----------------

    if (
      role === "Patient" &&
      currentPage === "dashboard"
    ) {
      return <PatientOverview />;
    }

    if (
      role === "Patient" &&
      currentPage ===
        "patientAppointments"
    ) {
      return (
        <AdminModule
          type="appointments"
          title="My Appointments"
          subtitle="View your upcoming and previous consultations."
          data={patientAppointments}
          columns={[
            {
              key: "appointmentId",
              label: "ID",
            },
            {
              key: "doctorId",
              label: "Doctor",
            },
            {
              key: "appointmentDate",
              label: "Date",
              render: (item) =>
                formatDate(
                  item.appointmentDate
                ),
            },
            {
              key: "appointmentTime",
              label: "Time",
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <StatusBadge
                  status={item.status}
                />
              ),
            },
          ]}
        />
      );
    }

    if (
      role === "Patient" &&
      currentPage ===
        "bookAppointment"
    ) {
      return <BookAppointment />;
    }

    if (
      role === "Patient" &&
      currentPage === "patientDoctors"
    ) {
      return (
        <>
          <Header
            title="Our Doctors"
            subtitle="Find the right specialist for your healthcare needs."
          />

          <div className="doctor-grid">
            {doctors.map((doctor) => (
              <div
                className="doctor-card"
                key={doctor.doctorId}
              >
                <div className="doctor-card-top">
                  <div className="doctor-avatar large">
                    {String(
                      doctor.doctorName ||
                        "D"
                    )
                      .replace(
                        "Dr. ",
                        ""
                      )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span
                    className={
                      doctor.availabilityStatus ===
                        "Available"
                        ? "available-label"
                        : "busy-label"
                    }
                  >
                    {doctor.availabilityStatus ||
                      "Available"}
                  </span>
                </div>

                <h3>
                  {doctor.doctorName}
                </h3>

                <p>
                  {doctor.specialization}
                </p>

                <div className="doctor-contact">
                  <span>
                    ☎ {doctor.phone || "-"}
                  </span>

                  <span>
                    ✉ {doctor.email || "-"}
                  </span>
                </div>

                <button
                  className="outline-action"
                  onClick={() => {
                    setCurrentPage(
                      "bookAppointment"
                    );
                  }}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (
      role === "Patient" &&
      currentPage === "patientProfile"
    ) {
      return (
        <>
          <Header
            title="My Profile"
            subtitle="View your personal healthcare information."
          />

          <div className="single-profile-layout">
            <div className="panel">
              <ProfileCard
                name={
                  patientProfile?.patientName ||
                  username
                }
                role="Patient"
                phone={
                  patientProfile?.phone
                }
                age={
                  patientProfile?.age
                }
                bloodGroup={
                  patientProfile?.bloodGroup
                }
              />
            </div>
          </div>
        </>
      );
    }

    return role === "Admin" ? (
      <AdminOverview />
    ) : role === "Doctor" ? (
      <DoctorOverview />
    ) : (
      <PatientOverview />
    );
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default Dashboard;