import { useState } from 'react';

interface EditDepartmentPanelProps {
  department: {
    departmentName: string;
    headOfDepartment: string;
    description: string;
    status: string;
  };
  users: { id: string; name: string; role: string }[];
  onClose: () => void;
  onSave: (updatedDepartment: {
    departmentName: string;
    headOfDepartment: string;
    description: string;
    status: string;
  }) => void;
}

const EditDepartmentPanel: React.FC<EditDepartmentPanelProps> = ({
  department,
  users,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(department);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit Department</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department Name</label>
            <input
              type="text"
              name="departmentName"
              value={form.departmentName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Head of Department</label>
            <select
              name="headOfDepartment"
              value={form.headOfDepartment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Head</option>
              {users
                .filter((u) => u.role === 'Admin' || u.role === 'Manager')
                .map((manager) => (
                  <option key={manager.id} value={manager.name}>
                    {manager.name} ({manager.role})
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentPanel;
