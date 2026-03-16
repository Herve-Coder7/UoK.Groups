import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase setup
const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kc3FrcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Settings
const GROUP_SIZE = 10
const MIN_FEMALES = 3

// Password check
let pwd = prompt("Enter admin password")
if (pwd !== "UoK2026.ICT") {
  alert("Access denied")
  window.location.href = "index.html"
}

// Load students
async function loadStudents() {
  try {
    const { data: students, error } = await supabase.from("students").select("*")

    if (error) throw error

    if (!students || students.length === 0) {
      document.getElementById("groups").innerHTML = "<p>No students registered yet.</p>"
      return
    }

    createGroups(students)
  } catch (err) {
    console.error(err)
    document.getElementById("groups").innerHTML = "<p style='color:red'>Error fetching students. Check console.</p>"
  }
}

// Grouping logic
function createGroups(students) {
  let females = students.filter(s => s.gender === "female")
  let males = students.filter(s => s.gender === "male")

  const totalGroups = Math.ceil(students.length / GROUP_SIZE)
  const groups = Array.from({ length: totalGroups }, () => [])

  // Distribute females first
  let g = 0
  females.forEach(f => {
    groups[g].push(f)
    g = (g + 1) % groups.length
  })

  // Distribute males
  males.forEach(m => {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].length < GROUP_SIZE) {
        groups[i].push(m)
        break
      }
    }
  })

  renderGroups(groups)
}

// Render groups in HTML
function renderGroups(groups) {
  const container = document.getElementById("groups")
  container.innerHTML = ""

  groups.forEach((group, i) => {
    const div = document.createElement("div")
    div.className = "group"

    const title = document.createElement("h3")
    title.textContent = "Group " + (i + 1)
    div.appendChild(title)

    group.forEach(s => {
      const p = document.createElement("p")
      p.textContent = `${s.name} (${s.reg})`
      div.appendChild(p)
    })

    container.appendChild(div)
  })
}

// Run
loadStudents()