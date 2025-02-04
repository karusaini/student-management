import { useState, useEffect } from "react";

export default function EditStudentModal({
  onClose,
  student,
  onUpdateStudent,
}) {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    rollNumber: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        class: student.class,
        section: student.section,
        rollNumber: student.rollNumber,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateStudent) {
      onUpdateStudent({ ...student, ...formData }); // Ensure the correct object is sent
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Edit Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="Class"
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="Section"
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-500 "
          />
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Roll Number"
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
