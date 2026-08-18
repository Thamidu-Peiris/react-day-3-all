import { useState } from "react"
import Modal from "../../components/ui/Modal"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import Btn from "../../components/ui/Btn"
import createStudentSchema from "../../validation/createstudent.schema.js"
import { validateForm } from "../../validation/validation.schema.js"

const BRANCHES = [
  { id: 'b1', name: 'Downtown Campus', city: 'New York', studentCount: 142, activeCount: 128, manager: 'Sarah Chen', status: 'active' },
  { id: 'b2', name: 'Westside Center', city: 'Los Angeles', studentCount: 98, activeCount: 84, manager: 'Marcus Rivera', status: 'active' },
  { id: 'b3', name: 'Northgate Branch', city: 'Chicago', studentCount: 67, activeCount: 61, manager: 'Priya Patel', status: 'active' },
  { id: 'b4', name: 'Eastpark Hub', city: 'Houston', studentCount: 54, activeCount: 39, manager: 'James O\'Brien', status: 'active' },
  { id: 'b5', name: 'Southside Studio', city: 'Phoenix', studentCount: 33, activeCount: 20, manager: 'Aisha Williams', status: 'inactive' },
  { id: 'b6', name: 'Harbor View', city: 'Seattle', studentCount: 78, activeCount: 71, manager: 'Tom Nakamura', status: 'active' },
]

export default function CreateStudentModal({ onClose, onSave ,apiLoading }) {
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    phone: '', 
    course: '', 
    branchId: 'b1', 
    age: '' 
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    const value = e && e.target ? e.target.value : e
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSave = () => {
    const result = validateForm(createStudentSchema, {
      name: form.name,
      age: String(form.age),
      email: form.email,
      phone: form.phone,
      course: form.course,
      branchId: form.branchId,
    })

    if (!result.success) {
      setErrors(result.errors)
      return
    }

    onSave({
      name: form.name,
      email: form.email,
      phone: form.phone,
      branchId: form.branchId,
      course: form.course || 'General',
      avatar: form.name
        .split(' ')
        .map(w => w[0])
        .join('').slice(0, 2)
        .toUpperCase(),
      age: form.age
    });
  };

  return (
    <Modal title="Create Student" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name *</label>
            <Input 
              placeholder="Jane Doe" 
              value={form.name} 
              onChange={(value)=>updateField('name', value)} 
              error={errors.name}
              className="w-full" 
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Age</label>
            <Input 
              placeholder="22" 
              type="number" 
              value={form.age} 
              onChange={(value)=>updateField('age', value)} 
              error={errors.age}
              className="w-full" 
            />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Email *</label>
          <Input 
            placeholder="jane@example.com" 
            type="email" 
            value={form.email} 
            onChange={(value)=>updateField('email', value)} 
            error={errors.email}
            className="w-full" 
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Phone</label>
          <Input 
            placeholder="+1 (555) 000-0000" 
            value={form.phone} 
            onChange={set('phone')} 
            error={errors.phone}
            className="w-full" 
          />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Course</label>
          <Input 
            placeholder="Full-Stack Development" 
            value={form.course} 
            onChange={(value)=>updateField('course', value)} 
            error={errors.course}
            className="w-full" 
          />
          {errors.course && <p className="text-xs text-red-400 mt-1">{errors.course}</p>}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Branch</label>
          <Select
            value={form.branchId}
            onChange={set('branchId')}
            options={BRANCHES.map(b => ({ label: b.name, value: b.id }))}
            className="w-full"
          />
          {errors.branchId && <p className="text-xs text-red-400 mt-1">{errors.branchId}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={apiLoading}  loading={apiLoading} variant="primary" onClick={handleSave}>Create Student</Btn>
        </div>
      </div>
    </Modal>
  )
}
