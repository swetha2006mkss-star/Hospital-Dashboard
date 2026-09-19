import { useEffect, useState } from "react";
import "./Patients.css";

const API = "http://localhost:8080/api";

function Patients() {
  const username = localStorage.getItem("username") || "Patient";
  const userId = Number(localStorage.getItem("userId"));

  const [activePage, setActivePage] = useState("Dashboard");

  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        patientsResponse,
        doctorsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        fetch(`${API}/patients`),
        fetch(`${API}/doctors`),
        fetch(`${API}/appointments`),
      ]);

      if (!patientsResponse.ok) {
        throw new Error("Unable to load patients");
      }

      if (!doctorsResponse.ok) {
        throw new Error("Unable to load doctors");
      }

      if (!appointmentsResponse.ok) {
        throw new Error("Unable to load appointments");
      }

      const patientsData = await patientsResponse.json();
      const doctorsData = await doctorsResponse.json();
      const appointmentsData =
        await appointmentsResponse.json();

      const loggedPatient =
        patientsData.find(
          (p) => Number(p.userId) === userId
        ) ||
        patientsData.find(
          (p) =>
            String(p.patientName).toLowerCase() ===
            String(username).toLowerCase()
        );

      setPatient(loggedPatient || null);
      setDoctors(doctorsData || []);
      setAppointments(appointmentsData || []);

      if (loggedPatient) {
        setAge(
          loggedPatient.age &&
          Number(loggedPatient.age) !== 0
            ? loggedPatient.age
            : ""
        );

        setGender(loggedPatient.gender || "");
        setBloodGroup(loggedPatient.bloodGroup || "");
        setPhone(loggedPatient.phone || "");
      }
    } catch (error) {
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE PATIENT DETAILS
  // ==========================================

  const handleSaveDetails = async () => {
    if (!patient) {
      alert("Patient information not found");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API}/patients/${patient.patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: patient.patientId,
            userId: patient.userId,
            patientName: patient.patientName,
            age: age ? Number(age) : 0,
            gender,
            bloodGroup,
            phone,
            address: patient.address || "",
            admissionDate:
              patient.admissionDate || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to save patient details"
        );
      }

      const updatedPatient =
        await response.json();

      setPatient(updatedPatient);

      alert("Details saved successfully!");
    } catch (error) {
      console.error(
        "Save details error:",
        error
      );

      alert(
        "Unable to save details. Please check backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!patient) {
      alert("Patient information not found");
      return;
    }

    if (!selectedDoctor) {
      alert("Please select a doctor");
      return;
    }

    if (!appointmentDate) {
      alert("Please select appointment date");
      return;
    }

    if (!appointmentTime) {
      alert("Please select appointment time");
      return;
    }

    const bookingData = {
      patientId: Number(patient.patientId),
      doctorId: Number(selectedDoctor),
      appointmentDate,
      appointmentTime,
      status: "Pending",
    };

    setBooking(true);

    try {
      const response = await fetch(
        `${API}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        console.error(
          "Appointment backend error:",
          responseText
        );

        throw new Error(
          responseText ||
            "Unable to book appointment"
        );
      }

      alert(
        "Appointment booked successfully!"
      );

      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");

      await loadData();

      setActivePage("Appointments");
    } catch (error) {
      console.error(
        "Appointment booking error:",
        error
      );

      alert(
        "Unable to book appointment. Please check backend."
      );
    } finally {
      setBooking(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    window.location.reload();
  };

  // ==========================================
  // APPOINTMENT DATA
  // ==========================================

  const myAppointments = patient
    ? appointments.filter(
        (appointment) =>
          Number(appointment.patientId) ===
          Number(patient.patientId)
      )
    : [];

  const upcomingAppointments =
    myAppointments.filter(
      (appointment) =>
        appointment.status === "Pending" ||
        appointment.status === "Scheduled"
    );

  const completedAppointments =
    myAppointments.filter(
      (appointment) =>
        appointment.status === "Completed"
    );

  const availableDoctors = doctors.filter(
    (doctor) =>
      doctor.availabilityStatus ===
      "Available"
  );

  // ==========================================
  // DOCTOR DETAILS
  // ==========================================

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(
      (d) =>
        Number(d.doctorId) ===
        Number(doctorId)
    );

    return doctor
      ? doctor.doctorName
      : "Doctor";
  };

  const getDoctorSpecialization = (
    doctorId
  ) => {
    const doctor = doctors.find(
      (d) =>
        Number(d.doctorId) ===
        Number(doctorId)
    );

    return doctor
      ? doctor.specialization
      : "";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="patient-dashboard">
        <div className="patient-main-content">
          <h2>
            Loading Patient Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="patient-dashboard">

      {/* SIDEBAR */}

      <aside className="patient-sidebar">

        <div className="patient-brand">

          <div className="patient-brand-icon">
            ♥
          </div>

          <div>
            <h2>Hospital</h2>
            <span>Dashboard</span>
          </div>

        </div>

        <div className="patient-menu">

          <button
            className={
              activePage === "Dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              activePage === "Appointments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Appointments")
            }
          >
            📅 My Appointments
          </button>

          <button
            className={
              activePage === "Doctors"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Doctors")
            }
          >
            👨‍⚕️ Doctors
          </button>

          <button
            className={
              activePage ===
              "Medical History"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Medical History"
              )
            }
          >
            📋 Medical History
          </button>

        </div>

        <button
          className="patient-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="patient-main-content">

        {/* HEADER */}

        <div className="patient-top-header">

          <div>

            <p className="patient-small-title">
              Patient Portal
            </p>

            <h1>{activePage}</h1>

          </div>

          <div className="patient-user-info">

            <div className="patient-user-avatar">
              👤
            </div>

            <div>
              <strong>{username}</strong>
              <span>Patient</span>
            </div>

          </div>

        </div>

        {/* ======================================
            DASHBOARD
           ====================================== */}

        {activePage === "Dashboard" && (
          <>

            <div className="patient-welcome">

              <h2>
                Welcome,{" "}
                {patient?.patientName ||
                  username}
              </h2>

              <p>
                Manage your appointments and
                health information from your
                dashboard.
              </p>

            </div>

            {/* PATIENT DETAILS */}

            <div className="patient-details-card">

              <div className="patient-details-left">

                <div className="patient-profile-icon">
                  👤
                </div>

                <div className="patient-basic-info">

                  <h2>
                    {patient?.patientName ||
                      username}
                  </h2>

                  <p>
                    Patient ID: #
                    {patient?.patientId ||
                      "-"}
                  </p>

                  <span>
                    Patient
                  </span>

                </div>

              </div>

              <div className="patient-details-form">

                <div className="patient-detail-field">

                  <label>Age</label>

                  <input
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value)
                    }
                    placeholder="Age"
                  />

                </div>

                <div className="patient-detail-field">

                  <label>Gender</label>

                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value)
                    }
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="patient-detail-field">

                  <label>
                    Blood Group
                  </label>

                  <select
                    value={bloodGroup}
                    onChange={(e) =>
                      setBloodGroup(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Blood Group
                    </option>

                    <option value="A+">
                      A+
                    </option>

                    <option value="A-">
                      A-
                    </option>

                    <option value="B+">
                      B+
                    </option>

                    <option value="B-">
                      B-
                    </option>

                    <option value="AB+">
                      AB+
                    </option>

                    <option value="AB-">
                      AB-
                    </option>

                    <option value="O+">
                      O+
                    </option>

                    <option value="O-">
                      O-
                    </option>

                  </select>

                </div>

                <div className="patient-detail-field">

                  <label>Phone</label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="Phone number"
                  />

                </div>

                <button
                  className="patient-save-button"
                  onClick={
                    handleSaveDetails
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Details"}
                </button>

              </div>

            </div>

            {/* STATS */}

            <div className="patient-stats-grid">

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  📅
                </div>

                <div>

                  <span>
                    My Appointments
                  </span>

                  <strong>
                    {myAppointments.length}
                  </strong>

                </div>

              </div>

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  ✅
                </div>

                <div>

                  <span>
                    Completed Visits
                  </span>

                  <strong>
                    {
                      completedAppointments.length
                    }
                  </strong>

                </div>

              </div>

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  👨‍⚕️
                </div>

                <div>

                  <span>
                    Available Doctors
                  </span>

                  <strong>
                    {availableDoctors.length}
                  </strong>

                </div>

              </div>

            </div>

            {/* UPCOMING + QUICK ACTIONS */}

            <div className="patient-dashboard-grid">

              <div className="patient-section-card">

                <div className="patient-section-header">

                  <h3>
                    Upcoming Appointment
                  </h3>

                  <button
                    onClick={() =>
                      setActivePage(
                        "Appointments"
                      )
                    }
                  >
                    View All
                  </button>

                </div>

                {upcomingAppointments.length >
                0 ? (

                  <div className="patient-appointment-item">

                    <div className="patient-doctor-avatar">
                      👨‍⚕️
                    </div>

                    <div className="patient-appointment-info">

                      <strong>
                        {getDoctorName(
                          upcomingAppointments[0]
                            .doctorId
                        )}
                      </strong>

                      <span>
                        {getDoctorSpecialization(
                          upcomingAppointments[0]
                            .doctorId
                        )}
                      </span>

                      <small>
                        📅{" "}
                        {
                          upcomingAppointments[0]
                            .appointmentDate
                        }{" "}
                        &nbsp; ⏰{" "}
                        {
                          upcomingAppointments[0]
                            .appointmentTime
                        }
                      </small>

                    </div>

                    <span className="patient-status-badge">
                      {
                        upcomingAppointments[0]
                          .status
                      }
                    </span>

                  </div>

                ) : (

                  <div className="patient-empty-state">

                    <span>📅</span>

                    <p>
                      No upcoming appointments
                    </p>

                  </div>

                )}

              </div>

              <div className="patient-section-card">

                <div className="patient-section-header">

                  <h3>
                    Quick Actions
                  </h3>

                </div>

                <div className="patient-quick-actions">

                  <button
                    onClick={() =>
                      setActivePage(
                        "Appointments"
                      )
                    }
                  >

                    <span>📅</span>

                    <div>

                      <strong>
                        Book Appointment
                      </strong>

                      <small>
                        Schedule a visit
                      </small>

                    </div>

                  </button>

                  <button
                    onClick={() =>
                      setActivePage("Doctors")
                    }
                  >

                    <span>👨‍⚕️</span>

                    <div>

                      <strong>
                        Find a Doctor
                      </strong>

                      <small>
                        View available doctors
                      </small>

                    </div>

                  </button>

                  <button
                    onClick={() =>
                      setActivePage(
                        "Medical History"
                      )
                    }
                  >

                    <span>📋</span>

                    <div>

                      <strong>
                        Medical History
                      </strong>

                      <small>
                        View past visits
                      </small>

                    </div>

                  </button>

                </div>

              </div>

            </div>

            {/* RECENT APPOINTMENTS */}

            <div className="patient-section-card">

              <div className="patient-section-header">

                <h3>
                  Recent Appointments
                </h3>

                <button
                  onClick={() =>
                    setActivePage(
                      "Appointments"
                    )
                  }
                >
                  View All
                </button>

              </div>

              {myAppointments.length > 0 ? (

                <div className="patient-table-container">

                  <table className="patient-table">

                    <thead>

                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>
                          Specialization
                        </th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {myAppointments
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .map(
                          (appointment) => (

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
                                {
                                  appointment.appointmentTime
                                }
                              </td>

                              <td>
                                {
                                  getDoctorName(
                                    appointment.doctorId
                                  )
                                }
                              </td>

                              <td>
                                {
                                  getDoctorSpecialization(
                                    appointment.doctorId
                                  )
                                }
                              </td>

                              <td>

                                <span className="patient-status-badge">
                                  {
                                    appointment.status
                                  }
                                </span>

                              </td>

                            </tr>

                          )
                        )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="patient-empty-state">

                  <span>📋</span>

                  <p>
                    No appointment history
                  </p>

                </div>

              )}

            </div>

          </>
        )}

        {/* ======================================
            APPOINTMENTS
           ====================================== */}

        {activePage === "Appointments" && (
          <>

            <div className="patient-page-card">

              <div className="patient-section-header">

                <div>

                  <h3>
                    Book New Appointment
                  </h3>

                  <p>
                    Select a doctor, date and
                    time.
                  </p>

                </div>

              </div>

              <form
                className="patient-booking-form"
                onSubmit={
                  handleBookAppointment
                }
              >

                <div className="patient-form-group">

                  <label>
                    Select Doctor
                  </label>

                  <select
                    value={selectedDoctor}
                    onChange={(e) =>
                      setSelectedDoctor(
                        e.target.value
                      )
                    }
                    required
                  >

                    <option value="">
                      Choose Doctor
                    </option>

                    {doctors
                      .filter(
                        (doctor) =>
                          doctor.availabilityStatus !==
                          "On Leave"
                      )
                      .map((doctor) => (

                        <option
                          key={
                            doctor.doctorId
                          }
                          value={
                            doctor.doctorId
                          }
                        >
                          Dr.{" "}
                          {doctor.doctorName}
                          {" - "}
                          {
                            doctor.specialization
                          }
                        </option>

                      ))}

                  </select>

                </div>

                <div className="patient-form-group">

                  <label>
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    value={appointmentDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setAppointmentDate(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="patient-form-group">

                  <label>
                    Appointment Time
                  </label>

                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) =>
                      setAppointmentTime(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="patient-book-button"
                  disabled={booking}
                >
                  {booking
                    ? "Booking..."
                    : "Book Appointment"}
                </button>

              </form>

            </div>

            <div className="patient-page-card">

              <div className="patient-section-header">

                <h3>
                  My Appointments
                </h3>

              </div>

              {myAppointments.length > 0 ? (

                <div className="patient-table-container">

                  <table className="patient-table">

                    <thead>

                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>
                          Specialization
                        </th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {myAppointments.map(
                        (appointment) => (

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
                              {
                                appointment.appointmentTime
                              }
                            </td>

                            <td>
                              {
                                getDoctorName(
                                  appointment.doctorId
                                )
                              }
                            </td>

                            <td>
                              {
                                getDoctorSpecialization(
                                  appointment.doctorId
                                )
                              }
                            </td>

                            <td>

                              <span className="patient-status-badge">
                                {
                                  appointment.status
                                }
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="patient-empty-state">

                  <span>📅</span>

                  <p>
                    No appointments found
                  </p>

                </div>

              )}

            </div>

          </>
        )}

        {/* ======================================
            DOCTORS
           ====================================== */}

        {activePage === "Doctors" && (

          <div className="patient-page-card">

            <div className="patient-section-header">

              <div>

                <h3>
                  Our Doctors
                </h3>

                <p>
                  View available doctors and
                  their specializations.
                </p>

              </div>

            </div>

            <div className="patient-doctors-grid">

              {doctors.map((doctor) => (

                <div
                  className="patient-doctor-card"
                  key={doctor.doctorId}
                >

                  <div className="patient-doctor-avatar large">
                    👨‍⚕️
                  </div>

                  <h3>
                    Dr.{" "}
                    {doctor.doctorName}
                  </h3>

                  <p>
                    {doctor.specialization}
                  </p>

                  <span
                    className={
                      doctor.availabilityStatus ===
                      "Available"
                        ? "doctor-available"
                        : "doctor-unavailable"
                    }
                  >
                    ●{" "}
                    {
                      doctor.availabilityStatus
                    }
                  </span>

                  {doctor.phone && (
                    <small>
                      📞 {doctor.phone}
                    </small>
                  )}

                  {doctor.email && (
                    <small>
                      ✉️ {doctor.email}
                    </small>
                  )}

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ======================================
            MEDICAL HISTORY
           ====================================== */}

        {activePage ===
          "Medical History" && (

          <div className="patient-page-card">

            <div className="patient-section-header">

              <div>

                <h3>
                  Medical History
                </h3>

                <p>
                  Your previous appointments
                  and visits.
                </p>

              </div>

            </div>

            {completedAppointments.length >
            0 ? (

              <div className="patient-table-container">

                <table className="patient-table">

                  <thead>

                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>
                        Specialization
                      </th>
                      <th>Status</th>
                    </tr>

                  </thead>

                  <tbody>

                    {completedAppointments.map(
                      (appointment) => (

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
                            {
                              appointment.appointmentTime
                            }
                          </td>

                          <td>
                            {
                              getDoctorName(
                                appointment.doctorId
                              )
                            }
                          </td>

                          <td>
                            {
                              getDoctorSpecialization(
                                appointment.doctorId
                              )
                            }
                          </td>

                          <td>

                            <span className="patient-status-badge">
                              Completed
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="patient-empty-state">

                <span>📋</span>

                <p>
                  No completed visits yet.
                </p>

              </div>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default Patients;