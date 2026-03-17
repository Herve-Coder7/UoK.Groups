import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase setup
const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kc3FrcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ Wait for page to fully load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submitBtn").addEventListener("click", registerStudent)
  document.getElementById("checkBtn").addEventListener("click", checkGroup)
})

// ---------------- REGISTER ----------------
async function registerStudent() {
  const name = document.getElementById("name").value.trim()
  const reg = document.getElementById("reg").value.trim()
  const gender = document.getElementById("gender").value

  if (!name || !reg || !gender) {
    alert("Please fill all fields")
    return
  }

  try {
    const { data: existing, error: selectError } = await supabase
      .from("students")
      .select()
      .eq("reg", reg)

    if (selectError) throw selectError

    if (existing && existing.length > 0) {
      alert("This registration number already exists")
      return
    }

    const { error: insertError } = await supabase
      .from("students")
      .insert([{ name, reg, gender }])

    if (insertError) throw insertError

    document.getElementById("msg").textContent = "Registered successfully!"
    document.getElementById("msg").style.color = "green"

    document.getElementById("name").value = ""
    document.getElementById("reg").value = ""
    document.getElementById("gender").value = ""

  } catch (err) {
    console.error(err)
    document.getElementById("msg").textContent = "Error registering. Check console."
    document.getElementById("msg").style.color = "red"
  }
}

// ---------------- CHECK GROUP ----------------
async function checkGroup() {
  const reg = document.getElementById("checkReg").value.trim()

  if (!reg) {
    alert("Enter your registration number")
    return
  }

  const { data, error } = await supabase
    .from("students")
    .select("name, group_number")
    .eq("reg", reg)
    .single()

  if (error || !data) {
    document.getElementById("groupResult").textContent = "Student not found"
    document.getElementById("groupResult").style.color = "red"
    return
  }

  if (!data.group_number) {
    document.getElementById("groupResult").textContent =
      `${data.name}, your group has not been assigned yet.`
    document.getElementById("groupResult").style.color = "orange"
    return
  }

  document.getElementById("groupResult").textContent =
    `${data.name}, you are in Group ${data.group_number}`
  document.getElementById("groupResult").style.color = "green"
}
