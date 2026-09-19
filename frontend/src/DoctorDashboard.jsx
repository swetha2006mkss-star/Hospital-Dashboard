import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const username = localStorage.getItem("username");

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // GET TODAY'S LOCAL DATE
  // --------------------------------------------------
  const getTodayDate = () => {
    const today = new Date();

    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  // --------------------------------------------------
  // LOAD DOCTOR DATA
  // --------------------------------------------------
  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      setLoading(true);

      // ------------------------------------------------
      // GET DOCTORS
      // ------------------------------------------------
      const doctorsResponse = await fetch(
        "http://localhost:8080/api/doctors"
      );

      if (!doctorsResponse.ok) {
        throw new Error("Unable to load doctors");
      }

      const doctors = await doctorsResponse.json();

      console.log("Doctors from backend:", doctors);
      console.log("Logged in username:", username);

      // ------------------------------------------------
      // MATCH USERNAME WITH DOCTOR NAME
      // drjohn -> Dr. John
      // ------------------------------------------------
      const cleanUsername = (username || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/^dr/, "");

      const currentDoctor = doctors.find((d) => {
        const doctorName = (d.doctorName || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .replace(/^dr/, "");

        return doctorName === cleanUsername;
      });

      console.log("Current Doctor:", currentDoctor);

      if (!currentDoctor) {
        setDoctor(null);
        setLoading(false);
        return;
      }

      setDoctor(currentDoctor);

      // ------------------------------------------------
      // GET DOCTOR APPOINTMENTS
      // ------------------------------------------------
      const appointmentResponse = await fetch(
        `http://localhost:8080/api/appointments/doctor/${currentDoctor.doctorId}`
      );

      if (!appointmentResponse.ok) {
        throw new Error("Unable to load appointments");
      }

      const appointmentData = await appointmentResponse.json();

      console.log(
        "Doctor appointments:",
        appointmentData
      );

      setAppointments(appointmentData);

      // ------------------------------------------------
      // GET PATIENTS
      // ------------------------------------------------
      const patientResponse = await fetch(
        "http://localhost:8080/api/patients"
      );

      if (patientResponse.ok) {
        const patientData = await patientResponse.json();

        console.log(
          "Patients from backend:",
          patientData
        );

        setPatients(patientData);
      }

    } catch (error) {
      console.error(
        "Doctor Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // TODAY
  // --------------------------------------------------
  const today = getTodayDate();

  // --------------------------------------------------
  // TODAY'S APPOINTMENTS
  // --------------------------------------------------
  const todayAppointments = appointments.filter(
    (a) => a.appointmentDate === today
  );

  // --------------------------------------------------
  // COMPLETED
  // --------------------------------------------------
  const completedAppointments =
    appointments.filter(
      (a) => a.status === "Completed"
    );

  // --------------------------------------------------
  // PENDING
  // --------------------------------------------------
  const pendingAppointments =
    appointments.filter(
      (a) =>
        a.status === "Pending" ||
        a.status === "Scheduled"
    );

  // --------------------------------------------------
  // GET PATIENT
  // --------------------------------------------------
  const getPatient = (patientId) => {
    return patients.find(
      (p) =>
        Number(p.patientId) ===
        Number(patientId)
    );
  };

  // --------------------------------------------------
  // GET PATIENT NAME
  // --------------------------------------------------
  const getPatientName = (patientId) => {
    const patient = getPatient(patientId);

    return (
      patient?.patientName ||
      `Patient #${patientId}`
    );
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    window.location.reload();
  };

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="doctor-dashboard-loading">
        Loading Doctor Dashboard...
      </div>
    );
  }

  // --------------------------------------------------
  // DOCTOR NOT FOUND
  // --------------------------------------------------
  if (!doctor) {
    return (
      <div className="doctor-not-found">

        <h2>Doctor not found</h2>

        <p>
          Unable to find doctor details for username:{" "}
          <strong>{username}</strong>
        </p>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>
    );
  }

  return (
    <div className="doctor-dashboard">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="doctor-sidebar">

        {/* BRAND */}

        <div className="doctor-brand">

          <div className="doctor-brand-icon">
            ♥
          </div>

          <div>
            <h2>Hospital</h2>
            <span>Doctor Portal</span>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="doctor-nav">

          <button
            className={
              activeSection === "Dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("Dashboard")
            }
          >
            🏠
            <span>Dashboard</span>
          </button>


          <button
            className={
              activeSection === "My Appointments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection(
                "My Appointments"
              )
            }
          >
            📅
            <span>My Appointments</span>
          </button>


          <button
            className={
              activeSection === "My Patients"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("My Patients")
            }
          >
            🧑‍⚕️
            <span>My Patients</span>
          </button>


          <button
            className={
              activeSection === "My Profile"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("My Profile")
            }
          >
            👤
            <span>My Profile</span>
          </button>

        </nav>


        {/* LOGOUT */}

        <button
          className="doctor-logout"
          onClick={handleLogout}
        >
          🚪
          <span>Logout</span>
        </button>

      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="doctor-main">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="doctor-header">

          <div>

            <h1>
              Doctor Dashboard
            </h1>

            <p>
              Manage your appointments and patients
            </p>

          </div>


          {/* USER */}

          <div className="doctor-user-card">

            <div className="doctor-user-avatar">

              {(doctor.doctorName || "D")
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <strong>
                {doctor.doctorName}
              </strong>

              <span>
                Doctor
              </span>

            </div>

          </div>

        </header>


        {/* ==================================================
            DASHBOARD
        ================================================== */}

        {activeSection === "Dashboard" && (

          <div className="doctor-content">

            {/* ==================================================
                DOCTOR INFORMATION
            ================================================== */}

            <section className="doctor-info-card">

              <div className="doctor-info-left">

                <div className="doctor-profile-icon">
                  👨‍⚕️
                </div>

                <div>

                  <h2>
                    Doctor
                  </h2>

                  <h3>
                    {doctor.doctorName}
                  </h3>

                  <p>
                    Doctor ID: #{doctor.doctorId}
                  </p>

                </div>

              </div>


              <div className="doctor-info-item">

                <span>
                  Specialization
                </span>

                <strong>
                  {doctor.specialization || "-"}
                </strong>

              </div>


              <div className="doctor-info-item">

                <span>
                  Availability
                </span>

                <strong>
                  {doctor.availabilityStatus || "-"}
                </strong>

              </div>


              <div className="doctor-info-item">

                <span>
                  Phone
                </span>

                <strong>
                  {doctor.phone || "-"}
                </strong>

              </div>

            </section>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <section className="doctor-stats">

              {/* TODAY */}

              <div className="doctor-stat-card">

                <div className="stat-icon blue">
                  📅
                </div>

                <div>

                  <span>
                    Today's Appointments
                  </span>

                  <strong>
                    {todayAppointments.length}
                  </strong>

                </div>

              </div>


              {/* COMPLETED */}

              <div className="doctor-stat-card">

                <div className="stat-icon green">
                  ✓
                </div>

                <div>

                  <span>
                    Completed Visits
                  </span>

                  <strong>
                    {completedAppointments.length}
                  </strong>

                </div>

              </div>


              {/* PATIENTS */}

              <div className="doctor-stat-card">

                <div className="stat-icon purple">
                  🧑‍🤝‍🧑
                </div>

                <div>

                  <span>
                    My Patients
                  </span>

                  <strong>
                    {patients.length}
                  </strong>

                </div>

              </div>

            </section>


            {/* ==================================================
                TODAY'S APPOINTMENTS
            ================================================== */}

            <section className="doctor-panel">

              <div className="doctor-panel-heading">

                <div className="panel-icon">
                  📅
                </div>

                <div>

                  <h2>
                    Today's Appointments
                  </h2>

                  <p>
                    View your scheduled appointments for today
                  </p>

                </div>

              </div>


              {todayAppointments.length === 0 ? (

                <div className="empty-state">

                  <div>
                    📅
                  </div>

                  <p>
                    No appointments scheduled for today
                  </p>

                </div>

              ) : (

                <div className="appointment-list">

                  {todayAppointments.map(
                    (appointment) => {

                      const patient =
                        getPatient(
                          appointment.patientId
                        );

                      return (

                        <div
                          className="appointment-item"
                          key={
                            appointment.appointmentId
                          }
                        >

                          <div className="appointment-date">

                            <strong>
                              {appointment.appointmentTime?.slice(
                                0,
                                5
                              )}
                            </strong>

                            <span>
                              Today
                            </span>

                          </div>


                          <div className="appointment-patient">

                            <strong>
                              {patient?.patientName ||
                                `Patient #${appointment.patientId}`}
                            </strong>

                            <span>
                              Age: {patient?.age || "-"}
                              {" • "}
                              Gender:{" "}
                              {patient?.gender || "-"}
                              {" • "}
                              Blood Group:{" "}
                              {patient?.bloodGroup || "-"}
                              {" • "}
                              Phone:{" "}
                              {patient?.phone || "-"}
                            </span>

                          </div>


                          <span
                            className={`status ${(
                              appointment.status || ""
                            ).toLowerCase()}`}
                          >
                            {appointment.status}
                          </span>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

            </section>


            {/* ==================================================
                RECENT APPOINTMENTS
            ================================================== */}

            <section className="doctor-panel">

              <div className="doctor-panel-heading">

                <div className="panel-icon">
                  📋
                </div>

                <div>

                  <h2>
                    Recent Appointments
                  </h2>

                  <p>
                    Your latest patient appointments
                  </p>

                </div>

              </div>


              {appointments.length === 0 ? (

                <div className="empty-state">

                  <div>
                    📋
                  </div>

                  <p>
                    No appointments found
                  </p>

                </div>

              ) : (

                <div className="doctor-table-wrapper">

                  <table className="doctor-table">

                    <thead>

                      <tr>

                        <th>Date</th>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Blood Group</th>
                        <th>Phone</th>
                        <th>Status</th>

                      </tr>

                    </thead>


                    <tbody>

                      {appointments
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(
                              `${b.appointmentDate}T${b.appointmentTime}`
                            ) -
                            new Date(
                              `${a.appointmentDate}T${a.appointmentTime}`
                            )
                        )
                        .slice(0, 5)
                        .map(
                          (appointment) => {

                            const patient =
                              getPatient(
                                appointment.patientId
                              );

                            return (

                              <tr
                                key={
                                  appointment.appointmentId
                                }
                              >

                                <td>
                                  {
                                    appointment.appointmentDate
                                  }
                                </td>

                                <td>
                                  {appointment.appointmentTime?.slice(
                                    0,
                                    5
                                  )}
                                </td>

                                <td>

                                  <strong>
                                    {patient?.patientName ||
                                      `Patient #${appointment.patientId}`}
                                  </strong>

                                </td>

                                <td>
                                  {patient?.age || "-"}
                                </td>

                                <td>
                                  {patient?.gender || "-"}
                                </td>

                                <td>
                                  {patient?.bloodGroup || "-"}
                                </td>

                                <td>
                                  {patient?.phone || "-"}
                                </td>

                                <td>

                                  <span
                                    className={`status ${(
                                      appointment.status || ""
                                    ).toLowerCase()}`}
                                  >
                                    {appointment.status}
                                  </span>

                                </td>

                              </tr>

                            );

                          }
                        )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </div>

        )}


        {/* ==================================================
            MY APPOINTMENTS
        ================================================== */}

        {activeSection === "My Appointments" && (

          <div className="doctor-content">

            <section className="doctor-panel">

              <div className="doctor-panel-heading">

                <div className="panel-icon">
                  📅
                </div>

                <div>

                  <h2>
                    My Appointments
                  </h2>

                  <p>
                    All appointments assigned to you
                  </p>

                </div>

              </div>


              <div className="doctor-table-wrapper">

                <table className="doctor-table">

                  <thead>

                    <tr>

                      <th>
                        Appointment ID
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Time
                      </th>

                      <th>
                        Patient
                      </th>

                      <th>
                        Age
                      </th>

                      <th>
                        Gender
                      </th>

                      <th>
                        Blood Group
                      </th>

                      <th>
                        Phone
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {appointments.map(
                      (appointment) => {

                        const patient =
                          getPatient(
                            appointment.patientId
                          );

                        return (

                          <tr
                            key={
                              appointment.appointmentId
                            }
                          >

                            <td>
                              #{appointment.appointmentId}
                            </td>

                            <td>
                              {appointment.appointmentDate}
                            </td>

                            <td>
                              {appointment.appointmentTime?.slice(
                                0,
                                5
                              )}
                            </td>

                            <td>

                              <strong>
                                {patient?.patientName ||
                                  `Patient #${appointment.patientId}`}
                              </strong>

                            </td>

                            <td>
                              {patient?.age || "-"}
                            </td>

                            <td>
                              {patient?.gender || "-"}
                            </td>

                            <td>
                              {patient?.bloodGroup || "-"}
                            </td>

                            <td>
                              {patient?.phone || "-"}
                            </td>

                            <td>

                              <span
                                className={`status ${(
                                  appointment.status || ""
                                ).toLowerCase()}`}
                              >
                                {appointment.status}
                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            </section>

          </div>

        )}


        {/* ==================================================
            MY PATIENTS
        ================================================== */}

        {activeSection === "My Patients" && (

          <div className="doctor-content">

            <section className="doctor-panel">

              <div className="doctor-panel-heading">

                <div className="panel-icon">
                  🧑‍⚕️
                </div>

                <div>

                  <h2>
                    My Patients
                  </h2>

                  <p>
                    Patient details and contact information
                  </p>

                </div>

              </div>


              <div className="doctor-table-wrapper">

                <table className="doctor-table">

                  <thead>

                    <tr>

                      <th>
                        Patient ID
                      </th>

                      <th>
                        Patient Name
                      </th>

                      <th>
                        Age
                      </th>

                      <th>
                        Gender
                      </th>

                      <th>
                        Blood Group
                      </th>

                      <th>
                        Phone
                      </th>

                      <th>
                        Address
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {patients.length === 0 ? (

                      <tr>

                        <td
                          colSpan="7"
                          style={{
                            textAlign: "center",
                            padding: "30px"
                          }}
                        >
                          No patients found
                        </td>

                      </tr>

                    ) : (

                      patients.map(
                        (patient) => (

                          <tr
                            key={
                              patient.patientId
                            }
                          >

                            <td>
                              #{patient.patientId}
                            </td>

                            <td>

                              <strong>
                                {patient.patientName}
                              </strong>

                            </td>

                            <td>
                              {patient.age || "-"}
                            </td>

                            <td>
                              {patient.gender || "-"}
                            </td>

                            <td>

                              <span className="blood-group">
                                {patient.bloodGroup || "-"}
                              </span>

                            </td>

                            <td>
                              {patient.phone || "-"}
                            </td>

                            <td>
                              {patient.address || "-"}
                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </section>

          </div>

        )}


        {/* ==================================================
            MY PROFILE
        ================================================== */}

        {activeSection === "My Profile" && (

          <div className="doctor-content">

            <section className="professional-profile-card">

              {/* PROFILE HEADER */}

              <div className="professional-profile-header">

                <div className="professional-avatar">
                  👨‍⚕️
                </div>

                <div className="professional-profile-title">

                  <h2>
                    {doctor.doctorName}
                  </h2>

                  <p>
                    {doctor.specialization ||
                      "Medical Professional"}
                  </p>

                  <span className="doctor-verified">
                    ✓ Active Doctor
                  </span>

                </div>

              </div>


              {/* PROFILE BODY */}

              <div className="professional-profile-body">

                <h3>
                  Professional Information
                </h3>


                <div className="professional-info-grid">

                  <div className="professional-info-item">

                    <span>
                      Doctor ID
                    </span>

                    <strong>
                      #{doctor.doctorId}
                    </strong>

                  </div>


                  <div className="professional-info-item">

                    <span>
                      Specialization
                    </span>

                    <strong>
                      {doctor.specialization || "-"}
                    </strong>

                  </div>


                  <div className="professional-info-item">

                    <span>
                      Availability Status
                    </span>

                    <strong className="availability-text">

                      <span className="availability-dot"></span>

                      {doctor.availabilityStatus || "-"}

                    </strong>

                  </div>


                  <div className="professional-info-item">

                    <span>
                      Phone Number
                    </span>

                    <strong>
                      {doctor.phone || "-"}
                    </strong>

                  </div>


                  <div className="professional-info-item">

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {doctor.email || "-"}
                    </strong>

                  </div>


                  <div className="professional-info-item">

                    <span>
                      Account Role
                    </span>

                    <strong>
                      Doctor
                    </strong>

                  </div>

                </div>

              </div>

            </section>

          </div>

        )}

      </main>

    </div>
  );
}

export default DoctorDashboard;
