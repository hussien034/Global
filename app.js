// Global state management
let currentUser = null
let currentPage = "landing"

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  checkAuthState()
  initializeSampleData()
})

function initializeApp() {
  // Show landing page by default
  showPage("landing")

  // Initialize event listeners
  document.getElementById("post-form").addEventListener("submit", handlePostSubmit)
  document.getElementById("partner-form").addEventListener("submit", handlePartnerSubmit)

  // Show/hide job type field based on post type
  document.getElementById("post-type").addEventListener("change", function () {
    const jobTypeDiv = document.getElementById("job-type-div")
    jobTypeDiv.style.display = this.value === "job" ? "block" : "none"
  })
}

function checkAuthState() {
  const user = localStorage.getItem("currentUser")
  if (user) {
    currentUser = JSON.parse(user)
    updateNavigation()
  }
}

function initializeSampleData() {
  // Initialize sample jobs if not exists
  if (!localStorage.getItem("jobs")) {
    const sampleJobs = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        description: "Join our team as a Frontend Developer working with React and modern web technologies.",
        field: "technology",
        type: "full-time",
        tags: ["React", "JavaScript", "CSS"],
        postedBy: "company1",
        applicants: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Marketing Intern",
        company: "MarketPro",
        description: "Exciting internship opportunity in digital marketing and social media management.",
        field: "marketing",
        type: "internship",
        tags: ["Digital Marketing", "Social Media", "Analytics"],
        postedBy: "company2",
        applicants: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: "Financial Analyst",
        company: "Arab Bank",
        description: "Analyze financial data and provide insights for strategic decision making.",
        field: "finance",
        type: "full-time",
        tags: ["Excel", "Financial Modeling", "Analysis"],
        postedBy: "company3",
        applicants: [],
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("jobs", JSON.stringify(sampleJobs))
  }

  // Initialize sample trainings if not exists
  if (!localStorage.getItem("trainings")) {
    const sampleTrainings = [
      {
        id: 1,
        title: "Web Development Bootcamp",
        provider: "TechAcademy",
        description: "Comprehensive 12-week program covering HTML, CSS, JavaScript, and React.",
        field: "technology",
        duration: "12 weeks",
        enrollees: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Digital Marketing Certification",
        provider: "MarketingHub",
        description: "Learn modern digital marketing strategies and tools.",
        field: "marketing",
        duration: "8 weeks",
        enrollees: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: "Data Analysis with Python",
        provider: "DataScience Pro",
        description: "Master data analysis and visualization using Python and pandas.",
        field: "technology",
        duration: "10 weeks",
        enrollees: [],
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("trainings", JSON.stringify(sampleTrainings))
  }

  // Initialize users array if not exists
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }
}

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none"
  })

  // Show selected page
  const targetPage = document.getElementById(pageName + "-page")
  if (targetPage) {
    targetPage.style.display = "block"
    currentPage = pageName

    // Load page-specific content
    switch (pageName) {
      case "jobs":
        loadJobs()
        break
      case "trainings":
        loadTrainings()
        break
      case "user-dashboard":
        loadUserDashboard()
        break
      case "company-dashboard":
        loadCompanyDashboard()
        break
      case "admin-dashboard":
        loadAdminDashboard()
        break
    }
  }
}

function simulateGoogleLogin() {
  // Simulate Google OAuth flow
  document.getElementById("login-form").style.display = "none"
  document.getElementById("role-selection").style.display = "block"
}

