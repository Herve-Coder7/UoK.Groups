import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 1️⃣ Supabase setup — replace with your credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2️⃣ Group settings
const GROUP_SIZE = 10
const MIN_FEMALES = 3

// 3️⃣ Password protection
let pwd = prompt("Enter admin password")
if (pwd !== "UoK2026.ICT") {
  alert("Access denied")
  window.location.href = "index.html"  // redirect to student page safely
}

// 4️⃣ Load students from Supabase
async function loadStudents() {
  let { data: students, error } = await supabase
    .from("students")
    .select("*")

  if (error) {
    console.error(error)
    alert("Error fetching students. Check console.")
    return
  }

  createGroups(students)
}

// 5️⃣ Grouping logic
function createGroups(students) {
  let females = students.filter(s => s.gender === "female")
  let males = students.filter(s => s.gender === "male")

  let totalGroups = Math.ceil(students.length / GROUP_SIZE)
  let groups = []
  for (let i = 0; i < totalGroups; i++) groups.push([])

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

// 6️⃣ Render groups in HTML
function renderGroups(groups) {
  let container = document.getElementById("groups")
  container.innerHTML = ""  // clear previous

  groups.forEach((group, i) => {
    let div = document.createElement("div")
    div.className = "group"

    let title = document.createElement("h3")
    title.textContent = "Group " + (i + 1)
    div.appendChild(title)

    group.forEach(s => {
      let p = document.createElement("p")
      p.textContent = `${s.name} (${s.reg})`
      div.appendChild(p)
    })

    container.appendChild(div)
  })
}

// 7️⃣ Run the loader
loadStudents()
