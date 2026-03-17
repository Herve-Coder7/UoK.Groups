import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ------------------ Supabase Setup ------------------
const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kc3FrcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ------------------ Settings ------------------
const GROUP_SIZE = 10
const MIN_FEMALES = 3

// ------------------ Password Protection ------------------
let pwd = prompt("Enter admin password")
if (pwd !== "UoK2026.ICT") {
  alert("Access denied")
  window.location.href = "index.html"
}

// ------------------ On Page Load ------------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateGroups)
  loadStudents()
})

// ------------------ Load & Display Students ------------------
async function loadStudents() {
  try {
    const { data: students, error } = await supabase.from("students").select("*")
    if (error) throw error

    if (!students || students.length === 0) {
      document.getElementById("groups").innerHTML = "<p>No students registered yet.</p>"
      return
    }

    displayGroups(students)
  } catch (err) {
    console.error(err)
    document.getElementById("groups").innerHTML =
      "<p style='color:red'>Error fetching students. Check console.</p>"
  }
}

// ------------------ Generate & Assign Groups ------------------
async function generateGroups() {
  const { data: students, error } = await supabase.from("students").select("*")
  if (error) {
    console.error(error)
    return
  }

  if (!students || students.length === 0) {
    alert("No students to group")
    return
  }

  let females = students.filter(s => s.gender === "female")
  let males = students.filter(s => s.gender === "male")

  let groups = []
  let groupNumber = 1

  while (males.length > 0 || females.length > 0) {
    let group = []

    // Ensure at least 3 females if possible
    for (let i = 0; i < MIN_FEMALES && females.length > 0; i++) {
      group.push(females.pop())
    }

    // Fill remaining spots up to GROUP_SIZE
    while (group.length < GROUP_SIZE && (males.length > 0 || females.length > 0)) {
      if (males.length > 0) group.push(males.pop())
      else group.push(females.pop())
    }

    // Bulk update group_number in Supabase
    const regs = group.map(s => s.reg)
    const { error: updateError } = await supabase
      .from("students")
      .update({ group_number: groupNumber })
      .in("reg", regs)

    if (updateError) console.error(updateError)

    groups.push(group)
    groupNumber++
  }

  alert("Groups generated and saved successfully!")
  loadStudents()
}

// ------------------ Display Groups ------------------
function displayGroups(students) {
  const container = document.getElementById("groups")
  container.innerHTML = ""

  const grouped = {}
  students.forEach(s => {
    const g = s.group_number || "Unassigned"
    if (!grouped[g]) grouped[g] = []
    grouped[g].push(s)
  })

  for (let group in grouped) {
    const div = document.createElement("div")
    div.className = "group"
    div.innerHTML = `<h3>Group ${group}</h3>`

    grouped[group].forEach(student => {
      const p = document.createElement("p")
      p.textContent = `${student.name} (${student.reg})`

      // Remove button
      const removeBtn = document.createElement("button")
      removeBtn.textContent = "Remove"
      removeBtn.onclick = () => removeStudent(student.reg)

      // Move button
      const moveBtn = document.createElement("button")
      moveBtn.textContent = "Move"
      moveBtn.onclick = () => {
        const newGroup = prompt("Enter new group number:")
        if (newGroup) moveStudent(student.reg, parseInt(newGroup))
      }

      p.appendChild(removeBtn)
      p.appendChild(moveBtn)

      div.appendChild(p)
    })

    container.appendChild(div)
  }
}

// ------------------ Remove Student ------------------
async function removeStudent(reg) {
  if (!confirm("Remove this student?")) return

  const { error } = await supabase.from("students").delete().eq("reg", reg)
  if (error) {
    alert("Error removing student")
    console.error(error)
  } else {
    loadStudents()
  }
}

// ------------------ Move Student ------------------
async function moveStudent(reg, newGroup) {
  const { error } = await supabase
    .from("students")
    .update({ group_number: newGroup })
    .eq("reg", reg)

  if (error) {
    alert("Error moving student")
    console.error(error)
  } else {
    loadStudents()
  }
}
