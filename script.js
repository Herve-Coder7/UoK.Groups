import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kc3FrcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function registerStudent() {
  let name = document.getElementById("name").value.trim()
  let reg = document.getElementById("reg").value.trim()
  let gender = document.getElementById("gender").value

  if (!name || !reg || !gender) {
    alert("Please fill all fields")
    return
  }

  // Check duplicate registration
  let { data: existing } = await supabase
    .from("students")
    .select()
    .eq("reg", reg)

  if (existing && existing.length > 0) {
    alert("Registration number already exists")
    return
  }

  // Insert into Supabase
  let { error } = await supabase
    .from("students")
    .insert([{ name, reg, gender }])

  if (error) {
    console.error(error)
    alert("Error saving registration")
  } else {
    document.getElementById("msg").textContent = "Registered successfully!"
    document.getElementById("name").value = ""
    document.getElementById("reg").value = ""
    document.getElementById("gender").value = ""
  }
}