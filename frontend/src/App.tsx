import { useEffect, useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

type Student = {
  id: number;
  name: string;
  email: string;
  department: string;
  cgpa: number;
};

type StudentsResponse = {
  data: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const API = 'http://localhost:3000/api/students';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [cgpaMin, setCgpaMin] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    cgpa: '',
  });

  useEffect(() => {
    setPage(1);
  }, [search, cgpaMin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, cgpaMin, page]);

  async function fetchStudents() {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search.trim()) {
        params.set('search', search.trim());
      }

      if (cgpaMin) {
        params.set('cgpa_min', cgpaMin);
      }

      const response = await fetch(`${API}?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const result: StudentsResponse = await response.json();

      setStudents(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error(error);
      toast.error('Backend connection failed.');
    } finally {
      setLoading(false);
    }
  }

  async function createStudent(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'admin',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          department: form.department.trim(),
          cgpa: Number(form.cgpa),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create student');
      }

      toast.success('Student created successfully.');
      setForm({
        name: '',
        email: '',
        department: '',
        cgpa: '',
      });
      setShowForm(false);
      setPage(1);
      await fetchStudents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create student.');
    } finally {
      setSaving(false);
    }
  }

  const visibleStudents = [...students].sort((a, b) => a.id - b.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <Toaster richColors position="top-right" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Management
            </h1>
        
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Student
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-4 rounded-xl bg-white p-5 shadow">
          <div className="relative min-w-[280px] flex-1">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or department..."
              className="w-full rounded-lg border px-3 py-2.5 pl-10 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={cgpaMin}
            onChange={(event) => setCgpaMin(event.target.value)}
            placeholder="Minimum CGPA"
            className="w-48 rounded-lg border px-3 py-2.5 outline-none"
          />

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCgpaMin('');
            }}
            className="rounded-lg border px-4 py-2.5 hover:bg-gray-100"
          >
            Clear
          </button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="flex flex-wrap justify-between gap-2 border-b p-4">
            <span className="font-medium">
              {loading ? 'Searching...' : `${total} students found`}
            </span>

            <span className="text-gray-500">
              Ordered by ID
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {['ID', 'Name', 'Email', 'Department', 'CGPA'].map((heading) => (
                    <th key={heading} className="p-4 text-left">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{student.id}</td>
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.department}</td>
                    <td className="p-4">{student.cgpa}</td>
                  </tr>
                ))}

                {!loading && visibleStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages || 1}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Create Student
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createStudent} className="space-y-4">
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Student name"
                className="w-full rounded-lg border px-3 py-2.5"
              />

              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="Email"
                className="w-full rounded-lg border px-3 py-2.5"
              />

              <input
                required
                value={form.department}
                onChange={(event) =>
                  setForm({ ...form, department: event.target.value })
                }
                placeholder="Department"
                className="w-full rounded-lg border px-3 py-2.5"
              />

              <input
                required
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.cgpa}
                onChange={(event) =>
                  setForm({ ...form, cgpa: event.target.value })
                }
                placeholder="CGPA"
                className="w-full rounded-lg border px-3 py-2.5"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Create Student'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