function completeLogin(role) {
  // Simulate user creation
  const userData = {
    id: "user_" + Date.now(),
    name: "John Doe",
    email: "john.doe@example.com",
    role: role,
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date().toISOString(),
  }

  // Add admin user for demo
  if (role === "seeker" && !localStorage.getItem("adminCreated")) {
    const adminUser = {
      id: "admin_user",
      name: "Admin User",
      email: "admin@globalbridge.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    users.push(adminUser)
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("adminCreated", "true")
  }

  // Save user data
  currentUser = userData
  localStorage.setItem("currentUser", JSON.stringify(userData))

  // Add to users list
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  users.push(userData)
  localStorage.setItem("users", JSON.stringify(users))

  // Update navigation and redirect
  updateNavigation()
  showPage("landing")

  // Show success message
  alert("Welcome to GlobalBridge! You are now logged in as a " + role + ".")
}

function updateNavigation() {
  if (currentUser) {
    document.getElementById("login-nav").style.display = "none"
    document.getElementById("user-nav").style.display = "block"
    document.getElementById("user-name").textContent = currentUser.name

    // Show role-specific navigation
    if (currentUser.role === "seeker" || currentUser.role === "company" || currentUser.role === "admin") {
      document.getElementById("jobs-nav").style.display = "block"
      document.getElementById("trainings-nav").style.display = "block"
    }
  } else {
    document.getElementById("login-nav").style.display = "block"
    document.getElementById("user-nav").style.display = "none"
    document.getElementById("jobs-nav").style.display = "none"
    document.getElementById("trainings-nav").style.display = "none"
  }
}

function showDashboard() {
  if (!currentUser) {
    showPage("login")
    return
  }

  switch (currentUser.role) {
    case "seeker":
      showPage("user-dashboard")
      break
    case "company":
      showPage("company-dashboard")
      break
    case "admin":
      showPage("admin-dashboard")
      break
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  updateNavigation()
  showPage("landing")
  alert("You have been logged out successfully.")
}

function loadJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
  const jobsList = document.getElementById("jobs-list")

  if (jobs.length === 0) {
    jobsList.innerHTML =
      '<div class="col-12"><p class="text-center text-muted">No jobs available at the moment.</p></div>'
    return
  }

  jobsList.innerHTML = jobs
    .map(
      (job) => `
        <div class="col-md-6 col-lg-4">
            <div class="card job-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                    <p class="card-text">${job.description}</p>
                    <div class="mb-3">
                        <span class="badge bg-primary me-1">${job.field}</span>
                        <span class="badge bg-secondary me-1">${job.type}</span>
                        ${job.tags.map((tag) => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join("")}
                    </div>
                    ${
                      currentUser && currentUser.role === "seeker"
                        ? `<button class="btn btn-primary w-100" onclick="applyToJob(${job.id})">
                            <i class="fas fa-paper-plane me-1"></i>Apply Now
                        </button>`
                        : '<p class="text-muted"><small>Login as job seeker to apply</small></p>'
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function filterJobs() {
  const typeFilter = document.getElementById("job-type-filter").value
  const fieldFilter = document.getElementById("job-field-filter").value

  let jobs = JSON.parse(localStorage.getItem("jobs") || "[]")

  if (typeFilter) {
    jobs = jobs.filter((job) => job.type === typeFilter)
  }

  if (fieldFilter) {
    jobs = jobs.filter((job) => job.field === fieldFilter)
  }

  const jobsList = document.getElementById("jobs-list")

  if (jobs.length === 0) {
    jobsList.innerHTML = '<div class="col-12"><p class="text-center text-muted">No jobs match your filters.</p></div>'
    return
  }

  jobsList.innerHTML = jobs
    .map(
      (job) => `
        <div class="col-md-6 col-lg-4">
            <div class="card job-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                    <p class="card-text">${job.description}</p>
                    <div class="mb-3">
                        <span class="badge bg-primary me-1">${job.field}</span>
                        <span class="badge bg-secondary me-1">${job.type}</span>
                        ${job.tags.map((tag) => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join("")}
                    </div>
                    ${
                      currentUser && currentUser.role === "seeker"
                        ? `<button class="btn btn-primary w-100" onclick="applyToJob(${job.id})">
                            <i class="fas fa-paper-plane me-1"></i>Apply Now
                        </button>`
                        : '<p class="text-muted"><small>Login as job seeker to apply</small></p>'
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function applyToJob(jobId) {
  if (!currentUser || currentUser.role !== "seeker") {
    alert("Please login as a job seeker to apply.")
    return
  }

  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
  const jobIndex = jobs.findIndex((job) => job.id === jobId)

  if (jobIndex === -1) {
    alert("Job not found.")
    return
  }

  // Check if already applied
  if (jobs[jobIndex].applicants.includes(currentUser.id)) {
    alert("You have already applied to this job.")
    return
  }

  // Add application
  jobs[jobIndex].applicants.push(currentUser.id)
  localStorage.setItem("jobs", JSON.stringify(jobs))

  // Save application to user's applications
  const applications = JSON.parse(localStorage.getItem("applications_" + currentUser.id) || "[]")
  applications.push({
    jobId: jobId,
    jobTitle: jobs[jobIndex].title,
    company: jobs[jobIndex].company,
    appliedAt: new Date().toISOString(),
    status: "pending",
  })
  localStorage.setItem("applications_" + currentUser.id, JSON.stringify(applications))

  alert("Application submitted successfully!")
}

function loadTrainings() {
  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
  const trainingsList = document.getElementById("trainings-list")

  if (trainings.length === 0) {
    trainingsList.innerHTML =
      '<div class="col-12"><p class="text-center text-muted">No training programs available at the moment.</p></div>'
    return
  }

  trainingsList.innerHTML = trainings
    .map(
      (training) => `
        <div class="col-md-6 col-lg-4">
            <div class="card training-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${training.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${training.provider}</h6>
                    <p class="card-text">${training.description}</p>
                    <div class="mb-3">
                        <span class="badge bg-success me-1">${training.field}</span>
                        <span class="badge bg-info text-dark">${training.duration}</span>
                    </div>
                    ${
                      currentUser && currentUser.role === "seeker"
                        ? `<button class="btn btn-success w-100" onclick="enrollInTraining(${training.id})">
                            <i class="fas fa-graduation-cap me-1"></i>Enroll Now
                        </button>`
                        : '<p class="text-muted"><small>Login as job seeker to enroll</small></p>'
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function enrollInTraining(trainingId) {
  if (!currentUser || currentUser.role !== "seeker") {
    alert("Please login as a job seeker to enroll.")
    return
  }

  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
  const trainingIndex = trainings.findIndex((training) => training.id === trainingId)

  if (trainingIndex === -1) {
    alert("Training not found.")
    return
  }

  // Check if already enrolled
  if (trainings[trainingIndex].enrollees.includes(currentUser.id)) {
    alert("You are already enrolled in this training.")
    return
  }

  // Add enrollment
  trainings[trainingIndex].enrollees.push(currentUser.id)
  localStorage.setItem("trainings", JSON.stringify(trainings))

  // Save enrollment to user's enrollments
  const enrollments = JSON.parse(localStorage.getItem("enrollments_" + currentUser.id) || "[]")
  enrollments.push({
    trainingId: trainingId,
    trainingTitle: trainings[trainingIndex].title,
    provider: trainings[trainingIndex].provider,
    enrolledAt: new Date().toISOString(),
    status: "enrolled",
  })
  localStorage.setItem("enrollments_" + currentUser.id, JSON.stringify(enrollments))

  alert("Enrollment successful!")
}

function loadUserDashboard() {
  if (!currentUser || currentUser.role !== "seeker") {
    showPage("login")
    return
  }

  // Load applied jobs
  const applications = JSON.parse(localStorage.getItem("applications_" + currentUser.id) || "[]")
  const appliedJobsDiv = document.getElementById("applied-jobs")

  if (applications.length === 0) {
    appliedJobsDiv.innerHTML = '<p class="text-muted">No job applications yet.</p>'
  } else {
    appliedJobsDiv.innerHTML = applications
      .map(
        (app) => `
            <div class="border-bottom pb-2 mb-2">
                <h6 class="mb-1">${app.jobTitle}</h6>
                <small class="text-muted">${app.company}</small>
                <div class="mt-1">
                    <span class="badge status-badge ${app.status === "pending" ? "bg-warning" : app.status === "accepted" ? "bg-success" : "bg-danger"}">${app.status}</span>
                    <small class="text-muted ms-2">Applied: ${new Date(app.appliedAt).toLocaleDateString()}</small>
                </div>
            </div>
        `,
      )
      .join("")
  }

  // Load enrolled trainings
  const enrollments = JSON.parse(localStorage.getItem("enrollments_" + currentUser.id) || "[]")
  const enrolledTrainingsDiv = document.getElementById("enrolled-trainings")

  if (enrollments.length === 0) {
    enrolledTrainingsDiv.innerHTML = '<p class="text-muted">No training enrollments yet.</p>'
  } else {
    enrolledTrainingsDiv.innerHTML = enrollments
      .map(
        (enrollment) => `
            <div class="border-bottom pb-2 mb-2">
                <h6 class="mb-1">${enrollment.trainingTitle}</h6>
                <small class="text-muted">${enrollment.provider}</small>
                <div class="mt-1">
                    <span class="badge status-badge bg-success">${enrollment.status}</span>
                    <small class="text-muted ms-2">Enrolled: ${new Date(enrollment.enrolledAt).toLocaleDateString()}</small>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function loadCompanyDashboard() {
  if (!currentUser || currentUser.role !== "company") {
    showPage("login")
    return
  }

  // Load company postings
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  const companyJobs = jobs.filter((job) => job.postedBy === currentUser.id)
  const companyTrainings = trainings.filter((training) => training.postedBy === currentUser.id)

  const postingsDiv = document.getElementById("company-postings")

  let postingsHTML = ""

  if (companyJobs.length > 0) {
    postingsHTML += "<h6>Posted Jobs</h6>"
    companyJobs.forEach((job) => {
      const applicantNames = job.applicants.map((applicantId) => {
        const user = users.find((u) => u.id === applicantId)
        return user ? user.name : "Unknown User"
      })

      postingsHTML += `
                <div class="border rounded p-3 mb-3">
                    <h6>${job.title}</h6>
                    <p class="text-muted mb-2">${job.description}</p>
                    <div class="mb-2">
                        <span class="badge bg-primary me-1">${job.field}</span>
                        <span class="badge bg-secondary">${job.type}</span>
                    </div>
                    <div>
                        <strong>Applicants (${job.applicants.length}):</strong>
                        ${applicantNames.length > 0 ? applicantNames.join(", ") : "No applicants yet"}
                    </div>
                    <button class="btn btn-sm btn-danger mt-2" onclick="deletePosting('job', ${job.id})">Delete</button>
                </div>
            `
    })
  }

  if (companyTrainings.length > 0) {
    postingsHTML += '<h6 class="mt-4">Posted Trainings</h6>'
    companyTrainings.forEach((training) => {
      const enrolleeNames = training.enrollees.map((enrolleeId) => {
        const user = users.find((u) => u.id === enrolleeId)
        return user ? user.name : "Unknown User"
      })

      postingsHTML += `
                <div class="border rounded p-3 mb-3">
                    <h6>${training.title}</h6>
                    <p class="text-muted mb-2">${training.description}</p>
                    <div class="mb-2">
                        <span class="badge bg-success me-1">${training.field}</span>
                        <span class="badge bg-info text-dark">${training.duration}</span>
                    </div>
                    <div>
                        <strong>Enrollees (${training.enrollees.length}):</strong>
                        ${enrolleeNames.length > 0 ? enrolleeNames.join(", ") : "No enrollees yet"}
                    </div>
                    <button class="btn btn-sm btn-danger mt-2" onclick="deletePosting('training', ${training.id})">Delete</button>
                </div>
            `
    })
  }

  if (postingsHTML === "") {
    postingsHTML = '<p class="text-muted">No postings yet. Create your first job or training posting!</p>'
  }

  postingsDiv.innerHTML = postingsHTML
}

function handlePostSubmit(e) {
  e.preventDefault()

  if (!currentUser || currentUser.role !== "company") {
    alert("Only companies can post opportunities.")
    return
  }

  const type = document.getElementById("post-type").value
  const title = document.getElementById("post-title").value
  const description = document.getElementById("post-description").value
  const field = document.getElementById("post-field").value
  const jobType = document.getElementById("post-job-type").value

  if (type === "job") {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const newJob = {
      id: Date.now(),
      title: title,
      company: currentUser.name,
      description: description,
      field: field,
      type: jobType,
      tags: [field, jobType],
      postedBy: currentUser.id,
      applicants: [],
      createdAt: new Date().toISOString(),
    }
    jobs.push(newJob)
    localStorage.setItem("jobs", JSON.stringify(jobs))
  } else {
    const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
    const newTraining = {
      id: Date.now(),
      title: title,
      provider: currentUser.name,
      description: description,
      field: field,
      duration: "8 weeks", // Default duration
      postedBy: currentUser.id,
      enrollees: [],
      createdAt: new Date().toISOString(),
    }
    trainings.push(newTraining)
    localStorage.setItem("trainings", JSON.stringify(trainings))
  }

  // Reset form
  document.getElementById("post-form").reset()

  // Reload dashboard
  loadCompanyDashboard()

  alert(type.charAt(0).toUpperCase() + type.slice(1) + " posted successfully!")
}

function deletePosting(type, id) {
  if (!confirm("Are you sure you want to delete this posting?")) {
    return
  }

  if (type === "job") {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
    const filteredJobs = jobs.filter((job) => job.id !== id)
    localStorage.setItem("jobs", JSON.stringify(filteredJobs))
  } else {
    const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
    const filteredTrainings = trainings.filter((training) => training.id !== id)
    localStorage.setItem("trainings", JSON.stringify(filteredTrainings))
  }

  loadCompanyDashboard()
  alert("Posting deleted successfully!")
}

function loadAdminDashboard() {
  if (!currentUser || currentUser.role !== "admin") {
    showPage("login")
    return
  }

  showAdminTab("users")
}

function showAdminTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.style.display = "none"
  })

  // Update nav tabs
  document.querySelectorAll(".nav-tabs .nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  // Show selected tab
  document.getElementById("admin-" + tabName).style.display = "block"
  event.target.classList.add("active")

  // Load tab content
  switch (tabName) {
    case "users":
      loadAdminUsers()
      break
    case "jobs":
      loadAdminJobs()
      break
    case "trainings":
      loadAdminTrainings()
      break
  }
}

function loadAdminUsers() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const usersListDiv = document.getElementById("users-list")

  if (users.length === 0) {
    usersListDiv.innerHTML = '<p class="text-muted">No users registered yet.</p>'
    return
  }

  usersListDiv.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users
                      .map(
                        (user) => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><span class="badge bg-${user.role === "admin" ? "danger" : user.role === "company" ? "success" : "primary"}">${user.role}</span></td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                ${user.id !== currentUser.id ? `<button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>` : '<span class="text-muted">Current User</span>'}
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `
}

function loadAdminJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
  const jobsListDiv = document.getElementById("admin-jobs-list")

  if (jobs.length === 0) {
    jobsListDiv.innerHTML = '<p class="text-muted">No jobs posted yet.</p>'
    return
  }

  jobsListDiv.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Applicants</th>
                        <th>Posted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobs
                      .map(
                        (job) => `
                        <tr>
                            <td>${job.title}</td>
                            <td>${job.company}</td>
                            <td><span class="badge bg-primary">${job.field}</span></td>
                            <td><span class="badge bg-secondary">${job.type}</span></td>
                            <td>${job.applicants.length}</td>
                            <td>${new Date(job.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-danger" onclick="adminDeleteJob(${job.id})">Delete</button>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `
}

function loadAdminTrainings() {
  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
  const trainingsListDiv = document.getElementById("admin-trainings-list")

  if (trainings.length === 0) {
    trainingsListDiv.innerHTML = '<p class="text-muted">No training programs posted yet.</p>'
    return
  }

  trainingsListDiv.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Provider</th>
                        <th>Field</th>
                        <th>Duration</th>
                        <th>Enrollees</th>
                        <th>Posted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${trainings
                      .map(
                        (training) => `
                        <tr>
                            <td>${training.title}</td>
                            <td>${training.provider}</td>
                            <td><span class="badge bg-success">${training.field}</span></td>
                            <td>${training.duration}</td>
                            <td>${training.enrollees.length}</td>
                            <td>${new Date(training.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-danger" onclick="adminDeleteTraining(${training.id})">Delete</button>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `
}

function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) {
    return
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const filteredUsers = users.filter((user) => user.id !== userId)
  localStorage.setItem("users", JSON.stringify(filteredUsers))

  loadAdminUsers()
  alert("User deleted successfully!")
}

function adminDeleteJob(jobId) {
  if (!confirm("Are you sure you want to delete this job?")) {
    return
  }

  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]")
  const filteredJobs = jobs.filter((job) => job.id !== jobId)
  localStorage.setItem("jobs", JSON.stringify(filteredJobs))

  loadAdminJobs()
  alert("Job deleted successfully!")
}

function adminDeleteTraining(trainingId) {
  if (!confirm("Are you sure you want to delete this training?")) {
    return
  }

  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]")
  const filteredTrainings = trainings.filter((training) => training.id !== trainingId)
  localStorage.setItem("trainings", JSON.stringify(filteredTrainings))

  loadAdminTrainings()
  alert("Training deleted successfully!")
}

function handlePartnerSubmit(e) {
  e.preventDefault()

  // Simulate form submission
  alert("Thank you for your interest in partnering with GlobalBridge! We will contact you soon.")

  // Reset form
  document.getElementById("partner-form").reset()
}

// Utility functions
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Demo function to add admin user
function createAdminUser() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const adminExists = users.some((user) => user.role === "admin")

  if (!adminExists) {
    const adminUser = {
      id: "admin_demo",
      name: "Admin Demo",
      email: "admin@globalbridge.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
    }

    users.push(adminUser)
    localStorage.setItem("users", JSON.stringify(users))

    alert("Demo admin user created! Email: admin@globalbridge.com")
  }
}

// Add some demo data on first load
function addDemoData() {
  // Add demo company user
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const companyExists = users.some((user) => user.role === "company")

  if (!companyExists) {
    const companyUser = {
      id: "company_demo",
      name: "TechCorp Demo",
      email: "company@techcorp.com",
      role: "company",
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
    }

    users.push(companyUser)
    localStorage.setItem("users", JSON.stringify(users))
  }
}

// Initialize demo data
addDemoData()

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Alt + H for Home
  if (e.altKey && e.key === "h") {
    e.preventDefault()
    showPage("landing")
  }

  // Alt + J for Jobs
  if (e.altKey && e.key === "j" && currentUser) {
    e.preventDefault()
    showPage("jobs")
  }

  // Alt + T for Trainings
  if (e.altKey && e.key === "t" && currentUser) {
    e.preventDefault()
    showPage("trainings")
  }

  // Alt + D for Dashboard
  if (e.altKey && e.key === "d" && currentUser) {
    e.preventDefault()
    showDashboard()
  }
})

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = "smooth"

// Add loading states for better UX
function showLoading(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.innerHTML = '<div class="text-center p-4"><div class="loading"></div><p class="mt-2">Loading...</p></div>'
  }
}

// Add error handling
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error)
  alert("An error occurred. Please refresh the page and try again.")
})

// Add responsive navigation handling
function handleResponsiveNav() {
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    // Close mobile menu when clicking on nav links
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) {
          navbarCollapse.classList.remove("show")
        }
      })
    })
  }
}

// Initialize responsive navigation
handleResponsiveNav()

// Add search functionality (future enhancement)
function initializeSearch() {
  // This can be expanded to add search functionality across jobs and trainings
  console.log("Search functionality ready for implementation")
}

// Add notification system (future enhancement)
function showNotification(message, type = "info") {
  // This can be expanded to show toast notifications
  console.log(`Notification (${type}): ${message}`)
}

// Add analytics tracking (future enhancement)
function trackEvent(eventName, eventData = {}) {
  // This can be expanded to track user interactions
  console.log(`Event tracked: ${eventName}`, eventData)
}

// Initialize all features
document.addEventListener("DOMContentLoaded", () => {
  initializeSearch()

  // Track page load
  trackEvent("page_load", { page: "landing" })
})
